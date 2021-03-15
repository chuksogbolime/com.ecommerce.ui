import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { GlobalConstants } from '../constants/global-constants';

import { HomeComponent } from './home.component';

class MatIconStub{
  open(){
    return {
      onAction: () => of({})
    }
  }

}
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent, AppHeaderComponent ],
      imports:[MatIconModule],
      providers:[
        {provide: MatIcon, useClass: MatIconStub},
      ],
      schemas:[NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(`should have as title from global constant`, () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.componentInstance;
    //let e = new EventEmitter().emit("Ecommerce App")
    expect(app.title).toEqual(GlobalConstants.siteTitle);
  });
});
