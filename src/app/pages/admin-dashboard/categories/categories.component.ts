import { Component, OnInit } from '@angular/core';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    public access_token = '';

    rows = [];
    columns = [];
    temp = [];

    public category_list: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService,
        private spinner: NgxSpinnerService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    ngOnInit() {


        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {

                    this.columns = [
                        { name: 'index' },
                        { name: 'category_id' },
                        { name: 'name' },
                        { name: 'image' },
                    ];

                    // get categories 
                    this.getCategories(this.access_token);
                },
                err => {
                    console.log(err);
                    this.apiServices.logout();
                }
            )

        }
        else {
            this.apiServices.logout();
        }

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

                        temp_cat.push(t_cat);
                    }

                    this.rows = temp_cat;
                    this.temp = this.rows;
                }
            },
            err => {
                console.log(err);
            }
        )
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

}
