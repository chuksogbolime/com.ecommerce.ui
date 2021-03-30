import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AngularMaterialModule } from "../angular-material/angular-material.module";
import { UtilityService } from "./util";


describe('UtiltiyService', () => {
    let snackBarSpy = {open: jasmine.createSpy('open')};
    let service: UtilityService;
    let snackBar:MatSnackBar

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports:[ AngularMaterialModule, 
              ],
            providers:[
              { provide: MatSnackBar, useValue: snackBarSpy },
              
      
            ],
            schemas:[]
          })
          .compileComponents();
          service = TestBed.inject(UtilityService);
          snackBar=TestBed.inject(MatSnackBar)
    })

    it('should create an instance', () => {
        expect(service).toBeTruthy();
    });
    it('openSnackBar() should call snack bar open method',()=>{
        //spyOn(snackBar, 'open')
        service.openSnackBar('open snack bar')
        expect(snackBar.open).toHaveBeenCalled() 
    })
})