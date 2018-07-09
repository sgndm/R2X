import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import routes
import { Router } from '@angular/router';

const httpOptions = {}

const SERVER_URL = 'http://192.168.2.131:8090/api/';

@Injectable()
export class ApiServicesService {

    // access token
    public access_token = '';

    constructor(
        private http: HttpClient,
        public router: Router,
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    // login function
    login(data) {
        const formData: FormData = new FormData();
        formData.append('u', data.u);
        formData.append('p', data.p);
        formData.append('client_id', 'mobile_api_client');
        formData.append('grant_type', 'password');

        const url = SERVER_URL + 'oauth/token';
        return this.http.post(url, formData)

    }

    // logout 
    logout() {
        this.clearLocalStorage();
        this.router.navigate(['/sign-in']);
    }

    // check logged in users
    checkLogin() {
        const url = SERVER_URL + '/admin/me';
        return this.http.get(url);
    }

    // save access token in local storage
    saveToLocalStorage(token) {
        this.access_token = token;
        localStorage.setItem('access_token', token);
    }

    // clear local storage
    clearLocalStorage() {
        localStorage.removeItem('access_token');
        this.access_token = '';
    }


    // admin panel 
    // products & services 

    // categories 
    // get 
    getCategoriesAll() {
        const url = SERVER_URL + '/categories';
        return this.http.get(url);
    }



}
