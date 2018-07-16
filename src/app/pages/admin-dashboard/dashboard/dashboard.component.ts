import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../../services/api-services/api-services.service';
import { Marker } from '@agm/core/services/google-maps-types';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    public access_token = '';

    public lat: number = 7.291418;
    public lng: number = 80.636696;

    markers: any[];

    constructor(
        public router: Router,
        private apiServices: ApiServicesService

    ) {
        this.access_token = localStorage.getItem('access_token')
    }


    ngOnInit() {

        this.markers = [
            {
                lat: 6.927079453,
                lng: 79.861244434,
                label: 'A',
                draggable: true,
                icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'
            },
        ];

        // check if user is logged in
        if (this.access_token) {

            // user details 
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {

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

    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

}

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    icon: string;
}
