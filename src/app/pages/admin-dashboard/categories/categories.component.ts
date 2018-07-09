import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

    rows = [];
    columns = [];
    temp = [];

    constructor() { }

    ngOnInit() {
        this.rows = [
            { index: 1, category_id: 1, name: 'Coconut', image: 'image' },
        ];
        this.columns = [
            { name: 'index' },
            { name: 'category_id' },
            { name: 'name' },
            { name: 'image' },
        ];

        this.temp = this.rows;
    }

    // filter 
    // by product name
    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp_data = this.temp.filter(function (d) {
            return d.name.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.rows = temp_data;
    }

}
