import { Injectable } from '@angular/core';
import { convertToParamMap, ParamMap, Params, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ActivatedRouteStub {
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams: {}) {
    this.setParamMap(initialParams);
  }

  readonly paramMap = this.subject.asObservable();

  setParamMap(params: {}) {
    this.subject.next(convertToParamMap(params));
  }
}