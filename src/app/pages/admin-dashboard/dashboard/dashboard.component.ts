import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    public access_token = '';

    public lat: number = 7.291418;
    public lng: number = 80.636696;

    public buyer_marker = './assets/images/icon/buyer_marker.png';
    public seller_marker = './assets/images/icon/seller_marker.png';

    markers: any[];
    tempMarkers: any[];

    rows = [];
    columns = [];
    temp = [];
    temp2 = [];
    status_list: any;
    select_category: any;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService

    ) {
        this.access_token = localStorage.getItem('access_token')
    }


    ngOnInit() {

        Observable.interval(5000)
            .takeWhile(() => true)
            .subscribe(() => this.getAllOrders(this.access_token));

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
                    this.status_list = [
                        { name: 'Waiting For Estimations', id: 5 },
                        { name: 'Estimations Received', id: 4 },
                        { name: 'Estimation Accepted', id: 3 },
                        { name: 'Order Delivery Started', id: 2 },
                        { name: 'Order Delivered', id: 6 },
                        { name: 'Order Canceled', id: 7 },
                        { name: 'Order On Hold', id: 8 },
                        { name: 'Order Rejected', id: 9 },
                    ];
                    this.select_category = 0;

                    this.getSellers(this.access_token);
                    this.getAllOrders(this.access_token);
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

    // get all sellers 
    getSellers(token) {
        this.apiServices.getAllSellersLocations(token).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {

                    let temp_markers = [];
                    for (let data of res.data) {
                        let t_marker = {
                            lat: data.operationalLat,
                            lng: data.operationalLongi,
                            label: '',
                            draggable: false,
                            icon: this.seller_marker
                        }

                        temp_markers.push(t_marker);
                    }

                    this.markers = temp_markers;
                    this.tempMarkers = this.markers;
                }
            },
            err => {
                console.log(err);
            }
        )
    }


    // get Orders 
    getAllOrders(token) {
        this.apiServices.getAllOrders(token, 0).subscribe(
            (res: any) => {
                console.log(res);
                if (res.status == "success") {

                    let temp_orders = [];
                    let x = 0;
                    let temp_markers = this.markers;

                    for (let data of res.data) {
                        if (data.recordStatus > 1) {

                            let t_order = {
                                index: (x + 1),
                                date: new Date(data.confirmedDate),
                                status: data.recordStatus,
                                productNames: '',
                                order_id: data.orderId

                            }

                            let t_products = '';
                            let y = 0;
                            for (let product of data.orderProducts) {
                                y += 1;
                                if (y < 4) {
                                    if (t_products.length > 0) {
                                        t_products = t_products + ', ' + product.productName;
                                    }
                                    else {
                                        t_products = product.productName;
                                    }
                                } else if (y == 4) {
                                    t_products = t_products + '... ';
                                    break;
                                }

                            }

                            t_order.productNames = t_products;

                            temp_orders.push(t_order);

                            // get order locations 
                            let t_marker = {
                                lat: data.address.lat,
                                lng: data.address.longi,
                                label: '',
                                draggable: false,
                                icon: this.buyer_marker
                            };
                            temp_markers.push(t_marker);

                        }


                        x += 1;


                    }

                    this.rows = temp_orders;
                    this.temp = this.rows;

                    this.markers = temp_markers;
                }
            },
            err => {
                console.log(err);
            }
        )
    }


    // getOrdersRefresh() {
    //     alert("x");
    //     Observable.interval(5000)
    //         .takeWhile(() => true)
    //         .subscribe(() => this.getAllOrders(this.access_token));
    // }

    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    // filter 
    // by status
    onChangeStatus(status) {

        if (status > 0) {
            const temp_data = this.temp;
            let result = [];

            for (let data of temp_data) {
                if (status == data.status) {
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


}

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    icon: string;
}
