import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Customer, EmptyCustomer, MockCustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { ActivatedRouteStub } from '../shared/activated-route-stub';
import { UtilityService } from '../shared/util';

import { CustomerFormEditComponent } from './customer-form-edit.component';

describe('CustomerFormEditComponent', () => {
  let component: CustomerFormEditComponent;
  let fixture: ComponentFixture<CustomerFormEditComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let activatedRoute: ActivatedRouteStub;
  let paramId = '1';
  let MockCustomerService = jasmine.createSpyObj('CustomerService', ['getById']);
  let MockUtilityService = jasmine.createSpyObj('UtilityService', ['openSnackBar']);
  let snackBarSpy = {open: jasmine.createSpy('open')};
  let customerService:CustomerService

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub({ id: paramId });

    await TestBed.configureTestingModule({
      declarations: [ CustomerFormEditComponent
       ],
      imports:[
        RouterTestingModule, HttpClientTestingModule
      ],
      providers:[
        { provide: MatSnackBar, useValue: snackBarSpy },
        {provider:Router, useValue:routerSpy},
        {provide: ActivatedRoute, useValue: activatedRoute},
        {provider:CustomerService, useValue:MockCustomerService},
        {proviser:UtilityService, useValue:MockUtilityService},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFormEditComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService)

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('activated route should have a param with name id and value 1',fakeAsync(()=>{
    //let httpResponse = new HttpResponse<Customer>({body:MockCustomer[0], status:200})
    //spyOn(customerService, 'getById').and.returnValue(of(httpResponse))
    component.ngOnInit()
    tick()
    expect(component.customerId).toBe(Number(paramId))
  }))
  it('ngOnInit() should call getCustomerById() with valid customer id',fakeAsync(()=>{
    let httpResponse = new HttpResponse<Customer>({body:MockCustomer[0], status:200})
    spyOn(customerService, 'getById').and.returnValue(of(httpResponse))
    component.ngOnInit()
    tick()
    expect(component.customerId).toBe(Number(paramId))
    expect(component.getCustomerById(component.customerId)).toHaveBeenCalled
  }))
  it('getCustomerById() should call customer service and get status 200 with not null response body',fakeAsync(()=>{
    let httpResponse = new HttpResponse<Customer>({body:MockCustomer[0], status:200})
    spyOn(customerService, 'getById').and.returnValue(of(httpResponse))
    component.getCustomerById(MockCustomer[0].id)
    tick()
    expect(component.customer).not.toBeNull()
    expect(component.customer.name).not.toBe('')
  }))
  it('handle getCustomerById() call to customer service that returns status 200 with null response body',fakeAsync(()=>{
    let httpResponse = new HttpResponse<Customer>({body:null, status:200})
    spyOn(customerService, 'getById').and.returnValue(of(httpResponse))
    component.getCustomerById(-1)
    tick()
    expect(component.customer).not.toBeNull()
    expect(component.customer).toEqual(EmptyCustomer)
  }))
  it('getCustomerById() should call customer service and get status 400 with null response body',fakeAsync(()=>{
    let httpResponse = new HttpResponse<Customer>({body:null, status:400})
    spyOn(customerService, 'getById').and.returnValue(of(httpResponse))
    component.getCustomerById(MockCustomer[0].id)
    tick()
    expect(component.getCustomerById(component.customerId)).toHaveBeenCalled
    expect(component.customer).toEqual(EmptyCustomer)
  }))
  it('getCustomerById() should throw error on http status 500', fakeAsync(()=>{
   
    spyOn(customerService, 'getById').and.returnValue(throwError({status: 500}))
    component.getCustomerById(component.customerId)
    tick()
    expect(component.getCustomerById(component.customerId)).toHaveBeenCalled
    expect(component.customer).toEqual(EmptyCustomer)
  }))
});
