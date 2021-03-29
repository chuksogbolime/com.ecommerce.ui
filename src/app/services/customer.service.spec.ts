import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


import { CustomerService } from './customer.service';
import { Customer, EmptyCustomer, MockCustomer } from '../models/customer';
import { GlobalConstants } from '../constants/global-constants';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpTestingController:HttpTestingController
  let httpClient:HttpClient

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CustomerService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get(), should get list of customers', ()=>{
    const testData: Customer[] = MockCustomer

    service.get().subscribe((response) => {
        expect(response.status).toBe(200);
        let responseBody = response.body==null?[]:response.body;
        expect(testData).toEqual(responseBody );
      
      });

      const req = httpTestingController.expectOne(GlobalConstants.customerBaseAPIUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
      //httpTestingController.verify();
  })
  it('get(), should return no content', ()=>{
    const testData: Customer[] = []

    service.get().subscribe((response) => {
      expect(response.status).toBe(204)
      let responseBody = response.body==null?[]:response.body;
      expect(testData).toEqual(responseBody );
      
      });

      const req = httpTestingController.expectOne(GlobalConstants.customerBaseAPIUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(testData, { status: 204, statusText: 'Not Content' });
      //httpTestingController.verify();
  })

  xit('get(), should return 404 for wrong url', ()=>{
    const emsg = 'deliberate 404 error';

    service.get().subscribe((response) => {
      fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(emsg, 'message');
      }
      
      });

      const req = httpTestingController.expectOne(GlobalConstants.customerBaseAPIUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(emsg, { status: 404, statusText: 'Not Found' });
  })

  it('create() should return status code 201 and response body of created customer', ()=>{
    let testCustomer=MockCustomer[0]
    service.create(testCustomer).subscribe((response) => {
      expect(response.status).toBe(201)
      let responseBody = response.body==null?null:response.body;
      expect(responseBody).not.toBeNull()
      expect(responseBody?.name).toBe(testCustomer.name)
      
      });

      const req = httpTestingController.expectOne(GlobalConstants.customerBaseAPIUrl);
      
      expect(req.request.method).toEqual('POST');
      req.flush(testCustomer, { status: 201, statusText: 'Created' });
  })
  xit('create() should return status code 400 and response body should be null', ()=>{
    let testCustomer=MockCustomer[0]
    service.create(testCustomer).subscribe((response) => {
      expect(response.status).toBe(400)
      let responseBody = response.body==null?null:response.body;
      expect(responseBody).toBeNull()
      
      });

      const req = httpTestingController.expectOne(GlobalConstants.customerBaseAPIUrl);
      
      expect(req.request.method).toEqual('POST');
      req.flush(null, { status: 400, statusText: 'Bad Request' });
  })

  it('delete() should retuen status code 200 and an empty response body', ()=>{
    let id=1;
    service.delete(id).subscribe((response) => {
      expect(response.status).toBe(200)
      let responseBody = response.body==null?null:response.body;
      expect(responseBody).toBeNull()
      
      });

      const req = httpTestingController.expectOne(`${GlobalConstants.customerBaseAPIUrl}/${id}`);
      
      expect(req.request.method).toEqual('DELETE');
      req.flush(null, { status: 200, statusText: 'Ok' });
  })

  it('delete() should retuen status code 204 and an empty response body', ()=>{
    let id=1;
    service.delete(id).subscribe((response) => {
      expect(response.status).toBe(204)
      let responseBody = response.body==null?null:response.body;
      expect(responseBody).toBeNull()
      
      });

      const req = httpTestingController.expectOne(`${GlobalConstants.customerBaseAPIUrl}/${id}`);
      
      expect(req.request.method).toEqual('DELETE');
      req.flush(null, { status: 204, statusText: 'Not Found' });
  })

  it('getById(), should return 200 with a customer object as body', ()=>{
    const testData: Customer = MockCustomer[0]
    
    service.getById(testData.id).subscribe((response) => {
        expect(response.status).toBe(200);
        let responseBody = response.body == null ? null : response.body;
        expect(responseBody).toEqual(testData );
      
      });

      const req = httpTestingController.expectOne(`${GlobalConstants.customerBaseAPIUrl}/${testData.id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(testData,{ status: 200, statusText: 'Found' });
      //httpTestingController.verify();
  })
  it('getById() should retuen status code 204 and an empty response body', ()=>{
    let id=1;
    service.getById(id).subscribe((response) => {
      expect(response.status).toBe(204)
      let responseBody = response.body==null?null:response.body;
      expect(responseBody).toBeNull()
      
      });

      const req = httpTestingController.expectOne(`${GlobalConstants.customerBaseAPIUrl}/${id}`);
      
      expect(req.request.method).toEqual('GET');
      req.flush(null, { status: 204, statusText: 'Not Found' });
  })

  it('update() should return status code 204 and response body is null', ()=>{
    let testCustomer=MockCustomer[0]
    service.update(testCustomer).subscribe((response) => {
      expect(response.status).toBe(204)
      let responseBody = response.body==null?null:response.body;
      expect(responseBody).toBeNull()
      
      });

      const req = httpTestingController.expectOne(`${GlobalConstants.customerBaseAPIUrl}/${testCustomer.id}`);
      
      expect(req.request.method).toEqual('PUT');
      req.flush(null, { status: 204, statusText: 'No Content' });
  })
  xit('update() should return status code 400 and response body is null', ()=>{
    let testCustomer=EmptyCustomer
    testCustomer.id =1
    service.update(testCustomer).subscribe((response) => {
      expect(response.status).toBe(304)
      let responseBody = response.body==null?null:response.body;
      expect(responseBody).toBeNull()
      
      });

      const req = httpTestingController.expectOne(`${GlobalConstants.customerBaseAPIUrl}/${testCustomer.id}`);
      
      expect(req.request.method).toEqual('PUT');
      req.flush(null, { status: 304, statusText: 'Bad Request' });
  })
});
