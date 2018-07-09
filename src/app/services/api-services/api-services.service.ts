import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {}

const SERVER_URL = 'http://prod-alb-242909088.ap-southeast-1.elb.amazonaws.com:8080/api/';

@Injectable()
export class ApiServicesService {

  // access token
  public access_token = '';

  constructor(
    private http: HttpClient
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
    return this.http.post(url, formData, httpOptions)

  }

  // check loged in users
  checkLogin() {
    const url = SERVER_URL + 'users/me';
    return this.http.get(url);
  }

  // save acces token in local storage
  saveToLocalStorage(token) {
    this.access_token = token;
    localStorage.setItem('access_token', token);
  }

  // clear local storage
  clearLocalStorage() {
    localStorage.removeItem('access_token');
    this.access_token = '';
  }

  // get stats
  getStats() {
    const url = SERVER_URL + 'stats/users/registered?start_date=2018/03/20&end_date=2018/04/25';
    return this.http.get(url);
  }


}
