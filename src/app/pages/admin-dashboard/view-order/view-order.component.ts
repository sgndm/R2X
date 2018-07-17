import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';

@Component({
    selector: 'app-view-order',
    templateUrl: './view-order.component.html',
    styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

    public access_token = '';

    public order_id;

    public product_list: any;

    public order_date: any;
    public order_status: any;
    public delivery_charges: any;

    constructor(
        private activeRoute: ActivatedRoute,
        public router: Router,
        private apiServices: ApiServicesService,
    ) {
        this.activeRoute.params.subscribe(
            params => {
                this.order_id = params.id;
                console.log(params);
            }
        );

        this.access_token = localStorage.getItem('access_token')
    }


    ngOnInit() {
        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {

                    this.getOrderDetails(this.access_token, this.order_id);
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


    // get order details 
    getOrderDetails(token, order_id) {
        this.apiServices.getOrderById(token, order_id).subscribe(
            (res: any) => {
                console.log(res);

                if(res.status == "success") {
                    this.order_date = new Date(res.data.confirmedDate);
                    this.order_status = res.data.recordStatus;

                    let temp_product_list = [];

                    for(let product of res.data.orderProducts) {
                        
                        let t_product = {
                            name: product.productName,
                            quantity: '',
                            price: 0
                        }

                        if(res.data.acceptedOrderEstimationId !== null){
                            t_product.price = (product.estimatedPrice * product.qty );
                        }

                        let paymentUnit = product.paymentUnit;
                        let productQuantity = product.qty;

                        if(paymentUnit == 1) {
                            if(product.qty <= 1) {
                                t_product.quantity = productQuantity + " Unit"
                            }
                            else {
                                t_product.quantity = productQuantity + " Units"
                            }
                        }
                        else if(paymentUnit == 4){
                            if(product.qty < 1) {
                                t_product.quantity = (productQuantity * 1000) + " g"
                            }
                            else {
                                t_product.quantity = productQuantity + " kg"
                            }
                        }
                        else if(paymentUnit == 5){
                            if(product.qty < 1) {
                                t_product.quantity = (productQuantity * 1000) + " ml"
                            }
                            else {
                                t_product.quantity = productQuantity + " l"
                            }
                        }
                        else if(paymentUnit == 2){
                            t_product.quantity = productQuantity + " per km"
                        }
                        else if(paymentUnit == 3){
                                t_product.quantity = productQuantity + " per hour"
                        }

                        if(res.data.acceptedEstimation !== null) {
                            this.delivery_charges = res.data.acceptedEstimation.deliveryCharges;
                        }
                        

                        temp_product_list.push(t_product);
                    }

                    this.product_list = temp_product_list;
                }
            },
            err =>{ 
                console.log(err);
            }
        )
    }

}
