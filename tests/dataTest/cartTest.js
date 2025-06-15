import { Cart } from '../../data/cart.js';

describe('Cart Class', () => {
  let cart;
  const mockStorage = {};

  beforeEach(() => {
    // Initialize mock localStorage
    mockStorage['test-cart'] = '[]';
    spyOn(localStorage, 'getItem').and.callFake(key => mockStorage[key]);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      mockStorage[key] = value;
    });

    cart = new Cart('test-cart');
  });

  it('should add a new item to the cart', () => {
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    expect(cart.cartItems.length).toBe(1);
    expect(cart.cartItems[0]).toEqual(jasmine.objectContaining({
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 1,
      deliveryOptionId: '1'
    }));
  });

  it('should increase quantity if same item added again', () => {
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 2);
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 3);
    expect(cart.cartItems.length).toBe(1);
    expect(cart.cartItems[0].quantity).toBe(5);
  });

  it('should remove item from the cart', () => {
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 2);
    cart.removeFromCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart.cartItems.length).toBe(0);
  });

  it('should update delivery option for an item', () => {
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 2);
    cart.updateDeliveryOption('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', '3');
    expect(cart.cartItems[0].deliveryOptionId).toBe('3');
  });

  it('should calculate total cart quantity', () => {
    // (setItem is already spied in beforeEach)
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 2);
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 3);
    cart.getCartQuantity();
    expect(localStorage.setItem)
      .toHaveBeenCalledWith('cart-quantity-after-order-placed', 5);
  });

  it('should clear the cart', () => {
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6', 1);
    cart.clearCart();
    expect(cart.cartItems.length).toBe(0);
  });
});
