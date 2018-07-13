import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';


@Component({
    selector: 'app-create-category',
    templateUrl: './create-category.component.html',
    styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

    public access_token = '';

    myForm: FormGroup;

    categoryName: FormControl;
    categoryImage: FormControl;

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
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
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
    createFormControls() {

        this.categoryName = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
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

    onCreateCategory() {
        if (this.myForm.valid) {
            let info = {
                name: this.myForm.value.categoryName,
            }
            const data = {
                info: info,
                imageUrl: this.selected_file
            }

            this.apiServices.createCategory(data, this.access_token).subscribe(
                (res:any) => {
                    console.log(res);

                    if(res.status == "success" && res.data == "category_added") {
                        this.apiServices.altScc("Category created",  this.resetForm());
                    }
                },
                err => {
                    console.log(err);
                    this.apiServices.altErr("Unable to create category",  this.resetForm());
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

    resetForm(){
        this.myForm.reset();
        this.is_image_set = false;
    }


}
