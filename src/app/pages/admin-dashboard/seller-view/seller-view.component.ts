import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import swal from 'sweetalert2';

import { NgxSpinnerService } from 'ngx-spinner';

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
    sellerUsername;

    product_name: any;

    selected_file: File = null;

    is_seller_image: boolean;
    is_nic_front_image: boolean;
    is_nic_back_image: boolean;

    sellerImage: any;
    nicBackImage: any;
    nicFrontImage: any;
    sellerApproveStatus;

    seller_username: any;

    constructor(
        private activeRoute: ActivatedRoute,
        public router: Router,
        private apiServices: ApiServicesService,
        private spinner: NgxSpinnerService
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
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
                    this.getSellerDetails(this.seller_username, this.access_token);
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
    getSellerDetails(seller_id, token) {
        this.apiServices.getSellerDetailsById(seller_id, token).subscribe(
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
                    this.sellerApproveStatus = res.data.approvalStatus;

                    let sellImg = res.data.sellerProfile.storeImageUrl;

                    this.apiServices.getImageUrlS3(sellImg, token).subscribe(
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

                    this.apiServices.getImageUrlS3(nicFront, token).subscribe(
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

                    this.apiServices.getImageUrlS3(nicBack, token).subscribe(
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

    onBlockingSeller(seller_id) {
        swal({
            title: 'Are you sure?',
            text: "You are trying to block a seller",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes, I'm Sure!",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
        }).then((result) => {
            if (result.value) {
                this.addComment(seller_id);
            }
        })
    }

    addComment(seller_id) {
        swal({
            title: 'Reason For Blocking',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function (value) {
                if (value.length == 0) {
                    swal.showValidationError(
                        `Reason is required`
                    )
                }
            }
        }).then((result) => {
            if (result.value) {
                this.blockSeller(seller_id, result.value);
            }
        })
    }

    blockSeller(seller_id, comment) {
        this.spinner.show();

        const data = { username: seller_id, comment: comment }

        this.apiServices.blockSeller(data, this.access_token).subscribe(
            (res: any) => {
                this.spinner.hide();
                console.log(res);

                if (res.status == "success" && res.data == "blocked") {
                    this.apiServices.altScc('Seller blocked', this.getSellerDetails(seller_id, this.access_token));
                }
                else {
                    this.apiServices.altErr("Unable to block the seller", this.getSellerDetails(seller_id, this.access_token));
                }
            },
            err => {
                this.spinner.hide();
                console.log(err);
                this.apiServices.altErr("Unable to block the seller", this.getSellerDetails(seller_id, this.access_token));
            }
        )

    }

    acceptSeller(seller_id) {
        this.spinner.show();
        this.apiServices.acceptSeller(seller_id, this.access_token).subscribe(
            (res: any) => {
                this.spinner.hide();
                console.log(res);

                if (res.status == "success" && res.data == "approved") {
                    this.apiServices.altScc('Seller approved', this.getSellerDetails(seller_id, this.access_token));
                }
                else {
                    this.apiServices.altErr("Unable to approve the seller", this.getSellerDetails(seller_id, this.access_token));
                }
            },
            err => {
                this.spinner.hide();
                console.log(err);
                this.apiServices.altErr("Unable to approve the seller", this.getSellerDetails(seller_id, this.access_token));
            }
        )
    }

    onUnblockingSeller(seller_id) {
        swal({
            title: 'Are you sure?',
            text: "You are trying to unblock a seller",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes, I'm Sure!",
            cancelButtonText: "Cancel",
            allowOutsideClick: false,
        }).then((result) => {
            if (result.value) {
                this.addCommentUnblock(seller_id);
            }
        })
    }

    addCommentUnblock(seller_id) {
        swal({
            title: 'Reason For Unblocking',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: function (value) {
                if (value.length == 0) {
                    swal.showValidationError(
                        `Reason is required`
                    )
                }
            }
        }).then((result) => {
            if (result.value) {
                this.unblockSeller(seller_id, result.value);
            }
        })
    }

    unblockSeller(seller_id, comment) {
        this.spinner.show();

        const data = { username: seller_id, comment: comment }

        this.apiServices.unblockSeller(data, this.access_token).subscribe(
            (res: any) => {
                this.spinner.hide();
                console.log(res);

                if (res.status == "success" && res.data == "blocked") {
                    this.apiServices.altScc('Seller unblocked', this.getSellerDetails(seller_id, this.access_token));
                }
                else {
                    this.apiServices.altErr("Unable to unblock the seller", this.getSellerDetails(seller_id, this.access_token));
                }
            },
            err => {
                this.spinner.hide();
                console.log(err);
                this.apiServices.altErr("Unable to unblock the seller", this.getSellerDetails(seller_id, this.access_token));
            }
        )

    }

    refreshPage(){
        location.reload();
    }

}
