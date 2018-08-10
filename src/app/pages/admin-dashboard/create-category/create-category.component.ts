import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import { NgxSpinnerService } from 'ngx-spinner';

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
    categoryType: FormControl;

   
    selected_file: File = null;

    is_image_set: boolean;
    imagePreviewPath: any;

    rows = [];
    columns = [];
    temp = [];

    priorityList = [];
    priority: any;
    
    public category_list: any;

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

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
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
        this.apiServices.getCategoriesAll(token).subscribe(
            (res: any) => {
                console.log(res);

                let temp_cat = [];

                if (res.status == "success") {
                    let categories = res.data;

                   
                    for (let x = 0; x < categories.length; x++) {
                        this.priorityList.push(x+1);
                        let t_cat = { index: x + 1, category_id: categories[x].id, name: categories[x].name, image: '', recordStatus: categories[x].recordStatus }

                        let imgName = categories[x].imageUrl;

                        // get image url 
                        this.apiServices.getImageUrlS3(imgName, token).subscribe(
                            (res: any) => {
                                // console.log(res);
                                t_cat.image = 'data:image/jpeg;base64,' + res;
                            },
                            err => {
                                console.log('Error\n');
                                console.log(err);
                            }
                        )
                        console.log("priorityList count: " +  this.priorityList.length);

                        temp_cat.push(t_cat);
                    }

                    this.priorityList.push(temp_cat.length+1);

                    this.rows = temp_cat;
                    this.temp = this.rows;
                }
            },
            err => {
                console.log(err);
            }
        )
    }

   

    createFormControls() {

        this.categoryName = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]);
        this.categoryImage = new FormControl('', [Validators.required]);
        this.categoryType = new FormControl(1, [Validators.required]);
    }

    createForm() {
        this.myForm = new FormGroup({
            categoryName: this.categoryName,
            categoryImage: this.categoryImage,
            categoryType: this.categoryType
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

            if(this.priority > 0){

                this.spinner.show();
                let info = {
                    name: this.myForm.value.categoryName,
                    type: this.myForm.value.categoryType,
                    priority : this.priority
                }
                const data = {
                    info: info,
                    imageUrl: this.selected_file
                }
    
                this.apiServices.createCategory(data, this.access_token).subscribe(
                    (res:any) => {
                        console.log(res);
                        this.spinner.hide();
    
                        if(res.status == "success" && res.data == "category_added") {
                            this.apiServices.altScc("Category created",  null);

                           

                        }
                    },
                    err => {
                        this.spinner.hide();
                        console.log(err);
                        this.apiServices.altErr("Unable to create category",  null);
                    })

            }else{
                this.apiServices.altErr("Please select a priority level for the Category",  null);

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

    resetForm(){
        this.myForm.reset();
        this.is_image_set = false;
        this.getCategories(this.access_token);
    }

    deleteCategory(category_id){
        this.spinner.show();
        this.apiServices.deleteCategory(category_id, this.access_token).subscribe(
            (res: any) => {
                
                this.spinner.hide();
                console.log(res);
                if(res.status == "success" && res.data == "category_removed") {
                    this.apiServices.altScc("Category deleted",  this.getCategories(this.access_token));
                }
            },
            err => {
                
                this.spinner.hide();
                console.log(err);
                this.apiServices.altErr("Unable to delete category",  this.getCategories(this.access_token
                ));
            }
        )
    }

    activateCategory(category_id){
        
        this.spinner.show();
        const data = {
            categoryId: category_id,
            recordStatus: 1
        }

        this.apiServices.enableCategory(data, this.access_token).subscribe(
            (res: any) => {
                console.log(res);
                
                this.spinner.hide();
                if(res.status == "success" && res.data == "category_enabled"){
                    this.apiServices.altScc("Category activated",  this.getCategories(this.access_token));
                }
            },
            err => {
                this.spinner.hide();
                console.log(err);
                this.apiServices.altErr("Unable to activate category",  this.getCategories(this.access_token));
            }
        )

    }


    // filter 
    // by product name
    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp_data = this.temp.filter(function (d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.rows = temp_data;
    }

    refreshPage(){
        location.reload();
    }

    onChangePriority(priority) {
        this.priority = priority;
        console.log("onChangePriority priority : " + this.priority);
	}

}
