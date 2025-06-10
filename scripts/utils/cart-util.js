/*Updates and displays the total quantity of items in the cart 
 by summing all quantities in the cartItems array.
*/

export function updateCartQuantity(cart) {
  let cartQuantity = 0;

  // Calculate total quantity of items in cart
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // Update cart quantity on the page
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}