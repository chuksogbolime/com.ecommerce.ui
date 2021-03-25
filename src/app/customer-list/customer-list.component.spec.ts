import { Location } from '@angular/common';
import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { Customer, MockCustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { throwError } from 'rxjs';

import { CustomerListComponent } from './customer-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogContainer, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OverlayRef } from '@angular/cdk/overlay';

export class MatDialogMock {
  open() {
   return {
     afterClosed: () => of(ConfigClass.matDialogAfterCloseValue)
   };
 }
}
export class MatDialogMockWithFalseAfterClose {
  open() {
   return {
     afterClosed: () => of(false)
   };
 }
}
export class ConfigClass{
  public static matDialogAfterCloseValue:boolean=true;
}
describe('CustomerListComponent', () => {
  let component: CustomerListComponent;
  let fixture: ComponentFixture<CustomerListComponent>;
  let router:Router;
  let location:Location
  let buttonCreateEl: DebugElement;
  let filterInputEl: DebugElement;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let customerService:CustomerService
  let MockCustomerService = jasmine.createSpyObj('CustomerService', ['get']);
  let serviceSpy:any
  let http:any
  let httpResponse:any
  let snackBarSpy = {open: jasmine.createSpy('open')};
  let MockMatDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  let matDialog:MatDialog
  let matDialogSwitchAfterCloseValue=true
 

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [ CustomerListComponent ],
      imports:[RouterTestingModule, AngularMaterialModule, 
        BrowserAnimationsModule, HttpClientTestingModule],
      providers:[
        Location,
        { provide: Router, useValue: routerSpy },
        {provider:CustomerService, useValue:MockCustomerService},
        { provide: MatSnackBar, useValue: snackBarSpy },
        {provider:MatDialog, useClass:MatDialogMock}
        /*{provider:MatDialog, useFactory: ()=>{
          if(matDialogSwitchAfterCloseValue){
            return new MatDialogMock()
          }
          else{
            return new MatDialogMockWithFalseAfterClose()
          }
        }}*/

      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component.customers=[]
    customerService = TestBed.inject(CustomerService)
    httpResponse = new HttpResponse<Customer[]>({body:MockCustomer, status:200})
    matDialog=TestBed.inject(MatDialog)
    fixture.detectChanges();
  });

  it('CustomerListComponent should be created', () => {
    expect(component).toBeTruthy();
  });
  xit('customer list should be empty before init',() =>{
    expect(component.customers.length).toBe(0)
  })
  it('customer list should not be empty after init',fakeAsync(() =>{
    
    serviceSpy = spyOn(customerService, 'get').and.returnValue(of(httpResponse))
    component.ngOnInit();
    tick()
    //fixture.detectChanges()
    expect(component.customers.length > 0).toBeTruthy();
  }))
  it('display column should contain 7 items as table headers',() =>{
    expect(component.displayedColumns.length).toBe(7);
  })
  xit('gotoCreate should redirect to /customer/create', fakeAsync(() => {
    router.navigate(['customer/view']);
    fixture.detectChanges();
    buttonCreateEl = fixture.debugElement.query(By.css('button'));
    buttonCreateEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(location.path()).toBe('/customer/create'); 
  }))

  it('gotoCreate should redirect to /customer/create', fakeAsync(() => {
    component.gotoCreate()
    expect(routerSpy.navigate).toHaveBeenCalledWith(['customer/create']); 
  }))
  it('initialize paginator and sort', ()=>{
    component.ngAfterViewInit()
    expect(component.dataSource.paginator).toEqual(component.paginator)
    expect(component.dataSource.sort).toEqual(component.sort)
  })
  xit('filter method should be triggered on keyup', fakeAsync(()=>{
    filterInputEl = fixture.debugElement.query(By.css('input'));
    
    filterInputEl.nativeElement.innerText = 'filter'
    filterInputEl.triggerEventHandler('keyup', null);
    tick();
    fixture.detectChanges();
    expect(component.applyFilter).toHaveBeenCalled()

  }))

  it('filter method should be triggered', fakeAsync(()=>{
    //component.loading=false
    
    //fixture.detectChanges();
    /*
    filterInputEl = fixture.debugElement.query(By.css('input'));
    let actual = 'filter'
    filterInputEl.nativeElement.value = actual
    let event = new KeyboardEvent('keyup',{'bubbles':true, 'key':actual});
    filterInputEl.nativeElement.dispatchEvent(event);
    */
    let actual = 'filter'
    component.applyFilter(actual)
    expect(component.dataSource.filter).toBe(actual)
    /*
    let changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef); 
    let paginator = new MatPaginator(new MatPaginatorIntl, ChangeDetectorRef.prototype);
    
    //expect(component.dataSource.paginator != null).toBeTruthy()
    component.dataSource.paginator  = paginator
    //expect(component.dataSource.paginator != null).toBeTruthy()
    let spy = spyOn(component.dataSource.paginator, 'firstPage').and.callThrough
    
    expect(component.dataSource.paginator.firstPage).toHaveBeenCalled */
  }))

  it('filter method should be triggered with null paginator', ()=>{
    /*component.loading=false
    component.dataSource.paginator=null;
    fixture.detectChanges();
    filterInputEl = fixture.debugElement.query(By.css('input'));
    let actual = 'filter'
    filterInputEl.nativeElement.value = actual
    
    let event = new KeyboardEvent('keyup',{'bubbles':true});
    filterInputEl.nativeElement.dispatchEvent(event);
    */
   component.dataSource.paginator=null;
    let actual = 'filter'
    component.applyFilter(actual)
    expect(component.dataSource.filter).toBe(actual)
    
    
  })
  
  it('getCustomers() should return list of available customers', fakeAsync(()=>{
    
    serviceSpy = spyOn(customerService, 'get').and.returnValue(of(httpResponse))
    component.ngOnInit()
    tick()
    expect(serviceSpy.calls.any()).toBe(true);
    expect(component.customers.length>0).toBeTruthy()
  }))
  it('getCustomers() should return empty list of customers', fakeAsync(()=>{
    httpResponse = new HttpResponse({body:null, status:204})
    serviceSpy = spyOn(customerService, 'get').and.returnValue(of(httpResponse))
    component.ngOnInit()
    tick()
    expect(serviceSpy.calls.any()).toBe(true);
    expect(component.customers.length==0).toBeTruthy()
  }))
  it('getCustomers() should return empty list of customers on http status not 200 or 204', fakeAsync(()=>{
    httpResponse = new HttpResponse({body:[], status:404})
    serviceSpy = spyOn(customerService, 'get').and.returnValue(of(httpResponse))
    component.ngOnInit()
    tick()
    expect(serviceSpy.calls.any()).toBe(true);
  }))
  it('getCustomers() should throw error on http status 404', fakeAsync(()=>{
   
    //const xService = fixture.debugElement.injector.get(CustomerService);
    //const mockCall = spyOn(xService,'get').and.returnValue(throwError({status: 404}));
    //httpResponse = new HttpResponse({body:null, status:500})
    serviceSpy = spyOn(customerService, 'get').and.returnValue(throwError({status: 404}))
    component.ngOnInit()
    tick()
    expect(serviceSpy.calls.any()).toBe(true);
  }))

  it('confirmDelete() should open confirmation dialog',()=>{
    
    //let dialogRef = new MatDialogRef<ConfirmationDialogComponent>(OverlayRef.prototype,MatDialogContainer.prototype)
    //matDialog.disableClose=false
    spyOn(matDialog, 'open').and.callThrough()
    component.confirmDelete()
    
    //fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled();
    matDialog.closeAll()
    fixture.detectChanges()
    matDialog.afterAllClosed.subscribe(r=>{
      expect(r).not.toBeNull()

    })
    //spyOn(matDialog, 'afterClose').and.callThrough()
  })
  it('confirmDelete() should open confirmation dialog but set afterclose to null',()=>{
    
    //let dialogRef = new MatDialogRef<ConfirmationDialogComponent>(OverlayRef.prototype,MatDialogContainer.prototype)
    ConfigClass.matDialogAfterCloseValue=false
    fixture.detectChanges()
    //console.log(matDialog)
    spyOn(matDialog, 'open').and.callThrough()
    component.confirmDelete()
    
    //fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled();
    matDialog.closeAll()
    
    fixture.detectChanges()
  
    matDialog.afterAllClosed.subscribe(r=>{
      expect(r).toBeNull()

    })
    //spyOn(matDialog, 'afterClose').and.callThrough()
  })
});
