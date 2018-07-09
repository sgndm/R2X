import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';

@Component({
    selector: 'app-create-service',
    templateUrl: './create-service.component.html',
    styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit {

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

    ngOnInit() {
        this.category_list = ['Food', 'Drinks', 'Cloths'];
        this.createFormControls();
        this.createForm();
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

    onSubmit() {
        if (this.myForm.valid) {

        }
        else {
            this.validateAllFormFields(this.myForm);
        }
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

}
