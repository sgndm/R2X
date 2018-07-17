import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// admin dashboard
// products and services
import { ProductListComponent } from './admin-dashboard/product-list/product-list.component';
import { ServiceListComponent } from './admin-dashboard/service-list/service-list.component';
import { CreateProductComponent } from './admin-dashboard/create-product/create-product.component';
import { CreateServiceComponent } from './admin-dashboard/create-service/create-service.component';
import { EditProductComponent } from './admin-dashboard/edit-product/edit-product.component';
import { EditServiceComponent } from './admin-dashboard/edit-service/edit-service.component';
import { ViewProductComponent } from './admin-dashboard/view-product/view-product.component';
import { ViewServiceComponent } from './admin-dashboard/view-service/view-service.component';
// categories
import { CategoriesComponent } from './admin-dashboard/categories/categories.component';
import { CreateCategoryComponent } from './admin-dashboard/create-category/create-category.component';
import { EditCategoryComponent } from './admin-dashboard/edit-category/edit-category.component';

// users
import { SellerListComponent } from './admin-dashboard/seller-list/seller-list.component';
import { SellerViewComponent } from './admin-dashboard/seller-view/seller-view.component';

// dashboard
import { DashboardComponent } from './admin-dashboard/dashboard/dashboard.component';
import { ViewOrderComponent } from './admin-dashboard/view-order/view-order.component';

const routes: Routes = [
    // admin 
    // products & services
    { path: '', redirectTo: 'admin/dashboard' },
    { path: 'admin/products', component: ProductListComponent },
    { path: 'admin/services', component: ServiceListComponent },
    { path: 'admin/products/create', component: CreateProductComponent },
    { path: 'admin/services/create', component: CreateServiceComponent },
    { path: 'admin/products/edit/product/:id', component: EditProductComponent },
    { path: 'admin/services/edit/service/:id', component: EditServiceComponent },
    { path: 'admin/products/view/product/:id', component: ViewProductComponent },
    { path: 'admin/services/view/service/:id', component: ViewServiceComponent },
    // categories
    { path: 'admin/categories', component: CategoriesComponent },
    { path: 'admin/categories/create', component: CreateCategoryComponent },
    { path: 'admin/categories/edit/category/:id', component: EditCategoryComponent },

    // users 
    // sellers 
    { path: 'admin/users/sellers', component: SellerListComponent },
    { path: 'admin/users/sellers/seller/:id', component: SellerViewComponent },

    // dashboard
    { path: 'admin/dashboard', component: DashboardComponent },
    { path: 'admin/dashboard/orders/order/:id', component: ViewOrderComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
