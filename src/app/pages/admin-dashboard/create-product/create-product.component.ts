import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

    public access_token = '';

    myForm: FormGroup;

    category_list: any[];

    productName: FormControl;
    productDescription: FormControl;
    productPrice: FormControl;
    productImage: FormControl;
    productCategory: FormControl;
    paymentMethod: FormControl;

    priorityList = [];
    priority: any;

    selected_file: File = null;

    is_image_set: boolean;
    imagePreviewPath: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService,
        private spinner: NgxSpinnerService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    ngOnInit() {

        this.priority = 0;
        this.is_image_set = false;
        // check if user is logged in
        if (this.access_token) {

            this.getMasterProductCount(this.access_token);
            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {

                    // get categories 
                    this.getCategories(this.access_token);
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
       
    }

    // get categories 
    getCategories(token) {
        this.apiServices.getCategoryByType(token, 1).subscribe(
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

     // get categories 
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


    onCreateProduct() {

        if (this.myForm.valid) {

            if(this.priority > 0){

                this.spinner.show();

                let info = {
                    name: this.myForm.value.productName,
                    description: this.myForm.value.productDescription,
                    estimatedPrice: this.myForm.value.productPrice,
                    categoryId: this.myForm.value.productCategory,
                    paymentUnit: this.myForm.value.paymentMethod,
                    priority: this.priority,
                    isProduct: true
                }
    
                const data = {
                    info: info,
                    imageUrl: this.selected_file,
                }
    
                console.log(data);
    
                this.apiServices.createProduct(data, this.access_token).subscribe(
                    (res: any) => {
                        this.spinner.hide();
                        console.log(res);
    
                        if (res.status == "success" && res.data == "product_added") {
                            
                            this.apiServices.altScc("Product created",  this.resetForm());
                            this.getMasterProductCount(this.access_token);
                        }
                    },
                    err => {
                        this.spinner.hide();
                        console.log(err);
                        this.apiServices.altErr("Unable to create product",  this.resetForm());
                    }
                )

            }else{
                this.apiServices.altErr("Please select a priority level for the Product",  null);
            }
           
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

    // create form and validations 
    createFormControls() {

        this.productCategory = new FormControl(0);
        this.productName = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
        this.productDescription = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]);
        this.productPrice = new FormControl(0, [Validators.required, Validators.minLength(1)]);
        this.productImage = new FormControl('', [Validators.required]);
        this.paymentMethod = new FormControl(0);

    }

    createForm() {
        this.myForm = new FormGroup({
            productCategory: this.productCategory,
            productName: this.productName,
            productDescription: this.productDescription,
            productPrice: this.productPrice,
            productImage: this.productImage,
            paymentMethod: this.paymentMethod
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

    resetForm() {
        this.myForm.reset();
        this.is_image_set = false;

        this.myForm.setValue({
            productCategory: 0,
            productName: '',
            productDescription: '',
            productPrice: 0,
            productImage: '',
            paymentMethod: 0
        });


        
    }

    refreshPage(){
        location.reload();
    }

    onChangePriority(priority) {
        this.priority = priority;
        console.log("onChangePriority priority : " + this.priority);
	}
    
}
