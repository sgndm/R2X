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
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {

                    // get categories 
                    this.getCategories(this.access_token);

                    // get details 
                    this.getProductDetailsById(this.product_id, this.access_token);
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
    getCategories(token) {
        this.apiServices.getCategoriesAll(token).subscribe(
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
    getProductDetailsById(product_id, token) {
        this.apiServices.getProductById(product_id, token).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {

                    this.product_name = res.data.name;
                    this.productName = res.data.name;
                    this.productCategory = res.data.categoryId;
                    this.productDescription = res.data.description;
                    this.productPrice = res.data.estimatedPrice;
                    this.paymentMethod = res.data.paymentUnit;

                    let imgName = res.data.imageUrl;
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
            err => {
                console.log(err);
            }
        )
    }

    refreshPage(){
        location.reload();
    }

}
