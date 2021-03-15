import {  NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

class MatIconStub{
  open(){
    return {
      onAction: () => of({})
    }
  }

}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatToolbarModule
      ],
      declarations: [
        AppHeaderComponent,
        HomeComponent,
        AppComponent
        
        
      ],
      providers:[
        {provide: MatIcon, useClass: MatIconStub}, 
        MatToolbar
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
