import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppHeaderComponent } from './app-header/app-header.component';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button';
import { HomeComponent } from './home/home.component'
import { GlobalConstants } from './constants/global-constants';


@NgModule({
  declarations: [
    AppHeaderComponent,
    HomeComponent,
    AppComponent,
    
    
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [GlobalConstants],
  bootstrap: [AppComponent]
})
export class AppModule { }
