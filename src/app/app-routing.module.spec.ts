import { Location } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { fakeAsync, inject, TestBed, tick } from "@angular/core/testing";
import { MatIcon } from "@angular/material/icon";
import { Route, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { routes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";


describe('Router: App', () => {

    let location: Location;
    let router: Router;
    let fixture;
    

    beforeEach(() => {
        
        TestBed.configureTestingModule({
          imports: [RouterTestingModule.withRoutes(routes)],
          declarations: [
            HomeComponent,
            AppHeaderComponent,
            AppComponent
          ],
          providers:[
            Location, MatIcon
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

      xit('non existing routes should redirects you to /home', fakeAsync(() => { 
        router.navigate(['abcd']);
        tick()
        expect(location.path()).toBe('/home'); 
      }));
      

})