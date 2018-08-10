import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-edit-service',
    templateUrl: './edit-service.component.html',
    styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {

    public access_token = '';

    myForm: FormGroup;
    myForm2: FormGroup;

    category_list: any[];

    productName: FormControl;
    productDescription: FormControl;
    productPrice: FormControl;
    productImage: FormControl;
    productCategory: FormControl;
    paymentMethod: FormControl;
    priorityLevel: FormControl;
    currentPriorityLevel: any;

    service_name: any;

    selected_file: File = null;

    is_image_set: boolean;
    is_current_image: boolean;
    imagePreviewPath: any;
    currentImagePath: any;


    priorityList = [];
    priority: any;

    service_id: any;

    constructor(
        private activeRoute: ActivatedRoute,
        public router: Router,
        private apiServices: ApiServicesService,
        private spinner: NgxSpinnerService
    ) {
        this.activeRoute.params.subscribe(
            params => {
                this.service_id = params.id;
                console.log(params);
            }

        );

        this.access_token = localStorage.getItem('access_token')

    }

    ngOnInit() {

        this.priority = 0;
        this.currentPriorityLevel = 0;
        this.is_image_set = false;
        this.is_current_image = false;

        // check if user is logged in
        if (this.access_token) {


            this.getMasterProductCount(this.access_token);
            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {

                    // get categories 
                    this.getCategories(this.access_token);

                    // get details 
                    this.getProductDetailsById(this.service_id, this.access_token);
                },
                err => {
                    console.log(err);
                }
            )

        }
        else {
            this.apiServices.logout();
        }

        this.createFormControls();
        this.createForm();
        this.createForm2();
    }

    // get categories 
    getCategories(token) {
        this.apiServices.getCategoryByType(token, 2).subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success") {
                    this.category_list = res.data;
                }
            },
            err => {
                console.log(err);
            }
        )
    }

    // get product details 
    getProductDetailsById(product_id, token) {
        this.apiServices.getProductById(product_id, token).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {

                    this.currentPriorityLevel = res.data.priority;
  
                    this.service_name = res.data.name;
                    this.myForm.setValue({
                        productName: res.data.name,
                        productCategory: res.data.categoryId,
                        productDescription: res.data.description,
                        productPrice: res.data.estimatedPrice,
                        paymentMethod: res.data.paymentUnit,
                        priorityLevel:res.data.priority

                    });

                    let imgName = res.data.imageUrl;
                    // get image url 
                    this.apiServices.getImageUrlS3(imgName, token).subscribe(
                        (res: any) => {
                            // console.log(res);
                            this.is_current_image = true;
                            this.currentImagePath = 'data:image/jpeg;base64,' + res;
                        },
                        err => {
                            console.log('Error\n');
                            console.log(err);
                        }
                    )
                }
            },
            err => {
                console.log(err);
            }
        )
    }

    createFormControls() {

        this.productCategory = new FormControl('');
        this.paymentMethod = new FormControl('');
        this.productName = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
        this.productDescription = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]);
        this.productPrice = new FormControl(0, [Validators.required, Validators.minLength(1)]);
        this.productImage = new FormControl('', [Validators.required]);
        this.priorityLevel = new FormControl();


    }

    createForm() {
        this.myForm = new FormGroup({
            productCategory: this.productCategory,
            productName: this.productName,
            productDescription: this.productDescription,
            productPrice: this.productPrice,
            paymentMethod: this.paymentMethod,
            priorityLevel: this.priorityLevel
        });
    }

    createForm2() {
        this.myForm2 = new FormGroup({
            productImage: this.productImage
        });
    }

    validateAllFormFields(formGroup: FormGroup) {

        Object.keys(formGroup.controls).forEach(field => {

            const control = formGroup.get(field);

            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }

        });

    }

    onUpdateDetails() {
        if (this.myForm.valid) {
            this.spinner.show();

            const data = {
                name: this.myForm.value.productName,
                description: this.myForm.value.productDescription,
                estimatedPrice: this.myForm.value.productPrice,
                categoryId: this.myForm.value.productCategory,
                paymentUnit: this.myForm.value.paymentMethod,
                isProduct: false,
                productId: this.service_id
            }

            this.apiServices.updateServiceDetails(data, this.access_token).subscribe(
                (res: any) => {
                    this.spinner.hide();
                    console.log(res);
                    if (res.status == "success" && res.data == "product_updated") {

                        this.apiServices.altScc("Service details updated",  this.goToServicesList());
                    }
                },
                err => {
                    this.spinner.hide();
                    console.log(err);
                    this.apiServices.altErr("Unable to update service details", this.apiServices.reload());
                }
            )


        }
        else {
            this.validateAllFormFields(this.myForm);
        }
    }

    // get selected file 
    setImage(event) {
        this.is_image_set = true;

        this.selected_file = event.target.files[0];

        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.imagePreviewPath = event.target.result;
        }

        reader.readAsDataURL(event.target.files[0]);

    }

    onUpdateImage() {
        if (this.myForm2.valid) {
            this.spinner.show();
            const data = {
                imageUrl: this.selected_file,
                productId: this.service_id
            }

            this.apiServices.updateServiceImage(data, this.access_token).subscribe(
                (res: any) => {
                    this.spinner.hide();
                    console.log(res);
                    if (res.status == "success" && res.data == "product_image_updated") {
                        
                        this.apiServices.altScc("Service image updated", this.goToServicesList());
                    }
                },
                err => {
                    this.spinner.hide();
                    console.log(err);
                    this.apiServices.altErr("Unable to update service image", this.apiServices.reload());
                }
            )
        }
        else {
            this.validateAllFormFields(this.myForm2);
        }
    }

    onCancelEdit() {
        this.myForm.reset();
    }

    onCancelEdit2() {
        this.myForm2.reset();
        this.is_image_set = false;
    }

    goToServicesList(){
        this.router.navigate(['/pages/admin/services']);
    }

    refreshPage(){
        location.reload();
    }
    

    updateProductPriority(token, data) {
        //this.spinner.show();
        console.log("updateProductPriority: " + data);

        this.apiServices.updateProductPriority(token, data).subscribe(
            (res: any) => {
                console.log(res);

                this.spinner.hide();
                
                if (res.status == "success") {
                    this.apiServices.altScc("Service priority updated", this.goToServicesList());
                }else{
                    this.apiServices.altErr("Update failed. Please try again", null); 
                }
            },
            err => {
                console.log(err);
            }
        )
    }

    onChangePriority(priority) {
        this.priority = priority;
        console.log("onChangePriority priority : " + this.priority);

        if(this.priority > 0 && this.priority != this.currentPriorityLevel){

            const data = {
                productId: this.service_id,
                priority: this.priority,
            }

             this.updateProductPriority(this.access_token, data)
            //  this.apiServices.altConfirmAction("Are you sure you want to update the priority?", "Update", this.updateProductPriority(this.access_token, data));

        }else{
            this.apiServices.altErr("Please select a priority", null);   
        }
    }
    
    getMasterProductCount(token) {
        this.apiServices.getMasterProductCount(token, 1).subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success") {
                    let productsCount = res.data;
                   
                    for (let x = 1; x < productsCount + 2; x++) {
                        this.priorityList.push(x);
                    }

                }
            },
            err => {
                console.log(err);
            }
        )
    }
}
