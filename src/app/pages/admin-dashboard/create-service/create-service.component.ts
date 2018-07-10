import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

@Component({
    selector: 'app-create-service',
    templateUrl: './create-service.component.html',
    styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit {

    public access_token = '';

    myForm: FormGroup;

    category_list: any[];

    productName: FormControl;
    productDescription: FormControl;
    productPrice: FormControl;
    productImage: FormControl;
    productCategory: FormControl;


    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    password: FormControl;
    language: FormControl;
    paymentMethod: FormControl;

    selected_file: File = null;

    is_image_set: boolean;
    imagePreviewPath: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }


    ngOnInit() {
        this.is_image_set = false;
        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails().subscribe(
                (res: any) => {

                    // get categories 
                    this.getCategories();
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
    getCategories(){
        this.apiServices.getCategoriesAll().subscribe(
            (res: any) => {
                console.log(res);

                if(res.status == "success"){
                    this.category_list = res.data;
                }
            },
            err => {
                console.log(err);
            }
        )
    }



    onCreateService() {

        if (this.myForm.valid) {

            let info = {
                name: this.myForm.value.productName,
                description: this.myForm.value.productDescription,
                estimatedPrice: this.myForm.value.productPrice,
                categoryId: this.myForm.value.productCategory,
                paymentUnit: this.myForm.value.paymentMethod,
                isProduct: false
            }

            const data = {
                info: info,
                imageUrl: this.selected_file,
            }

            console.log(data);
    
            this.apiServices.createService(data).subscribe(
                (res:any) => {
                    console.log(res);

                    if(res.status == "success" && res.data == "product_added"){
                        alert('product added successfully');
                        this.myForm.reset();
                    }
                },
                err => {
                    console.log(err);
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


    createFormControls() {

        this.productCategory = new FormControl('');
        this.paymentMethod = new FormControl('');
        this.productName = new FormControl('', [Validators.required, Validators.minLength(1)]);
        this.productDescription = new FormControl('', [Validators.required, Validators.minLength(1)]);
        this.productPrice = new FormControl(0, [Validators.required, Validators.minLength(1)]);
        this.productImage = new FormControl('', [Validators.required]);

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
            productCategory: '',
            productName: '',
            productDescription: '',
            productPrice: 0,
            productImage: '',
            paymentMethod: ''
        });
    }

}
