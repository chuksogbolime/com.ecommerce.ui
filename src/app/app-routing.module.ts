import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerFormEditComponent } from './customer-form-edit/customer-form-edit.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer/customer.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "customer", component: CustomerComponent,
  children:[
    { path: "", redirectTo: "view" , pathMatch: "full"},
    { path: "create", component: CustomerFormComponent },
    { path: "view", component: CustomerListComponent },
    { path: "edit/:id", component: CustomerFormEditComponent }
  ]
 },
  { path: "**", component: HomeComponent } //if path is not found, load home page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
