import { Component, OnInit } from '@angular/core';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

import swal from 'sweetalert2';



@Component({
    selector: 'app-seller-list',
    templateUrl: './seller-list.component.html',
    styleUrls: ['./seller-list.component.css']
})
export class SellerListComponent implements OnInit {

    public access_token = '';

    rows = [];
    columns = [];
    temp = [];
    temp2 = [];

    select_category: any;
    category_list: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    ngOnInit() {

        this.select_category = "";
        this.columns = [];

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails().subscribe(
                (res: any) => {
                    console.log(res);
                    this.getSellers();
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

    // get sellers 
    getSellers() {
        this.apiServices.getAllSellers().subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success") {
                    let x = 0;
                    let temp_sellers = [];

                    for (let data of res.data) {
                        let t_seller = {
                            index: x,
                            name: data.seller.sellerName,
                            image: '',
                            address: data.seller.address,
                            phone: data.seller.mobileNumber,
                            nic: data.seller.nic,
                            isApproved: data.approved,
                            ratings: data.seller.rating,
                            isActive: data.isActive,
                            seller_id: data.id,
                            username: data.appUser.username
                        }

                        let imgName = data.seller.storeImageUrl;

                        let imagePath = '';
                        // get image url 
                        this.apiServices.getImageUrlS3(imgName).subscribe(
                            (res: any) => {
                                t_seller.image = 'data:image/jpeg;base64,' + res;
                            },
                            err => {
                                console.log('Error\n');
                                console.log(err);
                            }
                        )

                        temp_sellers.push(t_seller);
                    }

                    this.rows = temp_sellers;
                    this.temp = this.rows;

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
            title: 'Reason for Blocking',
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

        const data = { username: seller_id, comment: comment }

        this.apiServices.blockSeller(data).subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success" && res.data == "blocked") {
                    this.apiServices.altScc('Seller blocked', this.getSellers());
                }
                else {
                    this.apiServices.altErr("Unable to block the seller", this.getSellers());
                }
            },
            err => {
                console.log(err);
                this.apiServices.altErr("Unable to block the seller", this.getSellers());
            }
        )

    }

    acceptSeller(seller_id) {
        this.apiServices.acceptSeller(seller_id).subscribe(
            (res: any) => {
                console.log(res);

                if (res.status == "success" && res.data == "approved") {
                    this.apiServices.altScc('Seller accepted', this.getSellers());
                }
                else {
                    this.apiServices.altErr("Unable to accept the seller", this.getSellers());
                }
            },
            err => {
                console.log(err);
                this.apiServices.altErr("Unable to accept the seller", this.getSellers());
            }
        )
    }

}
