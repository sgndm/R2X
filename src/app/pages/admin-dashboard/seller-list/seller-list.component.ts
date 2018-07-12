import { Component, OnInit } from '@angular/core';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';


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

    blockSeller(seller_id) {}
    
    acceptSeller(seller_id) {}

}
