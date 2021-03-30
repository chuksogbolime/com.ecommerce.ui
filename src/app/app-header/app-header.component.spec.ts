import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { GlobalConstants } from '../constants/global-constants';

import { AppHeaderComponent } from './app-header.component';

class MatIconStub{
  open(){
    return {
      onAction: () => of({})
    }
  }

}


describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppHeaderComponent ],
      imports:[AngularMaterialModule,
      RouterTestingModule],
      providers:[
        {provide: MatIcon, useClass: MatIconStub},
         MatToolbar
      ],
      schemas:[ CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title from global constant`, () => {
    
    const app = fixture.componentInstance;
    expect(app.title).toEqual(GlobalConstants.siteTitle);
  });




});
