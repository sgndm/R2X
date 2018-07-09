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

    public access_token: any

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

        this.select_category = "";

        // check if user is logged in
        if(this.access_token) {
            alert(this.access_token);
            this.category_list = ['Food', 'Drinks', 'Cloths'];

            this.rows = [
                { index: 1, product_id: 1, name: 'Coconut', category: 'Food', price: 'Rs.75.00' },
                { index: 1, product_id: 1, name: 'Bread', category: 'Food', price: 'Rs.75.00' },
                { index: 1, product_id: 1, name: 'Ice-cream', category: 'Desert', price: 'Rs.75.00' },
                { index: 1, product_id: 1, name: 'XXX', category: 'xxx', price: 'Rs.75.00' },
            ];
    
            this.columns = [];
    
            this.temp = this.rows;
        } 
        else {
            this.apiServices.logout();
        }

        
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

}
