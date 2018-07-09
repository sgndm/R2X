import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';

// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

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

    product_name: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService
    ) { }


    ngOnInit() {
        this.product_name = "product name";
        this.category_list = ['Food', 'Drinks', 'Cloths'];
        this.createFormControls();
        this.createForm();
    }

    createFormControls() {

        this.productCategory = new FormControl('');
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

    onSubmit() {
        if (this.myForm.valid) {

        }
        else {
            this.validateAllFormFields(this.myForm);
        }
    }

    onCancelEdit() {
        this.myForm.reset();
        this.router.navigate(['/pages/admin/products/']);
    }

}
