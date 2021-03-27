import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CustomerService } from './services/customer.service';

class MatIconStub{
  open(){
    return {
      onAction: () => of({})
    }
  }

}
let MockCustomerService = jasmine.createSpyObj('CustomerService', ['get']);
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppHeaderComponent,
        HomeComponent,
        AppComponent
        
        
      ],
      providers:[
        {provider:CustomerService, useValue:MockCustomerService},
        HttpClient,
        MatSnackBar
        //{provide: MatIcon, useClass: MatIconStub}, 
        //MatToolbar
        
      ],
      //schemas: [NO_ERRORS_SCHEMA]
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

   
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  xit(`should have as title 'ecommerce'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    //expect(app.title).toEqual('ecommerce');
  });

  xit('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('ecommerce app is running!');
  });
});
