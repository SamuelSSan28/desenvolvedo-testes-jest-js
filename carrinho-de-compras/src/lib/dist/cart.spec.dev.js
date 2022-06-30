"use strict";

var _cart = _interopRequireDefault(require("./cart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cart;
var product = {
  title: 'CD do Mamonas Assasinas',
  price: 35588
};
var product2 = {
  title: 'CD do Raça Negra',
  price: 11111
};
beforeEach(function () {
  cart = new _cart["default"]();
});
describe('getTotal()', function () {
  it('should return 0 when getTotal() is executed in a newly created instance', function () {
    expect(cart.getTotal().getAmount()).toBe(0);
  });
  it('should multiply quantity and price and receive the total amount', function () {
    var item = {
      product: {
        title: 'CD do Mamonas Assasinas',
        price: 35588
      },
      quantity: 2
    };
    cart.add(item);
    expect(cart.getTotal().getAmount()).toBe(71176);
  });
  it('should ensure no more then one product exists at a time', function () {
    cart.add({
      product: product,
      quantity: 2
    });
    cart.add({
      product: product,
      quantity: 1
    });
    expect(cart.getTotal().getAmount()).toBe(35588);
  });
  it('should update total when a product gets included and them remove', function () {
    cart.add({
      product: product,
      quantity: 1
    });
    expect(cart.getTotal().getAmount()).toBe(35588);
    cart.add({
      product: product2,
      quantity: 1
    });
    expect(cart.getTotal().getAmount()).toBe(46699);
    cart.remove(product2);
    expect(cart.getTotal().getAmount()).toBe(35588);
  });
});
describe('checkout()', function () {
  it('should return an object with the total and the list of items', function () {
    cart.add({
      product: product,
      quantity: 1
    });
    cart.add({
      product: product2,
      quantity: 1
    });
    expect(cart.sumary()).toMatchSnapshot();
    expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
  });
  it('should reset the cart when checkout() is called', function () {
    cart.add({
      product: product,
      quantity: 1
    });
    cart.checkout();
    expect(cart.getTotal().getAmount()).toEqual(0);
  });
});
describe('special conditions', function () {
  it('should apply percentage discount quantity above minimum is passed ', function () {
    var condition = {
      percentage: 30,
      minimum: 2
    };
    cart.add({
      product: product,
      condition: condition,
      quantity: 3
    });
    expect(cart.getTotal().getAmount()).toEqual(74735);
  });
  it('should not apply percentage discount quantity when is less or equal minimum', function () {
    var condition = {
      percentage: 30,
      minimum: 2
    };
    cart.add({
      product: product,
      condition: condition,
      quantity: 2
    });
    expect(cart.getTotal().getAmount()).toEqual(71176);
  });
  it('should apply percentage discount quantity for even quantities', function () {
    var condition = {
      quantity: 2
    };
    cart.add({
      product: product,
      condition: condition,
      quantity: 3
    });
    expect(cart.getTotal().getAmount()).toEqual(53382);
  });
  it('should receve two or more conditions and apply best discont, first case', function () {
    var condition = {
      quantity: 2
    };
    var condition2 = {
      percentage: 30,
      minimum: 2
    };
    cart.add({
      product: product,
      condition: [condition, condition2],
      quantity: 3
    });
    expect(cart.getTotal().getAmount()).toEqual(53382);
  });
});