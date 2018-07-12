import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import routes
import { Router } from '@angular/router';

import swal from 'sweetalert2';

const httpOptions = {}

// const SERVER_URL = 'http://192.168.2.140:8090/api/';
const SERVER_URL = 'http://dev-lb-891765181.ap-southeast-1.elb.amazonaws.com/api/';

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

    altScc(content, callback) {
        swal({
            type: 'success',
            title: '<span class="text-success">Success</span>',
            text: content,
            showConfirmButton: false,
            timer: 2000,
            width: 500,
            padding: 20
        }).then(
            callback
        )
    }

    altErr(content, callback) {
        swal({
            type: 'error',
            title: '<span class="text-danger">Oops..</span>',
            text: content,
            showConfirmButton: false,
            timer: 2000,
            width: 500,
            padding: 20
        }).then(
            callback
        )
    }

    altDelConfirm(callback) {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                callback
            }
        })
    }

    altConfirm(text, callback) {
        swal({
            title:'Are you sure?',
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes, I'm Sure!"
        }).then((result) => {
            if (result.value) {
                callback
            }
        })
    }

    altWithImput() {
        swal({
            title: 'Add a comment',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: false,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {

            },
            allowOutsideClick: false,
        }).then((result) => {
            if (result.value) {
                swal({
                    title: `${result.value.login}'s avatar`,
                    imageUrl: result.value.avatar_url
                })
            }
        })
    }

    reload() {
        window.setTimeout(function () { window.location.reload() }, 1500);
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

    // get user details 
    getUserDetails() {
        const url = SERVER_URL + 'admin/me';
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

    // get images from s3 bucket
    getImageUrlS3(data) {
        const url = SERVER_URL + 'admin/image';

        return this.http.get(url, { headers: {}, params: { image_name: data }, responseType: 'text' });
    }

    // categories 
    // get 
    getCategoriesAll() {
        const url = SERVER_URL + 'categories';
        return this.http.get(url);
    }

    // get details 
    getCategoryById(data) {
        const url = SERVER_URL + 'admin/category';
        return this.http.get(url, { params: { id: data } });
    }

    // create 
    createCategory(data) {
        const formData: FormData = new FormData();
        formData.append('data', JSON.stringify(data.info));
        formData.append('image', data.imageUrl);

        const url = SERVER_URL + 'admin/category';
        return this.http.post(url, formData)
    }

    // edit 
    // name
    updateCategoryName(data) {
        let set_data = {
            "name": data.categoryName,
            "categoryId": data.categoryId
        }

        const url = SERVER_URL + 'admin/category/update';
        return this.http.post(url, set_data)
    }

    // image 
    updateCategoryImage(data) {
        const formData: FormData = new FormData();
        formData.append('image', data.imageUrl);
        formData.append('id', data.categoryId);

        const url = SERVER_URL + 'admin/category/image';
        return this.http.post(url, formData)
    }

    // delete category
    deleteCategory(data) {
        let set_data = { "id": data }
        const url = SERVER_URL + 'admin/category/delete';
        return this.http.post(url, set_data)
    }

    // enable category 
    enableCategory(data) {
        let set_data = { "categoryId": data.categoryId, "recordStatus": data.recordStatus }
        const url = SERVER_URL + 'admin/category/enable';
        return this.http.post(url, set_data)
    }

    // products 
    // get 
    getAllProducts() {
        const url = SERVER_URL + 'admin/products/all';
        return this.http.get(url);
    }

    // create 
    createProduct(data) {
        const formData: FormData = new FormData();
        formData.append('data', JSON.stringify(data.info));
        formData.append('image', data.imageUrl);

        const url = SERVER_URL + 'admin/product';
        return this.http.post(url, formData)
    }

    // update product
    updateProductDetails(data) {

        let set_data = {
            "name": data.name,
            "description": data.description,
            "estimatedPrice": data.estimatedPrice,
            "categoryId": data.categoryId,
            "paymentUnit": data.paymentUnit,
            "isProduct": 1,
            "productId": data.productId
        }

        const url = SERVER_URL + 'admin/product/update';
        return this.http.post(url, set_data)
    }

    // update image 
    updateProductImage(data) {
        const formData: FormData = new FormData();
        formData.append('image', data.imageUrl);
        formData.append('id', data.productId);

        const url = SERVER_URL + 'admin/product/image';
        return this.http.post(url, formData)
    }

    // delete product 
    deleteProduct(data) {
        let set_data = { "id": data }
        const url = SERVER_URL + 'admin/product/delete';
        return this.http.post(url, set_data)
    }

    // enable product 
    enableProduct(data) {
        let set_data = { "productId": data.productId, "recordStatus": data.recordStatus }
        const url = SERVER_URL + 'admin/product/enable';
        return this.http.post(url, set_data)
    }


    // services 
    // get 
    // same as products

    // create 
    createService(data) {
        const formData: FormData = new FormData();
        formData.append('data', JSON.stringify(data.info));
        formData.append('image', data.imageUrl);

        const url = SERVER_URL + 'admin/service';
        return this.http.post(url, formData)
    }

    // update service 
    updateServiceDetails(data) {
        let set_data = {
            "name": data.name,
            "description": data.description,
            "estimatedPrice": data.estimatedPrice,
            "categoryId": data.categoryId,
            "paymentUnit": data.paymentUnit,
            "isProduct": data.isProduct,
            "productId": data.productId
        }

        const url = SERVER_URL + 'admin/service/update';
        return this.http.post(url, set_data)
    }

    // update image 
    updateServiceImage(data) {
        const formData: FormData = new FormData();
        formData.append('image', data.imageUrl);
        formData.append('id', data.productId);

        const url = SERVER_URL + 'admin/service/image';
        return this.http.post(url, formData)
    }
    // delete product 
    deleteService(data) {
        let set_data = { "id": data }
        const url = SERVER_URL + 'admin/service/delete';
        return this.http.post(url, set_data)
    }


    // get product by id
    getProductById(data) {
        const url = SERVER_URL + 'product';
        return this.http.get(url, { params: { productId: data } });
    }


    // users 
    // get sellers 
    getAllSellers() {
        const url = SERVER_URL + 'admin/sellers';
        return this.http.get(url);
    }

    // accept seller 
    acceptSeller(data) {

        let set_data = { "username": data }
        const url = SERVER_URL + 'admin/sellers/approve';
        return this.http.post(url, set_data)
    }

    // block seller 
    blockSeller(data){
        let set_data = { "username": data.username, "comment": data.comment }
        const url = SERVER_URL + 'admin/sellers/block';
        return this.http.post(url, set_data)
    }



}
