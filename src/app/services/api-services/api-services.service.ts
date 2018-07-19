import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import routes
import { Router } from '@angular/router';

import swal from 'sweetalert2';

const httpOptions = {}

// const SERVER_URL = 'http://192.168.1.5:8060/api/';
const SERVER_URL = 'http://dev-lb-891765181.ap-southeast-1.elb.amazonaws.com:8090/api/';

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

    // success alert
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

    // error allert
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

    // delete confirmation 
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

    // reload location with time out 
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
    getUserDetails(token) {
        const url = SERVER_URL + 'admin/me';
        return this.http.get(url, { headers: { Authorization: 'Bearer ' + token}});
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
    getImageUrlS3(data, token) {
        const url = SERVER_URL + 'admin/image';

        return this.http.get(url, { headers: { Authorization: 'Bearer ' + token }, params: { image_name: data }, responseType: 'text' });
    }

    // categories 
    // get 
    getCategoriesAll(token) {
        const url = SERVER_URL + 'categories';
        return this.http.get(url, { headers: { Authorization: 'Bearer ' + token}});
    }

    // get category by type
    getCategoryByType(token, data) {
        const url = SERVER_URL + 'admin/categories';

        return this.http.get(url, { headers: { Authorization: 'Bearer ' + token }, params: { type: data } });
    }

    // get details 
    getCategoryById(data, token) {
        const url = SERVER_URL + 'admin/category';
        return this.http.get(url, { headers: { Authorization: 'Bearer ' + token}, params: { id: data } });
    }

    // create 
    createCategory(data, token) {
        const formData: FormData = new FormData();
        formData.append('data', JSON.stringify(data.info));
        formData.append('image', data.imageUrl);

        const url = SERVER_URL + 'admin/category';
        return this.http.post(url, formData, { headers: { Authorization: 'Bearer ' + token}})
    }

    // edit 
    // name
    updateCategoryName(data, token) {
        let set_data = {
            "name": data.categoryName,
            "categoryId": data.categoryId,
            "type": data.type
        }

        const url = SERVER_URL + 'admin/category/update';
        return this.http.post(url, set_data, {headers: { Authorization: 'Bearer ' + token}})
    }

    // image 
    updateCategoryImage(data, token) {
        const formData: FormData = new FormData();
        formData.append('image', data.imageUrl);
        formData.append('id', data.categoryId);

        const url = SERVER_URL + 'admin/category/image';
        return this.http.post(url, formData,{ headers: { Authorization: 'Bearer ' + token}})
    }

    // delete category
    deleteCategory(data, token) {
        let set_data = { "id": data }
        const url = SERVER_URL + 'admin/category/delete';
        return this.http.post(url, set_data, { headers: { Authorization: 'Bearer ' + token}})
    }

    // enable category 
    enableCategory(data, token) {
        let set_data = { "categoryId": data.categoryId, "recordStatus": data.recordStatus }
        const url = SERVER_URL + 'admin/category/enable';
        return this.http.post(url, set_data, {headers: { Authorization: 'Bearer ' + token}})
    }

    // products 
    // get 
    getAllProducts(token) {
        const url = SERVER_URL + 'admin/products/all';
        return this.http.get(url, { headers: { Authorization: 'Bearer ' + token}});
    }

    // create 
    createProduct(data, token) {
        const formData: FormData = new FormData();
        formData.append('data', JSON.stringify(data.info));
        formData.append('image', data.imageUrl);

        const url = SERVER_URL + 'admin/product';
        return this.http.post(url, formData, { headers: { Authorization: 'Bearer ' + token}})
    }

    // update product
    updateProductDetails(data, token) {

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
        return this.http.post(url, set_data, { headers: { Authorization: 'Bearer ' + token}})
    }

    // update image 
    updateProductImage(data, token) {
        const formData: FormData = new FormData();
        formData.append('image', data.imageUrl);
        formData.append('id', data.productId);

        const url = SERVER_URL + 'admin/product/image';
        return this.http.post(url, formData, { headers: { Authorization: 'Bearer ' + token}})
    }

    // delete product 
    deleteProduct(data, token) {
        let set_data = { "id": data }
        const url = SERVER_URL + 'admin/product/delete';
        return this.http.post(url, set_data, { headers: { Authorization: 'Bearer ' + token}})
    }

    // enable product 
    enableProduct(data, token) {
        let set_data = { "productId": data.productId, "recordStatus": data.recordStatus }
        const url = SERVER_URL + 'admin/product/enable';
        return this.http.post(url, set_data, {headers: { Authorization: 'Bearer ' + token}})
    }


    // services 
    // get 
    // same as products

    // create 
    createService(data, token) {
        const formData: FormData = new FormData();
        formData.append('data', JSON.stringify(data.info));
        formData.append('image', data.imageUrl);

        const url = SERVER_URL + 'admin/service';
        return this.http.post(url, formData, { headers: { Authorization: 'Bearer ' + token}})
    }

    // update service 
    updateServiceDetails(data, token) {
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
        return this.http.post(url, set_data, {headers: { Authorization: 'Bearer ' + token}})
    }

    // update image 
    updateServiceImage(data, token) {
        const formData: FormData = new FormData();
        formData.append('image', data.imageUrl);
        formData.append('id', data.productId);

        const url = SERVER_URL + 'admin/service/image';
        return this.http.post(url, formData, {headers: { Authorization: 'Bearer ' + token}})
    }
    // delete product 
    deleteService(data, token) {
        let set_data = { "id": data }
        const url = SERVER_URL + 'admin/service/delete';
        return this.http.post(url, set_data, {headers: { Authorization: 'Bearer ' + token}})
    }


    // get product by id
    getProductById(data, token) {
        const url = SERVER_URL + 'product';
        return this.http.get(url, {headers: { Authorization: 'Bearer ' + token}, params: { productId: data } });
    }


    // users 
    // get sellers 
    getAllSellers(token) {
        const url = SERVER_URL + 'admin/sellers';
        return this.http.get(url, {headers: { Authorization: 'Bearer ' + token}});
    }

    // accept seller 
    acceptSeller(data, token) {

        let set_data = { "username": data }
        const url = SERVER_URL + 'admin/sellers/approve';
        return this.http.post(url, set_data, { headers: { Authorization: 'Bearer ' + token}})
    }

    // block seller 
    blockSeller(data, token){
        let set_data = { "username": data.username, "comment": data.comment }
        const url = SERVER_URL + 'admin/sellers/block';
        return this.http.post(url, set_data, {headers: { Authorization: 'Bearer ' + token}})
    }

    // unblock seller 
    unblockSeller(data, token){
        let set_data = { "username": data.username, "comment": data.comment }
        const url = SERVER_URL + 'admin/sellers/unblock';
        return this.http.post(url, set_data, {headers: { Authorization: 'Bearer ' + token}})
    }

    // get Seller details 
    getSellerDetailsById(data, token) {
        const url = SERVER_URL + 'admin/sellers/details';
        return this.http.get(url, {headers: { Authorization: 'Bearer ' + token}, params: { username: data } });
    }

    // dashboard 
    // get all sellers 
    getAllSellersLocations(token) {
        const url = SERVER_URL + 'admin/sellers/all';
        return this.http.get(url, {headers: { Authorization: 'Bearer ' + token}});
    }

    // get orders 
    getAllOrders(token, data) {
        const url = SERVER_URL + 'admin/orders';
        return this.http.get(url, {headers: { Authorization: 'Bearer ' + token}, params: { status: data } });
    }

    // get order by id 
    getOrderById(token, data) {
        const url = SERVER_URL + 'admin/order/details';
        return this.http.get(url, {headers: { Authorization: 'Bearer ' + token}, params: { order_id: data } });
    }

}
