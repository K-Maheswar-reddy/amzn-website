/*🛒 Cart Class
 This file defines a Cart class that handles adding, removing, updating, and storing shopping cart data in localStorage.
*/
export class Cart {
  cartItems;
  #localStorageKey;

  // Initializes the cart with data from localStorage
  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  // Loads cart data from localStorage
  #loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) ?? [];
  }
  
  // Saves cart data to localStorage
  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
    this.#loadFromStorage();
  }

  // Adds or updates an item in the cart
  addToCart(productId, selectedQuantity) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    if (matchingItem) {
      matchingItem.quantity += selectedQuantity;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: selectedQuantity,
        deliveryOptionId: '1'
      });
    }

    this.saveToStorage();
  }

  // Removes an item from the cart
  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });

    this.cartItems = newCart;
    this.saveToStorage();
  }

  // Updates delivery option for a specific item
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }

  // Returns total quantity of items in the cart
  getCartQuantity() {
    let totalQuantity = 0;
    this.cartItems.forEach((item) => {
      totalQuantity += item.quantity;
    });

    localStorage.setItem('cart-quantity-after-order-placed', totalQuantity);
  }

  // Clears all items from the cart
  clearCart() {
    this.cartItems = [];
    this.saveToStorage();
  }
}