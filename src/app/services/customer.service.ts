import { HttpClient, HttpResponse, JsonpClientBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../constants/global-constants';
import { Customer } from '../models/customer';
//import 'rxjs/add/operator/map'

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  get():Observable<HttpResponse<Customer[]>>{
    let url = GlobalConstants.customerBaseAPIUrl;
    return this.http.get<Customer[]>(url,{ observe: 'response' });
  
  }
  create(customer:Customer):Observable<HttpResponse<Customer>>{
    let url = GlobalConstants.customerBaseAPIUrl;
    return this.http.post<Customer>(url, customer,{observe: 'response' })
  }

}
