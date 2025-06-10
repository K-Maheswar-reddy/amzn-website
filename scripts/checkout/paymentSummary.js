/* Handles the rendering and processing of the payment summary,
  calculates order totals, tax, and shipping, and places the order by 
  sending a POST request to the backend. On success, saves order locally 
  and redirects to the orders page.
*/

import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import {formatCurrency} from "../utils/money.js"
import { addOrder } from "../../data/orders.js";
import { cart } from "./oderSummary.js";

let totalCents = 0;

export function renderPaymentSummary() {
  let productPricCents = 0;
  let shippingPriceCents = 0;
  let totalItemsInCart = 0;

  // Keeps track of unique delivery options to avoid double-counting shipping
  const countedDeliveryIds = new Set();

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    totalItemsInCart += cartItem.quantity;
    productPricCents += product.priceCents * cartItem.quantity;

    if (!countedDeliveryIds.has(cartItem.deliveryOptionId)) {
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      shippingPriceCents += deliveryOption.priceCents;
      countedDeliveryIds.add(cartItem.deliveryOptionId);
    }
  });

  const totalBeforeTaxCents = productPricCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  console.log('Total cents:', formatCurrency(totalCents));

  const paymentSummaryHTML = `
  <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalItemsInCart}):</div>
      <div class="payment-summary-money">${formatCurrency(productPricCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  // Handle order placement
  document.querySelector('.js-place-order')
  .addEventListener('click', async () => {
    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          cart: cart.cartItems
        })
      });
      
      const order = await response.json();

      // Attach product and delivery info to each cart item in the order
      order.products = cart.cartItems.map(cartItem => {
        const productDetails = getProduct(cartItem.productId);
        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

        return {
          ...cartItem,
          productImage: productDetails ? productDetails.image : '',
          productName: productDetails ? productDetails.name : '',
          priceCents: productDetails ? productDetails.priceCents : 0,
          arrivingOn: cartItem.arrivingOn
        };
      });

      // Handle backend error
      if (order.errorMessage) {
        console.error('Failed to place order:', order.errorMessage);
        alert('Order failed: ' + order.errorMessage);
        return;
      }
      
      // Store total and save order locally
      order.totalCents = totalCents;
      console.log(order.totalCents);
      addOrder(order);
      console.log('Order being saved:', order);

      // Redirect to orders page
      window.location.href = 'orders.html';
    }
    catch (error) {
      console.log('Unexpected error. Try again later.');
    }

    // Clear cart data from localStorage after order
    localStorage.removeItem('cart-oop');
  });

  const placeOrderButton = document.querySelector('.js-place-order');
  
  // Disable place order button if cart is empty
  if (cart.cartItems.length === 0) {
    placeOrderButton.classList.remove('button-primary');
    placeOrderButton.classList.add('button-secondary-place-order-disabled');
    placeOrderButton.disabled = true;
    placeOrderButton.style.opacity = '0.5';
    placeOrderButton.style.cusor = 'not-allowed';
    placeOrderButton.style.pointerEvents = 'none';
  } 
}