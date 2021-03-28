import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppHeaderComponent } from './app-header/app-header.component';

import { HomeComponent } from './home/home.component'
import { GlobalConstants } from './constants/global-constants';
import { CustomerListComponent } from './customer-list/customer-list.component';

import { CustomerFormComponent } from './customer-form/customer-form.component'

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerComponent } from './customer/customer.component';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { CustomerFormEditComponent } from './customer-form-edit/customer-form-edit.component';
import { UtilityService } from './shared/util';
 

@NgModule({
  declarations: [
    AppHeaderComponent,
    HomeComponent,
    AppComponent,
    CustomerListComponent,
    CustomerFormComponent,
    CustomerComponent,
    ConfirmationDialogComponent,
    CustomerFormEditComponent,
    
    
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,

    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [GlobalConstants,
  MatSnackBar, UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
