import { ActivatedRouteStub } from './activated-route-stub';

describe('ActivatedRouteStub', () => {
  it('should create an instance', () => {
    expect(new ActivatedRouteStub({id:1})).toBeTruthy();
  });
});
