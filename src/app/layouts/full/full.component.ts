import { Component, OnInit } from '@angular/core';
// import routes
import { Router, ActivatedRoute } from '@angular/router';
// import api services
import { ApiServicesService } from '../../services/api-services/api-services.service';

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'; 

@Component({
    selector: 'full-layout',
    templateUrl: './full.component.html',
    styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {

    public access_token = '';

    color = 'green';
    showSettings = false;
    showMinisidebar = false;   
    showDarktheme = false;

	public config: PerfectScrollbarConfigInterface = {};

    constructor(
        public router: Router,
        private apiServices: ApiServicesService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    ngOnInit() {
        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
                    console.log("Logged In");
                },
                err => {
                    console.log(err);
                    this.apiServices.logout();
                }
            )

        }
        else {
            this.apiServices.logout();
        }
    }

}
