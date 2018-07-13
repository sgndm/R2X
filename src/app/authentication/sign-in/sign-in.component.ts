import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
import * as $ from 'jquery';

// import routes
import { Router } from '@angular/router';
// import api services
import { ApiServicesService } from '../../services/api-services/api-services.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {

    public access_token = '';

    myForm: FormGroup;

    username: FormControl;
    password: FormControl;

    constructor(
        public router: Router,
        private apiServices: ApiServicesService
    ) {
        this.access_token = localStorage.getItem('access_token')
    }

    ngOnInit() {

        this.createFormControls();
        this.createForm();

        // check if token is set 
        if (this.access_token) {

            // get user details
            this.apiServices.getUserDetails(this.access_token).subscribe(
                (res: any) => {
                    console.log(res);
                    // if user logged in 

                    // go to dashboard
                    this.goToDashboard();
                },
                err => {
                    console.log(err);
                    if (err.status == 503 || err.status == 0) {
                        this.router.navigate(['/server-error']);
                    }
                    else {
                        this.apiServices.logout();
                    }
                }
            )
        }
        else {
            this.apiServices.logout();
        }
    }


    ngAfterViewInit() {
        $(function () {
            $(".preloader").fadeOut();
        });
    }

    //create form controls 
    createFormControls() {
        this.username = new FormControl('', [Validators.required, Validators.minLength(1)]);
        this.password = new FormControl('', [Validators.required, Validators.minLength(1)]);
    }

    // create form 
    createForm() {
        this.myForm = new FormGroup({
            username: this.username,
            password: this.password
        });
    }

    // validate login form
    validateAllFormFields(formGroup: FormGroup) {

        Object.keys(formGroup.controls).forEach(field => {

            const control = formGroup.get(field);

            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            }
            else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }

        });

    }

    // login 
    onLogin() {

        if (this.myForm.valid) {
            //this.goToDashboard();
            const data = {
                u: this.myForm.value.username,
                p: this.myForm.value.password
            };

            // call login api
            this.apiServices.login(data).subscribe(
                (res: any) => {
                    console.log(res);

                    // get token
                    let token = res.access_token;

                    // save to local storage
                    this.apiServices.saveToLocalStorage(token);

                    // check if token is set 
                    if (token) {

                        // get user details
                        this.apiServices.getUserDetails(token).subscribe(
                            (res: any) => {
                                console.log(res);
                                // if user logged in 

                                // go to dashboard
                                this.goToDashboard();
                            },
                            err => {
                                console.log(err);
                                this.apiServices.altErr('Login Failed! Username or password is incorrect', this.apiServices.logout());

                            }
                        )
                    }
                    else {
                        this.apiServices.logout();
                    }

                },
                err => {
                    console.log(err);
                    if (err.status == 503 || err.status == 0) {
                        this.router.navigate(['/server-error']);
                    } 
                    else {
                        this.apiServices.altErr('Login Failed! Username or password is incorrect', '');
                    }   
                    
                }
            )



            // this.goToDashboard();
        }
        else {
            this.validateAllFormFields(this.myForm);
        }
    }

    // redirect to dashboard
    goToDashboard() {
        this.router.navigate(['/pages']);
    }

}
