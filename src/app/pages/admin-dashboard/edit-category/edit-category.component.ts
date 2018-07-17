import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-edit-category',
    templateUrl: './edit-category.component.html',
    styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit {

    public access_token = '';

    myForm: FormGroup;
    myForm2: FormGroup;

    categoryName: FormControl;
    categoryImage: FormControl;
    categoryType: FormControl;

    selected_file: File = null;

    is_image_set: boolean;
    is_current_image: boolean;
    imagePreviewPath: any;
    currentImagePath: any;

    category_id;
    category_name;


    constructor(
        private activeRoute: ActivatedRoute,
        public router: Router,
        private apiServices: ApiServicesService,
        private spinner: NgxSpinnerService
    ) {
        this.activeRoute.params.subscribe(
            params => {
                this.category_id = params.id;
                console.log(params);
            }

        );

        this.access_token = localStorage.getItem('access_token')

    }

    ngOnInit() {

        this.category_name = "service name";
        this.is_image_set = false;

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
                    this.getCategoryDetails(this.category_id, this.access_token);
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

    createFormControls() {

        this.categoryName = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
        this.categoryImage = new FormControl('', [Validators.required]);
        this.categoryType = new FormControl(1, [Validators.required]);

    }

    createForm() {
        this.myForm = new FormGroup({
            categoryName: this.categoryName,
            categoryType: this.categoryType
        });
    }

    createForm2() {
        this.myForm2 = new FormGroup({
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

    getCategoryDetails(category_id, token) {
        this.apiServices.getCategoryById(category_id, token).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {

                    this.category_name = res.data.categoryName;
                    this.myForm.setValue({
                        categoryName: res.data.categoryName,
                        categoryType: res.data.type
                    })

                    let imgName = res.data.categoryImgUrl;
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
            err => { console.log(err) }
        )
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
                categoryId: this.category_id
            }

            this.apiServices.updateCategoryImage(data, this.access_token).subscribe(
                (res: any) => {

                    this.spinner.hide();
                    console.log(res);

                    if (res.status == "success" && res.data == "category_image_updated") {
                        this.apiServices.altScc("Category image updated", this.goToCategoryList());
                    }
                },
                err => {
                    this.spinner.hide();
                    console.log(err);
                    this.apiServices.altErr("Unable to update category image", this.apiServices.reload());
                }
            )
        }
        else {
            this.validateAllFormFields(this.myForm2);
        }
    }

    onUpdateName() {
        if (this.myForm.valid) {
            this.spinner.show();
            const data = {
                categoryId: this.category_id,
                categoryName: this.myForm.value.categoryName,
                type: this.myForm.value.categoryType
            }
            console.log("Data .......... ");
            console.log(data);
            this.apiServices.updateCategoryName(data, this.access_token).subscribe(
                (res: any) => {
                    this.spinner.hide();
                    console.log(res)

                    if (res.status == "success" && res.data == "category_updated") {
                        this.apiServices.altScc("Category details updated", this.goToCategoryList());
                    }
                },
                err => {
                    this.spinner.hide();
                    console.log(err);
                    this.apiServices.altErr("Unable to update category details", this.apiServices.reload());
                }
            )
        }
        else {
            this.validateAllFormFields(this.myForm);
        }
    }

    onCancelEdit() {
        this.myForm.reset();
    }

    onCancelEdit2() {
        this.myForm2.reset();
        this.is_image_set = false;
    }

    goToCategoryList(){
        this.router.navigate(['/pages/admin/categories']);
    }
}
