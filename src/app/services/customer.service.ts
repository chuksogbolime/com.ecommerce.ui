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

  delete(id:number):Observable<HttpResponse<any>>{
    let url = `${GlobalConstants.customerBaseAPIUrl}/${id}`;
    return this.http.delete<Customer>(url,{observe: 'response' })
  }

  getById(id:Number):Observable<HttpResponse<Customer>>{
    let url = `${GlobalConstants.customerBaseAPIUrl}/${id}`;
    return this.http.get<Customer>(url,{observe: 'response' })
  }

  update(customer:Customer):Observable<HttpResponse<any>>{
    let url = `${GlobalConstants.customerBaseAPIUrl}/${customer.id}`;
    return this.http.put<any>(url,customer, {observe: 'response' })
  }

}
