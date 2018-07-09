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

	myForm: FormGroup;

	username: FormControl;
	password: FormControl;

	constructor(
		public router: Router,
		private apiServices: ApiServicesService
	) { }

	ngOnInit() {

		this.createFormControls();
		this.createForm();

		// check if user has already logged in

		// if (this.apiServices.access_token != '') {
		// 	// if access token is not empty
		// 	// check user
		// 	this.apiServices.checkLogin().subscribe(
		// 		res => {
		// 			// if access token is valid
		// 			// go to dashboard
		// 			console.log(res);
		// 			this.goToDashboard();
		// 		},
		// 		err => {
		// 			// if access token is not valid
		// 			// clea local storage
		// 			this.apiServices.clearLocalStorage();
		// 			console.log(err);

		// 		}
		// 	)
		// }
	}

	ngAfterViewInit() {
		$(function () {
			$(".preloader").fadeOut();
		});
		// $(function() {
		//     (<any>$('[data-toggle="tooltip"]')).tooltip()
		// });
		// $('#to-recover').on("click", function() {
		//     $("#loginform").slideUp();
		//     $("#recoverform").fadeIn();
		// });
	}

	createFormControls() {
		this.username = new FormControl('', [Validators.required, Validators.minLength(1)]);
		this.password = new FormControl('', [Validators.required, Validators.minLength(1)]);
	}

	createForm() {
		this.myForm = new FormGroup({
			username: this.username,
			password: this.password
		});
	}

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

	onLogin() {

		if (this.myForm.valid) {
			//this.goToDashboard();
			const data = {
				u: this.myForm.value.username,
				p: this.myForm.value.password
			};

			// // call the login end point
			// this.apiServices.login(data).subscribe(
			// 	(res: Response) => {
			// 		// if login success
			// 		console.log(res);
			// 		let get_access_token = res.headers.get('X-AUTH-TOKEN');

			// 		// store token in local storage 
			// 		this.apiServices.saveToLocalStorage(get_access_token);

			// 		// get user details 
			// 		this.getDetails(get_access_token);

			// 	},

			// 	err => {
			// 		// if login has failed
			// 		console.log(err);
			// 		if (err.status == 403) {
			// 			this.apiServices.altErr('Username or password is incorrect', '');
			// 		}
			// 		else if (err.status == 500) {
			// 			this.apiServices.altErr('Server Error', this.apiServices.reload());
			// 		}

			// 	}
			// )

			this.goToDashboard();
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
