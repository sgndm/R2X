import { Component, OnInit } from '@angular/core';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import { NgxSpinnerService } from 'ngx-spinner';

import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';




@Component({
    selector: 'app-service-list',
    templateUrl: './service-list.component.html',
    styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {

    public access_token = '';

    myForm: FormGroup;
    password: FormControl;

    rows = [];
    columns = [];
    temp = [];
    temp2 = [];

    select_category: any;
    category_list: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService,
        private spinner: NgxSpinnerService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    ngOnInit() {

        this.select_category = "";
        this.columns = [];

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
                    console.log(res);
                    this.getProducts(this.access_token);
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
        this.createForm();;

    }

    

    // get categories 
    getCategories(token) {
        this.apiServices.getCategoryByType(token, 2).subscribe(
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

    // get products
    getProducts(token) {
        this.apiServices.getAllProducts(token).subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success") {
                    let temp_products = [];
                    let x = 0;
                    for (let product of res.data) {



                        if (!(product.product)) {
                            x += 1;
                            let t_prod = { index: x, service_id: product.id, name: product.name, image: '', category: product.categoryName, price: product.price, recordStatus: product.recordStatus }

                            let imgName = product.imageUrl;
                            let imagePath = '';
                            // get image url 
                            this.apiServices.getImageUrlS3(imgName, token).subscribe(
                                (res: any) => {
                                    t_prod.image = 'data:image/jpeg;base64,' + res;
                                },
                                err => {
                                    console.log('Error\n');
                                    console.log(err);
                                }
                            )

                            temp_products.push(t_prod);
                        }


                    }

                    this.rows = temp_products;
                    this.temp = this.rows;
                }
            },
            err => {
                console.log(err);
            }
        )
    }

    // filter 
    // by category
    onChangeCategory(category) {

        const val = category.toLowerCase();
        if (val.length > 0) {
            const temp_data = this.temp;

            let result = [];

            // filter our data
            for (let data of temp_data) {
                let cat = data.category.toLowerCase();

                if (cat == val) {
                    result.push(data);
                }
            }

            this.rows = result;
            this.temp2 = result
        }
        else {
            this.rows = this.temp;
        }
    }

    // by product name
    updateFilter(event) {
        let category = this.select_category;

        if (category.length > 0) {

            const val = event.target.value.toLowerCase();

            // filter our data
            const temp_data = this.temp2.filter(function (d) {
                return d.name.toLowerCase().indexOf(val) !== -1 || !val;
            });

            // update the rows
            this.rows = temp_data;

        }
        else {

            const val = event.target.value.toLowerCase();

            // filter our data
            const temp_data = this.temp.filter(function (d) {
                return d.name.toLowerCase().indexOf(val) !== -1 || !val;
            });

            // update the rows
            this.rows = temp_data;
        }

    }

    deleteProduct(product_id) {
        this.spinner.show();
        this.apiServices.deleteProduct(product_id, this.access_token).subscribe(
            (res: any) => {
                this.spinner.hide();
                console.log(res);

                if (res.status == "success" && res.data == "product_removed") {
                    this.apiServices.altScc("Service deleted", this.getProducts(this.access_token));
                }
            },
            err => {
                this.spinner.hide();
                console.log(err);
                this.apiServices.altErr("Unable to delete service", this.getProducts(this.access_token));
            }
        )
    }

    activateProduct(product_id) {
        this.spinner.show();

        const data = {
            productId: product_id,
            recordStatus: 1
        }

        this.apiServices.enableProduct(data, this.access_token).subscribe(
            (res: any) => {
                this.spinner.hide();
                console.log(res);
                if (res.status == "success" && res.data == "product_enabled") {
                    this.apiServices.altScc("Service activated", this.getProducts(this.access_token));
                }
            },
            err => {
                this.spinner.hide();
                console.log(err);
                this.apiServices.altErr("Unable to activate service", this.getProducts(this.access_token));
            }
        )

    }


    createFormControls() {
        this.password = new FormControl();
    }

    createForm() {
        this.myForm = new FormGroup({
            password: this.password
        });
    }
    
    deleteAll() {
        console.log("deleteAll pressed 1 ");

        let passwordText = this.password.value;
    
        if(passwordText != null){
            console.log("deleteAll pressed:  " + passwordText);

            this.apiServices.deleteAllServices(this.access_token, passwordText).subscribe(
                (res: any) => {
    
                    if(res.status == "success"){
                        this.getProducts(this.access_token);
                     }else{

                        if(res.data != null && res.data == "invalid_security_code"){
                            this.apiServices.altErr("Master password is invalid!", null);
                        }

                    }
                    // get categories 
                   
                },
                err => {
                    console.log(err);
                }
            )
        }else{
                this.apiServices.altErr("Please enter the master password to remove all services.", null);
        }

       
    }
}
