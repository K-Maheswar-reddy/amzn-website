import { updateCartQuantity } from "../../scripts/utils/cart-util.js";

describe('updateCartQuantity', () => {
  let cart;

  beforeEach(() => {
    const quantityDiv = document.createElement('div');

    quantityDiv.className = 'js-cart-quantity';
    document.body.appendChild(quantityDiv);

    // Fake cart object
    cart = {
      cartItems: [
        { id: '1', quantity: 2 },
        { id: '2', quantity: 3 }
      ]
    };
  });

  afterEach(() => {
    document.querySelector('.js-cart-quantity').remove();
  })

  it('updates the DOM with correct total cart quantity', () => {
    updateCartQuantity(cart);

    const quantityText = document.querySelector('.js-cart-quantity').innerHTML;

    expect(quantityText).toBe('5');
  });
});
