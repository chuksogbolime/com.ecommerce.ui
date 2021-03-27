import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Injector } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { Customer, MockCustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import { throwError } from 'rxjs';

import { CustomerListComponent } from './customer-list.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export class MatDialogMock {
  open() {
   return {
     //afterClosed: () => of(ConfigClass.matDialogAfterCloseValue)
     afterClosed: () => of(true)
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
  public static matDialogAfterCloseValue:boolean=false;
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
  let httpResponse:any
  let snackBarSpy = {open: jasmine.createSpy('open')};
  let matDialog:MatDialog
  let matDialogSwitchAfterCloseValue=true
 

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [ CustomerListComponent, ConfirmationDialogComponent ],
      imports:[RouterTestingModule, AngularMaterialModule, 
        BrowserAnimationsModule, HttpClientTestingModule],
      providers:[
        Location,
        { provide: Router, useValue: routerSpy },
        {provider:CustomerService, useValue:MockCustomerService},
        { provide: MatSnackBar, useValue: snackBarSpy },
        //{provider:MatDialog, useClass:MatDialogMock}
        {provider:MatDialog, useFactory: ()=>{
          if(matDialogSwitchAfterCloseValue){
            return new MatDialogMock()
          }
          else{
            return new MatDialogMockWithFalseAfterClose()
          }
        }}

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

  xit('confirmDelete() should open confirmation dialog',()=>{
    
    //let dialogRef = new MatDialogRef<ConfirmationDialogComponent>(OverlayRef.prototype,MatDialogContainer.prototype)
    //matDialog.disableClose=false
    spyOn(matDialog, 'open')//.and.callThrough()
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


  
  it('confirmDelete() should open confirmation dialog',()=>{
    let dialogSpy: jasmine.Spy;
    let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of({}), close: null });
    dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.confirmDelete()

    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(ConfirmationDialogComponent,{ disableClose: false });

    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  })

  it('confirmDelete() should open confirmation dialog with afterclose to be false',()=>{
    let dialogSpy: jasmine.Spy;
    let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed : of(false), close: null });
    dialogRefSpyObj.componentInstance = { body: '' }; // attach componentInstance to the spy object...
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.confirmDelete()

    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(ConfirmationDialogComponent,{ disableClose: false });

    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  })

  xit('confirmDelete() should open confirmation dialog',()=>{
    
    /*
    serviceSpy = spyOn(customerService, 'get').and.returnValue(of(httpResponse))
    component.ngOnInit()
    tick()
    fixture.detectChanges()
    expect(component.customers.length>0).toBeTruthy()
    */
   matDialog = TestBed.inject(MatDialog)
    spyOn(matDialog, 'open').and.callThrough
    
    //const deleteButtonEL = fixture.debugElement.query(By.css('#deleteCustomer'));
    //expect(deleteButtonEL).not.toBeNull()
    //deleteButtonEL.triggerEventHandler('click', null);

    component.confirmDelete()
    //tick()
    fixture.detectChanges()
    //expect(matDialog.open).toHaveBeenCalled();


    //matDialog.closeAll()
    //fixture.detectChanges()
    //matDialog.afterAllClosed.subscribe(r=>{
      //expect(r).not.toBeNull()
      
    //})
    
    //fixture.detectChanges()
    //const closeDialogButtonEL = fixture.debugElement.query(By.css('#dialogClose'));
    //closeDialogButtonEL.triggerEventHandler('click', null);
    //fixture.detectChanges()
    /*const i = Injector.create([{provide: MatDialog, useClass: MatDialogMockWithFalseAfterClose}]);
    matDialog=TestBed.inject(MatDialog)
    deleteButtonEL.triggerEventHandler('click', null);
    expect(matDialog.open).toHaveBeenCalled();*/
    
    
  })
  xit('confirmDelete() should open confirmation dialog but set afterclose to be false',()=>{
    
    //let dialogRef = new MatDialogRef<ConfirmationDialogComponent>(OverlayRef.prototype,MatDialogContainer.prototype)
    //const i = Injector.create([{provide: MatDialog, useClass: MatDialogMockWithFalseAfterClose}]);
    //matDialog=TestBed.inject(MatDialog)

    //fixture.detectChanges()
    spyOn(matDialog, 'open')//.and.callThrough
    component.confirmDelete()
    
    //fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled();
    //matDialog.closeAll()
    
    //fixture.detectChanges()
  
    /*matDialog.afterAllClosed.subscribe(r=>{
      expect(r).toBeNull()

    })*/
    //spyOn(matDialog, 'afterClose').and.callThrough()
  })
});
