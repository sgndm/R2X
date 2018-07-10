import { Component, OnInit } from '@angular/core';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    public access_token = '';

    rows = [];
    columns = [];
    temp = [];
    temp2 = [];
    category_list: any;
    select_category: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    ngOnInit() {

        // this.apiServices.getImageUrlS3('data').subscribe(
        //     (res: any) => {console.log(res)},
        //     err => {console.log(err)}
        // )

        this.select_category = "";
        this.columns = [];

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails().subscribe(
                (res: any) => {
                    console.log(res);
                    this.getProducts();
                },
                err => {
                    console.log(err);
                }
            )

        }
        else {
            this.apiServices.logout();
        }


    }

    // get products
    getProducts() {
        this.apiServices.getAllProducts().subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success") {
                    let temp_products = [];
                    let x = 0;
                    for (let product of res.data) {

                        
                        if (product.product) {
                            x += 1;

                            let t_prod = { index: x, product_id: product.id, name: product.name, image: '', category: product.categoryName, price: product.price, recordStatus: product.recordStatus }


                            let imgName = product.imageUrl;
                            let imagePath = '';
                            // get image url 
                            this.apiServices.getImageUrlS3(imgName).subscribe(
                                (res: any) => {
                                    // console.log(res);
                                    imagePath = 'data:image/jpeg;base64,' + res;
                                    t_prod.image = imagePath;
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
        this.apiServices.deleteProduct(product_id).subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success" && res.data == "product_removed") {
                    alert("deleted");
                    location.reload();
                }
            },
            err => {
                console.log(err);
            }
        )
    }

    activateProduct(product_id) {

        const data = {
            productId: product_id,
            recordStatus: 1
        }

        this.apiServices.enableProduct(data).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success" && res.data == "product_enabled") {
                    alert("enabled");
                    location.reload();
                }
            },
            err => {
                console.log(err);
            }
        )

    }

}
