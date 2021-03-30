import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, throwError } from 'rxjs';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { routes } from '../app-routing.module';
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
  let MockCustomerService = jasmine.createSpyObj('CustomerService', ['getById','update']);
  let MockUtilityService = jasmine.createSpyObj('UtilityService', ['openSnackBar']);
  let snackBarSpy = {open: jasmine.createSpy('open')};
  let customerService:CustomerService
  let router:Router

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub({ id: paramId });

    await TestBed.configureTestingModule({
      declarations: [ CustomerFormEditComponent
       ],
      imports:[
        RouterTestingModule.withRoutes(routes), 
        HttpClientTestingModule,
        AngularMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule
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
    router = TestBed.inject(Router)
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
  it('initFormGroup() should initialize customer form by calling InitForm()',()=>{
    spyOn(component, 'InitForm')
    component.initFormGroup()
    
    expect(component.InitForm).toHaveBeenCalled()
  })
  it('InitForm() should initialize form controls with customer data',()=>{
    component.InitForm()
    expect(component.name.value).toBe(component.customer.name)
    expect(component.lastName.value).toBe(component.customer.lastName)
    expect(component.houseNo.value).toBe(component.customer.houseNumber)
    expect(component.street.value).toBe(component.customer.street)
    expect(component.phone.value).toBe(component.customer.phone)
    expect(component.customerForm.valid).toBeTruthy()
  })
  it('customer form controls has expected validators',()=>{
    component.customer.houseNumber = ''
    component.customer.lastName = ''
    component.customer.name = ''
    component.customer.phone = ''
    component.customer.street = ''
    component.initFormGroup()
    /*component.name.setValue('')
    component.lastName.setValue('')
    component.houseNo.setValue('')
    component.street.setValue('')
    component.phone.setValue('')*/

    let nameErr = component.name.errors || {}
    let lastNameErr = component.lastName.errors || {}
    let houseNoErr = component.houseNo.errors || {}
    let streetErr = component.street.errors || {}
    let phoneErr = component.phone.errors || {}

    expect(nameErr['required']).toBeTruthy()
    expect(lastNameErr['required']).toBeTruthy()
    expect(houseNoErr['required']).toBeTruthy()
    expect(streetErr['required']).toBeTruthy()
    expect(phoneErr['required']).toBeTruthy()
    expect(component.customerForm.valid).toBeFalsy()
  })
  it('gotoView() should redirect to /customer/view', fakeAsync(() => {
    spyOn(router, 'navigate')
    component.gotoView()
    tick()
    expect(router.navigate).toHaveBeenCalledWith(['/customer/view']); 
  }))
  it('update should not call customer service update() if customer form is not valid', fakeAsync(()=>{
    component.customer.houseNumber = ''
    component.customer.lastName = ''
    component.customer.name = ''
    component.customer.phone = ''
    component.customer.street = ''
    component.initFormGroup()
    let httpResponse = new HttpResponse<Customer>({body:null, status:200})
    spyOn(customerService, 'update').and.returnValue(of(httpResponse))
    component.update()
    expect(customerService.update).not.toHaveBeenCalled()

  }))

  it('update should call customer service update() and return http status 204 if customer form is valid', fakeAsync(()=>{
    
    component.customer.houseNumber = MockCustomer[0].houseNumber;
    component.customer.lastName = MockCustomer[0].lastName
    component.customer.name = MockCustomer[0].name
    component.customer.phone = MockCustomer[0].phone
    component.customer.street = MockCustomer[0].street
    component.initFormGroup()
    
    expect(component.customerForm.valid).toBe(true)
    
    let httpResponse = new HttpResponse<any>({body:null, status:204})
    spyOn(customerService, 'update').and.returnValue(of(httpResponse))
    spyOn(component, 'openSnackBar')
    spyOn(component, 'gotoView')
    component.update()
    expect(customerService.update).toHaveBeenCalled()
    expect(component.openSnackBar).toHaveBeenCalled()
    expect(component.gotoView).toHaveBeenCalled()
  }))

  it('update() should call customer service update() and return http status 304 if customer form is valid', fakeAsync(()=>{
    
    component.customer.houseNumber = MockCustomer[0].houseNumber;
    component.customer.lastName = MockCustomer[0].lastName
    component.customer.name = MockCustomer[0].name
    component.customer.phone = MockCustomer[0].phone
    component.customer.street = MockCustomer[0].street
    component.initFormGroup()
    
    expect(component.customerForm.valid).toBe(true)
    
    let httpResponse = new HttpResponse<any>({body:null, status:304})
    spyOn(customerService, 'update').and.returnValue(of(httpResponse))
    spyOn(component, 'openSnackBar')
    spyOn(component, 'gotoView')
    component.update()
    expect(customerService.update).toHaveBeenCalled()
    expect(component.openSnackBar).toHaveBeenCalled()
    expect(component.gotoView).not.toHaveBeenCalled()
  }))
  it('update() should call customer service update() which will throw error on http status 500', fakeAsync(()=>{
    component.customer.houseNumber = MockCustomer[0].houseNumber ;
    component.customer.lastName = MockCustomer[0].lastName
    component.customer.name = MockCustomer[0].name
    component.customer.phone = MockCustomer[0].phone
    component.customer.street = MockCustomer[0].street
    component.initFormGroup()
    
    expect(component.customerForm.valid).toBe(true)
    spyOn(customerService, 'update').and.returnValue(throwError({status: 500}))
    spyOn(component, 'openSnackBar')
    component.update()
    tick()
    expect(customerService.update).toHaveBeenCalled()
    expect(component.openSnackBar).toHaveBeenCalled();
    
  }))
  it('update button should call update() in component',()=>{
    spyOn(component, 'update')
    component.loading=false;
    fixture.detectChanges()
    const updateButtonEL = fixture.debugElement.query(By.css('#updateCustomer'));
    //const updateButtonEL = document.getElementById('updateCustomer')
    expect(updateButtonEL).not.toBeNull()
    updateButtonEL.triggerEventHandler('click', null);
    expect(component.update).toHaveBeenCalled()
  })
  it('cancel button should call gotoView() in component',()=>{
    spyOn(component, 'gotoView')
    component.loading=false;
    fixture.detectChanges()
    const cancelButtonEL = fixture.debugElement.query(By.css('#cancelUpdate'));
    expect(cancelButtonEL).not.toBeNull()
    //expect(cancelButtonEL.nativeElement.value).toBe('Cancel')
    cancelButtonEL.triggerEventHandler('click', null);
    expect(component.gotoView).toHaveBeenCalled()
  })

});
