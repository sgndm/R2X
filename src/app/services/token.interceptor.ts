// // create this file
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  public access_token = '';
  constructor(
  ) {
    this.access_token = localStorage.getItem('access_token')
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // console.log('Interceptor is working properly now...')
    // console.log(request);
    console.log('access_token : ' + this.access_token);
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.access_token}`
      }
    })

     console.log(request);
    return next.handle(request);
  }
}
