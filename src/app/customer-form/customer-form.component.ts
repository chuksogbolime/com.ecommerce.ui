import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ResponseDescription } from '../enums/response-descriptions';
import { Customer } from '../models/customer';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  constructor(private router:Router, private customerService:CustomerService, private snackBar:MatSnackBar) { }
  customerForm:FormGroup=new FormGroup({});
  name = new FormControl();
  lastName = new FormControl();
  houseNo = new FormControl();
  street = new FormControl();
  phone = new FormControl();
  loading=false

  gotoView(){
    this.router.navigate(['customer/view'])
  }

  InitForm(){
    this.name = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.houseNo = new FormControl('', Validators.required);
    this.street = new FormControl('', Validators.required);
    this.phone = new FormControl('', Validators.required);
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
  create(){
    if(this.customerForm.valid){
      this.loading=true
      let customer = new Customer(
        this.name.value, this.lastName.value,this.street.value,this.houseNo.value,this.phone.value,0
      )
      this.customerService.create(customer).subscribe(response=>{
        this.loading=false
        //console.log('called customerService')
        if(response.status==201){
          let customers = response.body==null ? null :response.body
          //console.log(this.customers)
          this.loading=false;
          this.gotoView()
        }
        else{
          //show snack bar
          this.loading=false;
          this.openSnackBar(`Status: ${response.status}, ${response.statusText}`)
        }
      },(err)=>{
        this.loading=false;
        this.openSnackBar(`${ResponseDescription.FailedResponse}`)
      })
    }
    
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Ok", {
      duration: 5000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: ["failure-snackbar"],
    });
  }

  ngOnInit(): void {
    this.initFormGroup()
  }

}
