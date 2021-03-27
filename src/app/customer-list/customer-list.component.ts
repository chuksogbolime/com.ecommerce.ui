import { ChangeDetectorRef, Component, OnInit ,AfterViewInit,ViewChild} from '@angular/core';
import { Customer, MockCustomer } from '../models/customer';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ResponseDescription } from '../enums/response-descriptions';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { GlobalConstants } from '../constants/global-constants';



@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, AfterViewInit {

  customers:Customer[]=[];
  loading: boolean =false;

  displayedColumns: string[] = ['Name', 'Last Name', 'Street', 'House Number','Phone', 'Edit','Delete'];
  dataSource: MatTableDataSource<Customer> = new MatTableDataSource();
  
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl, ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort;

  constructor(private router:Router, private customerService:CustomerService,private snackBar: MatSnackBar,
    private dialog :MatDialog) { 
 
  }

  gotoCreate(){
    this.router.navigate(['customer/create'])
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //applyFilter(event: Event) {
    applyFilter(filterValue: string) {
    //const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    //console.log(this.dataSource.filter)
    /*if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      
    }*/
  }
  getCustomers(){
    //console.log('called get customers')
    this.loading=true
    this.customerService.get().subscribe(response=>{
      this.loading=false
      //console.log('called customerService')
      if(response.status==200 || response.status==204){
        this.customers = response.body==null ? [] :response.body
        //console.log(this.customers)
        this.dataSource = new MatTableDataSource(this.customers);
      }
      else{
        //show snack bar
        this.openSnackBar(response.statusText)
        this.customers=[]
        this.dataSource = new MatTableDataSource(this.customers);
      }
    },(err)=>{
      this.loading=false;
      this.openSnackBar(`${ResponseDescription.FailedResponse}`)
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

  confirmDelete() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false

    });
    
    dialogRef.componentInstance.confirmMessage = GlobalConstants.customerDeleteConfirmationMessage
    //console.log(dialogRef)
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        //console.log(result)
        // do confirmation actions
        
        //console.log(dialogRef)
        //console.log('Deleted')
      }
      //dialogRef = null;
    });
  }

  ngOnInit(): void {
    //this.customers = MockCustomer;
    this.getCustomers()
    
    //console.log(this.customers)
  }

}
