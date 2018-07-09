import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';

// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

@Component({
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

    myForm: FormGroup;

    categoryName: FormControl;
    categoryImage: FormControl;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService
    ) { }

    ngOnInit() {
        this.createFormControls();
        this.createForm();
    }

    createFormControls() {

        this.categoryName = new FormControl('', [Validators.required, Validators.minLength(1)]);
        this.categoryImage = new FormControl('', [Validators.required]);

    }

    createForm() {
        this.myForm = new FormGroup({
            categoryName: this.categoryName,
            categoryImage: this.categoryImage
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
        this.router.navigate(['/pages/admin/categories/']);
    }
}
