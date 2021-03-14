import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalConstants } from '../constants/global-constants';

import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  let component: AppHeaderComponent;
  let fixture: ComponentFixture<AppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title from global constant`, () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const app = fixture.componentInstance;
    //let e = new EventEmitter().emit("Ecommerce App")
    expect(app.title).toEqual(GlobalConstants.siteTitle);
  });




});
