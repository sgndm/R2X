// // create this file
import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';




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

        if (this.access_token !== '') {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.access_token}`
                }
            })
        }
        else {
            request = request.clone();
        }
        console.log("Http Request\n");
        console.log(request);
        console.log("\n");

        return next.handle(request).do((err: any) => {
            console.log("Interceptor\n");
            console.log(err);
            if (err instanceof HttpErrorResponse) {
                console.log(err);
            }
        });
    }
}
