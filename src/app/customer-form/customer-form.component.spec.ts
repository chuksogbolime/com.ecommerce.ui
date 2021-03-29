import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { MockCustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';

import { CustomerFormComponent } from './customer-form.component';

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let customerService:CustomerService
  let MockCustomerService = jasmine.createSpyObj('CustomerService', ['get']);
  let serviceSpy:any
  let http:any
  let httpResponse:any
  let snackBarSpy = {open: jasmine.createSpy('open')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerFormComponent ],
      imports:[RouterTestingModule, 
        AngularMaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule

      ],
      providers:[
        { provide: Router, useValue: routerSpy },
        {provider:CustomerService, useValue:MockCustomerService},
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gotoView should redirect to /customer/view', fakeAsync(() => {
    component.gotoView()
    expect(routerSpy.navigate).toHaveBeenCalledWith(['customer/view']); 
  }))
  it('setting form field should make the form valid',()=>{
    TestValidCustomerForm(component);
  })

  it('snot etting form field should make the form invalid',()=>{
    TestInvalidCustomerForm(component);
  })

  it("create() should call customer service's create() for a valid form",fakeAsync(()=>{
    TestValidCustomerForm(component);

    httpResponse = new HttpResponse({body:MockCustomer[0], status:201})
    serviceSpy = spyOn(customerService, 'create').and.returnValue(of(httpResponse))
    component.create()
    tick()
    expect(serviceSpy.calls.any()).toBe(true);
  }))

  it("create() should call customer service's create() for a valid form but returns null http body",fakeAsync(()=>{
    TestValidCustomerForm(component);

    httpResponse = new HttpResponse({body:null, status:201})
    serviceSpy = spyOn(customerService, 'create').and.returnValue(of(httpResponse))
    component.create()
    tick()
    expect(serviceSpy.calls.any()).toBe(true);
    
  }))

  it("create() should call customer service's create() for a valid form but returns null http body",fakeAsync(()=>{
    TestValidCustomerForm(component);

    httpResponse = new HttpResponse({body:null, status:400})
    serviceSpy = spyOn(customerService, 'create').and.returnValue(of(httpResponse))
    component.create()
    tick()
    expect(serviceSpy.calls.any()).toBe(true);
    
  }))

  it("create() should not call customer service's create() for an invalid form",fakeAsync(()=>{
    TestInvalidCustomerForm(component);

    httpResponse = new HttpResponse({body:MockCustomer[0], status:201})
    serviceSpy = spyOn(customerService, 'create').and.returnValue(of(httpResponse))
    component.create()
    tick()
    expect(serviceSpy.calls.any()).toBe(false);
  }))
  it("create() should call customer service's create() for a invalid form but fail with https 400",fakeAsync(()=>{
    TestInvalidCustomerForm(component);

    httpResponse = new HttpResponse({body:null, status:400})
    serviceSpy = spyOn(customerService, 'create').and.returnValue(of(httpResponse))
    component.create()
    tick()
    expect(serviceSpy.calls.any()).toBe(false);
    expect(component.openSnackBar).toHaveBeenCalled;
  }))

  it('create() should throw error on http status 500', fakeAsync(()=>{
    TestValidCustomerForm(component);
    serviceSpy = spyOn(customerService, 'create').and.returnValue(throwError({status: 500}))
    component.create()
    tick()
    expect(component.openSnackBar).toHaveBeenCalled;
    expect(serviceSpy.calls.any()).toBe(true);
  }))

  it('customer form controls has expected validators',()=>{
    component.InitForm()
    component.name.setValue('')
    component.lastName.setValue('')
    component.houseNo.setValue('')
    component.street.setValue('')
    component.phone.setValue('')
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
  })
  it('initFormGroup() should initialize customer form by calling InitForm()',()=>{
    spyOn(component, 'InitForm')
    component.initFormGroup()
    
    expect(component.InitForm).toHaveBeenCalled()
  })
  it('InitForm() should initialize form controls with customer data',()=>{
    component.InitForm()
    expect(component.name.value).toBe('')
    expect(component.lastName.value).toBe('')
    expect(component.houseNo.value).toBe('')
    expect(component.street.value).toBe('')
    expect(component.phone.value).toBe('')
  })
  it('create button should call create() in component',()=>{
    spyOn(component, 'create')
    component.loading=false;
    fixture.detectChanges()
    const updateButtonEL = fixture.debugElement.query(By.css('#createCustomer'));
    expect(updateButtonEL).not.toBeNull()
    updateButtonEL.triggerEventHandler('click', null);
    expect(component.create).toHaveBeenCalled()
  })
  it('cancel button should call gotoView() in component',()=>{
    spyOn(component, 'gotoView')
    component.loading=false;
    fixture.detectChanges()
    const cancelButtonEL = fixture.debugElement.query(By.css('#cancelCreate'));
    expect(cancelButtonEL).not.toBeNull()
    //expect(cancelButtonEL.nativeElement.value).toBe('Cancel')
    cancelButtonEL.triggerEventHandler('click', null);
    expect(component.gotoView).toHaveBeenCalled()
  })
});
function TestInvalidCustomerForm(component: CustomerFormComponent) {
  component.houseNo.setValue('');
  component.lastName.setValue('');
  component.name.setValue('');
  component.phone.setValue('');
  component.street.setValue('');
  expect(component.customerForm.valid).toBeFalsy();
}

function TestValidCustomerForm(component: CustomerFormComponent) {
  component.houseNo.setValue(MockCustomer[0].houseNumber);
  component.lastName.setValue(MockCustomer[0].lastName);
  component.name.setValue(MockCustomer[0].name);
  component.phone.setValue(MockCustomer[0].phone);
  component.street.setValue(MockCustomer[0].street);
  expect(component.customerForm.valid).toBeTruthy();
}

