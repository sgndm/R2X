import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

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

    service_name: any;

    selected_file: File = null;

    is_image_set: boolean;
    is_current_image: boolean;
    imagePreviewPath: any;
    currentImagePath: any;

    service_id: any;

    constructor(
		private activeRoute: ActivatedRoute,
		public router: Router,
		private apiServices: ApiServicesService,
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

        this.is_image_set = false;
        this.is_current_image = false;

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails().subscribe(
                (res: any) => {

                    // get categories 
                    this.getCategories();

                    // get details 
                    this.getProductDetailsById(this.service_id);
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
    getCategories() {
        this.apiServices.getCategoriesAll().subscribe(
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
    getProductDetailsById(product_id){
        this.apiServices.getProductById(product_id).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {
                    
                    this.service_name = res.data.name;
                    this.myForm.setValue({
                        productName: res.data.name,
                        productCategory: res.data.categoryId,
                        productDescription: res.data.description,
                        productPrice: res.data.estimatedPrice,
                        paymentMethod: res.data.paymentUnit
                    });

                    let imgName = res.data.imageUrl;
                    // get image url 
                    this.apiServices.getImageUrlS3(imgName).subscribe(
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

    onUpdateDetails() {
        if (this.myForm.valid) {

            const data = {
                name: this.myForm.value.productName,
                description: this.myForm.value.productDescription,
                estimatedPrice: this.myForm.value.productPrice,
                categoryId: this.myForm.value.productCategory,
                paymentUnit: this.myForm.value.paymentMethod,
                isProduct: false,
                productId: this.service_id
            }

            this.apiServices.updateServiceDetails(data).subscribe(
                (res:any) => {
                    console.log(res);
                    if(res.status == "success" && res.data == "product_updated"){
                        alert('updated');
                        location.reload();
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

    onUpdateImage() {
        if (this.myForm2.valid) {
            const data = {
                imageUrl: this.selected_file,
                productId: this.service_id
            }

            this.apiServices.updateServiceImage(data).subscribe(
                (res:any) => {
                    console.log(res);
                    if(res.status == "success" && res.data == "product_image_updated") {
                        alert("updated");
                        location.reload();
                    }
                },
                err => {
                    console.log(err);
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

}
