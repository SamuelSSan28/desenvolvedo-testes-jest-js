import { find, remove } from 'lodash';
import Dinero from 'dinero.js';

const Money = Dinero;
Money.defaultCurrenc = 'BRL';
Money.defaultPrecision = 2;

export default class Cart {
  itens = [];

  add(item) {
    const itemToFind = { product: item.product };

    if (find(this.itens, itemToFind)) {
      remove(this.itens, itemToFind);
    }

    this.itens.push(item);
  }

  remove(product) {
    remove(this.itens, { product });
  }

  calculatePercentageDiscount(amount, item) {
    if (item.condition?.percentage && item.quantity > item.condition.minimum) {
      return amount.percentage(item.condition.percentage);
    }
    return Money({ amount: 0 });
  }

  calculateQuantityDiscount(amount, item) {
    if (item.condition?.quantity && item.quantity > item.condition.quantity) {
      return amount.percentage(50);
    }
    return Money({ amount: 0 });
  }

  calculateDiscount(amount, quantity, condition) {
    const list = Array.isArray(condition) ? condition : [condition];
    const [higherDiscount] = list
      .map((cond) => {
        if (cond.percentage) {
          return this.calculatePercentageDiscount(amount, {
            quantity,
            condition:cond,
          }).getAmount();
        } else if (cond.quantity) {
          return this.calculateQuantityDiscount(amount, {
            quantity,
            condition:cond,
          }).getAmount();
        }
      })
      .sort((a, b) => b-a);
      
      return  Money({amount:higherDiscount})
  }

  getTotal() {
    return this.itens.reduce((acc, item) => {
      const amount = Money({ amount: item.quantity * item.product.price });
      let discount = Money({ amount: 0 });

      if (item.condition) {
        discount = this.calculateDiscount(
          amount,
          item.quantity,
          item.condition
        );
      }
      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }

  sumary() {
    const total = this.getTotal().getAmount();
    const itens = this.itens;

    return {
      total,
      itens,
    };
  }

  checkout() {
    const { total, itens } = this.sumary();

    this.itens = [];

    return {
      total,
      itens,
    };
  }
}
