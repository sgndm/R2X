import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';


@Component({
    selector: 'app-view-product',
    templateUrl: './view-product.component.html',
    styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {

    public access_token = '';

    category_list: any[];

    productName;
    productDescription;
    productPrice;
    productImage;
    productCategory;
    paymentMethod;

    product_name: any;

    selected_file: File = null;

    is_image_set: boolean;
    is_current_image: boolean;
    imagePreviewPath: any;
    currentImagePath: any;

    product_id: any;

    constructor(
        private activeRoute: ActivatedRoute,
        public router: Router,
        private apiServices: ApiServicesService,
    ) {
        this.activeRoute.params.subscribe(
            params => {
                this.product_id = params.id;
                console.log(params);
            }
        );

        this.access_token = localStorage.getItem('access_token')
    }



    ngOnInit() {
        this.is_image_set = false;

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails().subscribe(
                (res: any) => {

                    // get categories 
                    this.getCategories();

                    // get details 
                    this.getProductDetailsById(this.product_id);
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
    getProductDetailsById(product_id) {
        this.apiServices.getProductById(product_id).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {

                    this.product_name = res.data.name;
                    this.productName = res.data.name;
                    this.productCategory = res.data.categoryId;
                    this.productDescription = res.data.description;
                   this.productPrice = res.data.estimatedPrice;
                }
            },
            err => {
                console.log(err);
            }
        )
    }
    

}
