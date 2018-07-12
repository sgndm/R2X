import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';

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
import { ServerDownComponent } from './error/server-down/server-down.component';
import { DashboardComponent } from './admin-dashboard/dashboard/dashboard.component';



@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ],
  declarations: [
    ProductListComponent,
    CreateProductComponent,
    CreateServiceComponent,
    ServiceListComponent,
    EditProductComponent,
    EditServiceComponent,
    ViewProductComponent,
    ViewServiceComponent,
    CategoriesComponent,
    CreateCategoryComponent,
    EditCategoryComponent,
    SellerListComponent,
    SellerViewComponent,
    ServerDownComponent,
    DashboardComponent
  ]
})
export class PagesModule { }
