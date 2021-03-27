import { GlobalConstants } from './global-constants';

describe('GlobalConstants', () => {

  it('should create an instance', () => {
    expect(new GlobalConstants()).toBeTruthy();
  });

  it('site title should be Ecommerce App', () => {
    let actual = GlobalConstants.siteTitle;
    expect(actual).toBe("Ecommerce App")
  });

  it('base api route for customer should be http://localhost:8080/api/customer', ()=>{
    let actual = GlobalConstants.customerBaseAPIUrl;
    expect(actual).toBe("http://localhost:8080/api/customer")
  })

  it('customer delete confirmation message should be Are you sure you want to delete this customer?', ()=>{
    let actual = GlobalConstants.customerDeleteConfirmationMessage;
    expect(actual).toBe("Are you sure you want to delete this customer?")
  })

});
