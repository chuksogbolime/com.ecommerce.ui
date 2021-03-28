import { Component, OnInit } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Customer, EmptyCustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UtilityService } from '../shared/util';
import { ResponseDescription } from '../enums/response-descriptions';

@Component({
  selector: 'app-customer-form-edit',
  templateUrl: './customer-form-edit.component.html',
  styleUrls: ['./customer-form-edit.component.css']
})
export class CustomerFormEditComponent implements OnInit {

  constructor(private router:Router, private activedRoute:ActivatedRoute, private customerService:CustomerService,
    private snackBar:MatSnackBar) { }

  public customerId:number=-1
  loading:boolean=false
  customer = EmptyCustomer

  getCustomerById(id:Number){
    this.loading=true
    this.customerService.getById(id).subscribe(response=>{
      this.loading=false
      //console.log('called customerService')
      if(response.status==200){
        this.customer = response.body==null ? EmptyCustomer :response.body
        //console.log(this.customer)
      }
      else{
        //show message; customer with :id could not be found or has been deleted
        
      }
    },(err)=>{
      this.loading=false;
      this.openSnackBar(`${ResponseDescription.FailedResponse}`)
      //go back to view page here
    })
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["failure-snackbar"],
    });
  }

  ngOnInit() {
    
    this.activedRoute.paramMap.pipe(
      switchMap((params: ParamMap) =>
        of(params.get('id'))
      )
    ).subscribe((d) => {
      this.customerId=Number(d)
      this.getCustomerById(this.customerId)
    });
  }

}
