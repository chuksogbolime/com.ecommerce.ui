import { Component, OnInit } from '@angular/core';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Customer, EmptyCustomer } from '../models/customer';
import { CustomerService } from '../services/customer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { UtilityService } from '../shared/util';
import { ResponseDescription } from '../enums/response-descriptions';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-form-edit',
  templateUrl: './customer-form-edit.component.html',
  styleUrls: ['./customer-form-edit.component.css']
})
export class CustomerFormEditComponent implements OnInit {

  constructor(private router:Router, private activedRoute:ActivatedRoute, private customerService:CustomerService,
    private snackBar:MatSnackBar) { }

  public customerId:number=0
  loading:boolean=false
  customer = EmptyCustomer
  name = new FormControl();
  lastName = new FormControl();
  houseNo = new FormControl();
  street = new FormControl();
  phone = new FormControl();
  customerForm:FormGroup=new FormGroup({});

  getCustomerById(id:Number){
    this.loading=true
    this.customerService.getById(id).subscribe(response=>{
      this.loading=false
      //console.log('called customerService')
      if(response.status==200){
        this.customer = response.body==null ? EmptyCustomer :response.body
        //console.log(this.customer)
        this.initFormGroup()
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
  update(){
    if(this.customerForm.valid){
      this.loading=true
      let updatedCustomer = new Customer(
        this.name.value, this.lastName.value,this.street.value,this.houseNo.value,this.phone.value,this.customer.id
      )
      
      this.customerService.update(updatedCustomer).subscribe(response=>{
        this.loading=false
        if(response.status==204){
          this.openSnackBar(response.statusText)
          this.gotoView()
        }
        else{
          //show message; customer with :id could not be found or has been deleted
          this.openSnackBar(response.statusText)
        }
      },(err)=>{
        this.loading=false;
        this.openSnackBar(`${ResponseDescription.FailedResponse}`)
        //go back to view page here
      })
    }
    else{
      this.openSnackBar(`${ResponseDescription.InvalidForm}`)
    }
  }
  gotoView(){
    this.router.navigate(['/customer/view'])
  }
  InitForm(){
    this.name = new FormControl(this.customer.name, Validators.required);
    this.lastName = new FormControl(this.customer.lastName, Validators.required);
    this.houseNo = new FormControl(this.customer.houseNumber, Validators.required);
    this.street = new FormControl(this.customer.street, Validators.required);
    this.phone = new FormControl(this.customer.phone, Validators.required);
  }

  initFormGroup(){
    this.InitForm()
    this.customerForm= new FormGroup({
      name:this.name, 
      lastName : this.lastName,
      houseNo : this.houseNo,
      street : this.street,
      phone : this.phone

    })
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
