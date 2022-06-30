import Cart from './cart';

let cart;
const product = {
  title: 'CD do Mamonas Assasinas',
  price: 35588,
};

const product2 = {
  title: 'CD do Raça Negra',
  price: 11111,
};

beforeEach(() => {
  cart = new Cart();
});

describe('getTotal()', () => {
  it('should return 0 when getTotal() is executed in a newly created instance', () => {
    expect(cart.getTotal().getAmount()).toBe(0);
  });

  it('should multiply quantity and price and receive the total amount', () => {
    const item = {
      product: {
        title: 'CD do Mamonas Assasinas',
        price: 35588,
      },
      quantity: 2,
    };

    cart.add(item);
    expect(cart.getTotal().getAmount()).toBe(71176);
  });

  it('should ensure no more then one product exists at a time', () => {
    cart.add({
      product,
      quantity: 2,
    });

    cart.add({
      product,
      quantity: 1,
    });

    expect(cart.getTotal().getAmount()).toBe(35588);
  });

  it('should update total when a product gets included and them remove', () => {
    cart.add({
      product,
      quantity: 1,
    });

    expect(cart.getTotal().getAmount()).toBe(35588);

    cart.add({
      product: product2,
      quantity: 1,
    });

    expect(cart.getTotal().getAmount()).toBe(46699);

    cart.remove(product2);

    expect(cart.getTotal().getAmount()).toBe(35588);
  });
});

describe('checkout()', () => {
  it('should return an object with the total and the list of items', () => {
    cart.add({
      product,
      quantity: 1,
    });

    cart.add({
      product: product2,
      quantity: 1,
    });

    expect(cart.sumary()).toMatchSnapshot();
    expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
  });

  it('should reset the cart when checkout() is called', () => {
    cart.add({
      product,
      quantity: 1,
    });

    cart.checkout();

    expect(cart.getTotal().getAmount()).toEqual(0);
  });
});

describe('special conditions', () => {
  it('should apply percentage discount quantity above minimum is passed ', () => {
    const condition = {
      percentage: 30,
      minimum: 2,
    };

    cart.add({
      product,
      condition,
      quantity: 3,
    });

    expect(cart.getTotal().getAmount()).toEqual(74735);
  });

  it('should not apply percentage discount quantity when is less or equal minimum', () => {
    const condition = {
      percentage: 30,
      minimum: 2,
    };

    cart.add({
      product,
      condition,
      quantity: 2,
    });

    expect(cart.getTotal().getAmount()).toEqual(71176);
  });

  it('should apply percentage discount quantity for even quantities', () => {
    const condition = {
      quantity: 2,
    };

    cart.add({
      product,
      condition,
      quantity: 3,
    });

    expect(cart.getTotal().getAmount()).toEqual(53382);
  });

  it('should receve two or more conditions and apply best discont, first case', () => {
    const condition = {
      quantity: 2,
    };
    const condition2 = {
      percentage: 30,
      minimum: 2,
    };

    cart.add({
      product,
      condition:[condition,condition2],
      quantity: 3,
    });

    expect(cart.getTotal().getAmount()).toEqual(53382);
  });
});
