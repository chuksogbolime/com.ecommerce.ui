import { GlobalConstants } from './global-constants';

describe('GlobalConstants', () => {

  it('should create an instance', () => {
    expect(new GlobalConstants()).toBeTruthy();
  });

  it('site title should be Ecommerce App', () => {
    let actual = GlobalConstants.siteTitle;
    expect(actual).toBe("Ecommerce App")
  });

});
