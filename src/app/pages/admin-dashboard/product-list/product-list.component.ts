import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    rows = [];
    columns = [];
    temp = [];
    temp2 = [];
    category_list: any;
    select_category: any;

    constructor() { }

    ngOnInit() {

        this.select_category = "";

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
