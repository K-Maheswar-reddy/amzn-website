import {formatCurrency} from "../../scripts/utils/money.js"

// we use describe for test suite = what kind of tests we are doing
describe('test suite: formatCurrency', () => {
  it('converts cents into dollars', () => {
    // let us compare a value with another value
    expect(formatCurrency(2095)).toEqual('\u20B91749');
  });

  it('works with 0', () => {
    expect(formatCurrency(0)).toEqual('\u20B90');
  });

  it('rounds up to the nearest cent', () => {
    expect(formatCurrency(2000.5)).toEqual('\u20B91670');
  });

  it('rounds to closet value of cent', () => {
    expect(formatCurrency(2000.4)).toEqual('\u20B91670');
  });
});