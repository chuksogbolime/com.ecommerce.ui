import { Location } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync, inject, TestBed, tick } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Route, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AngularMaterialModule } from "./angular-material/angular-material.module";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { routes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CustomerFormComponent } from "./customer-form/customer-form.component";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { CustomerComponent } from "./customer/customer.component";
import { HomeComponent } from "./home/home.component";


describe('Router: App', () => {

    let location: Location;
    let router: Router;
    let fixture;
    

    beforeEach(() => {
        
        TestBed.configureTestingModule({
          imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule,AngularMaterialModule],
          declarations: [
            HomeComponent,
            AppHeaderComponent,
            CustomerListComponent,
            CustomerComponent,
            CustomerFormComponent,
            AppComponent
          ],
          providers:[
            Location, AngularMaterialModule,
            MatSnackBar
          ],
          schemas:[CUSTOM_ELEMENTS_SCHEMA]
        });
    
        router = TestBed.inject(Router);
        //location = TestBed.get(Location);
        location = TestBed.inject(Location);
    
        fixture = TestBed.createComponent(AppComponent);
        router.initialNavigation();
    });

    it('navigate to "" redirects you to /home', fakeAsync(() => { 
        router.navigate(['']);
        tick()
        expect(location.path()).toBe('/home'); 
      }));
      it('navigate to "/home" redirects you to /home', fakeAsync(() => { 
        router.navigate(['home']);
        tick()
        expect(location.path()).toBe('/home'); 
      }));
      it('navigate to "/customer" redirects you to /customer/view', fakeAsync(() => { 
        router.navigate(['customer']);
        tick()
        expect(location.path()).toBe('/customer/view'); 
      }));

      it('navigate to "/create" redirects you to /customer/create', fakeAsync(() => { 
        router.navigate(['customer/create']);
        tick()
        expect(location.path()).toBe('/customer/create'); 
      }));

      it('navigate to "/view" redirects you to /customer/view', fakeAsync(() => { 
        router.navigate(['customer/view']);
        tick()
        expect(location.path()).toBe('/customer/view'); 
      }));

      it('navigate to "/edit" redirects you to /customer/edit/id', fakeAsync(() => { 
        router.navigate(['customer/edit/1']);
        tick()
        expect(location.path()).toBe('/customer/edit/1'); 
      }));

      xit('non existing routes should redirects you to /home', fakeAsync(() => { 
        router.navigate(['abcd']);
        tick()
        expect(location.path()).toBe('/home'); 
      }));
      

})