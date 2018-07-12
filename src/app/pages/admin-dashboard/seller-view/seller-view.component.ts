import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';


@Component({
    selector: 'app-seller-view',
    templateUrl: './seller-view.component.html',
    styleUrls: ['./seller-view.component.css']
})
export class SellerViewComponent implements OnInit {

    public access_token = '';

    category_list: any[];

    sellerName;
    sellerPhone;
    sellerAddress;
    sellerNIC;
    ratings;
    paymentMethod;
    opRadius;
    acceptCard;
    cardOnDelivery;
    cashOnDelivery;

    product_name: any;

    selected_file: File = null;

    is_seller_image: boolean;
    is_nic_front_image: boolean;
    is_nic_back_image: boolean;

    sellerImage: any;
    nicBackImage: any;
    nicFrontImage: any;

    seller_username: any;

    constructor(
        private activeRoute: ActivatedRoute,
        public router: Router,
        private apiServices: ApiServicesService,
    ) {
        this.activeRoute.params.subscribe(
            params => {
                this.seller_username = params.id;
                console.log(params);
            }
        );

        this.access_token = localStorage.getItem('access_token')
    }



    ngOnInit() {

        this.is_seller_image = false;
        this.is_nic_front_image = false;
        this.is_nic_back_image = false;


        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails().subscribe(
                (res: any) => {
                    this.getSellerDetails(this.seller_username);
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


    // get user deatails 
    getSellerDetails(seller_id) {
        this.apiServices.getSellerDetailsById(seller_id).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {
                    this.sellerName = res.data.sellerProfile.sellerName;
                    this.sellerPhone = res.data.sellerProfile.mobileNumber;
                    this.sellerNIC = res.data.sellerProfile.nic;
                    this.opRadius = res.data.sellerProfile.operationalRadius;
                    this.ratings = res.data.sellerProfile.rating;
                    this.acceptCard = res.data.sellerProfile.acceptCreditCard;
                    this.cardOnDelivery = res.data.sellerProfile.cardOnDelivery;
                    this.cashOnDelivery = res.data.sellerProfile.cashOnDelivery;

                    let sellImg = res.data.sellerProfile.storeImageUrl;

                    this.apiServices.getImageUrlS3(sellImg).subscribe(
                        (res: any) => {
                            // console.log(res);
                            this.is_seller_image = true;
                            this.sellerImage = 'data:image/jpeg;base64,' + res;
                        },
                        err => {
                            console.log('Error\n');
                            console.log(err);
                        }
                    )

                    let nicFront = res.data.sellerNicImage.backImageUrl;

                    this.apiServices.getImageUrlS3(nicFront).subscribe(
                        (res: any) => {
                            // console.log(res);
                            this.is_nic_front_image = true;
                            this.nicFrontImage = 'data:image/jpeg;base64,' + res;
                        },
                        err => {
                            console.log('Error\n');
                            console.log(err);
                        }
                    )

                    let nicBack = res.data.sellerNicImage.frontImageUrl;

                    this.apiServices.getImageUrlS3(nicBack).subscribe(
                        (res: any) => {
                            // console.log(res);
                            this.is_nic_back_image = true;
                            this.nicBackImage = 'data:image/jpeg;base64,' + res;
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

}
