import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

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

    product_name: any;

    selected_file: File = null;

    is_image_set: boolean;
    is_current_image: boolean;
    imagePreviewPath: any;
    currentImagePath: any;

    product_id: any;

    constructor(
        private activeRoute: ActivatedRoute,
        public router: Router,
        private apiServices: ApiServicesService,
        private spinner: NgxSpinnerService
    ) {
        this.activeRoute.params.subscribe(
            params => {
                this.product_id = params.id;
                console.log(params);
            }

        );

        this.access_token = localStorage.getItem('access_token')

    }



    ngOnInit() {

        this.product_name = "service name";
        this.is_image_set = false;

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {

                    // get categories 
                    this.getCategories(this.access_token);

                    // get details 
                    this.getProductDetailsById(this.product_id, this.access_token);
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

    // get product details 
    getProductDetailsById(product_id, token) {
        this.apiServices.getProductById(product_id, token).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {

                    this.product_name = res.data.name;
                    this.myForm.setValue({
                        productName: res.data.name,
                        productCategory: res.data.categoryId,
                        productDescription: res.data.description,
                        productPrice: res.data.estimatedPrice,
                        paymentMethod: res.data.paymentUnit
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

    onUpdateProduct() {
        if (this.myForm.valid) {
            
            this.spinner.show();
            const data = {
                name: this.myForm.value.productName,
                description: this.myForm.value.productDescription,
                estimatedPrice: this.myForm.value.productPrice,
                categoryId: this.myForm.value.productCategory,
                paymentUnit: this.myForm.value.paymentMethod,
                isProduct: true,
                productId: this.product_id
            }

            this.apiServices.updateProductDetails(data, this.access_token).subscribe(
                (res: any) => {
                    this.spinner.hide();
                    console.log(res);
                    if (res.status == "success" && res.data == "product_updated") {
                        this.apiServices.altScc("Product details updated",  this.goToProductList());
                    }
                },
                err => {
                    this.spinner.hide();
                    console.log(err);
                    this.apiServices.altErr("Unable to update product details",  this.apiServices.reload());
                }
            )

        }
        else {
            this.validateAllFormFields(this.myForm);
        }
    }

    onUpdateImage() {
        if (this.myForm2.valid) {
            this.spinner.show();
            const data = {
                imageUrl: this.selected_file,
                productId: this.product_id
            }

            this.apiServices.updateProductImage(data, this.access_token).subscribe(
                (res: any) => {
                    this.spinner.hide();
                    console.log(res);
                    if (res.status == "success" && res.data == "product_image_updated") {
                        this.apiServices.altScc("Product image updated",  this.goToProductList());
                    }
                },
                err => {
                    this.spinner.hide();
                    console.log(err);
                    this.apiServices.altErr("unable to update product image",  this.apiServices.reload());
                }
            )
        }
        else {
            this.validateAllFormFields(this.myForm2);
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

        this.productCategory = new FormControl(0);
        this.paymentMethod = new FormControl(0);
        this.productName = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
        this.productDescription = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]);
        this.productPrice = new FormControl(0, [Validators.required, Validators.minLength(1)]);
        this.productImage = new FormControl('', [Validators.required]);

    }

    createForm() {
        this.myForm = new FormGroup({
            productCategory: this.productCategory,
            productName: this.productName,
            productDescription: this.productDescription,
            productPrice: this.productPrice,
            paymentMethod: this.paymentMethod
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

    onCancelEdit() {
        this.myForm.reset();
    }

    onCancelEdit2() {
        this.myForm2.reset();
        this.is_image_set = false;
    }

    goToProductList(){
        this.router.navigate(['/pages/admin/products']);
    }

    refreshPage(){
        location.reload();
    }
}
