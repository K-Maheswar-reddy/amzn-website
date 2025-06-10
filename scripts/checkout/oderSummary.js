/*This file renders the cart summary view for an e-commerce site,
 handles delivery option selections, quantity updates, deletions,
  and stores order data to localStorage.
*/

import { Cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export const cart = new Cart('cart-oop');
export let orderData = []; // Stores user’s current order details

function getFormattedDeliveryDate(daysToAdd) {
  return dayjs().add(daysToAdd, 'days').format('dddd MMMM D');
}

export function renderOrderSummary() {
  orderData = [];
  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');

    let existingOrder = orderData.find(order => order.productId === productId);

    if (!existingOrder) {
      existingOrder = {
        orderId: crypto.randomUUID(),
        productId: productId,
        productName: matchingProduct.name,
        productImage: matchingProduct.image,
        quantity: cartItem.quantity,
        orderDate: today.format('MMM D, YYYY'),
        arrivingOn: deliveryDate.format('MMM D, YYYY'),
        itemPrice: matchingProduct.priceCents
      };
      orderData.push(existingOrder);
    } else {
      existingOrder.quantity = cartItem.quantity;
      existingOrder.totalPrice = totalCents;
      existingOrder.arrivingOn = deliveryDate.format('MMM D, YYYY');
    }

    localStorage.setItem('orderData', JSON.stringify(orderData));

    const dateString = deliveryDate.format('dddd MMMM D');

    cartSummaryHTML +=
    `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${matchingProduct.getPrice()}
          </div>
          <div class=" js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label" id="quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link 
            js-delete-link-${matchingProduct.id}" 
            data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
          <div class="quantity-update-container js-update-container-${matchingProduct.id}" style="display: none; margin-top: 8px;">
            <button class="js-decrease-button" data-product-id="${matchingProduct.id}">−</button>
            <span class="js-new-quantity" id="quantity-display-${matchingProduct.id}">${cartItem.quantity}</span>
            <button class="js-increase-button" data-product-id="${matchingProduct.id}">+</button>
            <button class="js-save-quantity-button" data-product-id="${matchingProduct.id}">Save</button>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const dateString = getFormattedDeliveryDate(deliveryOption.deliveryDays);
      cart.saveToStorage();
      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html +=
      `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>
      `;
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Delete cart item
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      renderPaymentSummary();
    });
  });

  // Show quantity update UI
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      document.querySelector(`.js-update-container-${productId}`).style.display = 'block';
    });
  });

  // Increase quantity
  document.querySelectorAll('.js-increase-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantitySpan = document.getElementById(`quantity-display-${productId}`);
      let quantity = parseInt(quantitySpan.innerText);
      quantity++;
      quantitySpan.innerText = quantity;
    });
  });

  // Decrease quantity (minimum 1)
  document.querySelectorAll('.js-decrease-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const quantitySpan = document.getElementById(`quantity-display-${productId}`);
      let quantity = parseInt(quantitySpan.innerText);
      if (quantity > 1) {
        quantity--;
        quantitySpan.innerText = quantity;
      }
    });
  });

  // Save quantity and update cart
  document.querySelectorAll('.js-save-quantity-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const newQuantity = document.getElementById(`quantity-display-${productId}`).innerHTML;
      const label = document.querySelector(`#quantity-label-${productId}`);
      if (label) {
        label.innerText = newQuantity;
      }
      const cartItem = cart.cartItems.find(item => item.productId === productId);
      cartItem.quantity = parseInt(newQuantity);
      cart.saveToStorage();
      renderPaymentSummary();
      updateCheckoutHeaderQuantity();
    });
  });

  // Update delivery option
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);

      const cartItem = cart.cartItems.find(item => item.productId === productId);
      const deliveryOption = getDeliveryOption(deliveryOptionId);
      if (cartItem && deliveryOption) {
        const deliveryDate = dayjs().add(deliveryOption.deliveryDays, 'days');
        cartItem.arrivingOn = deliveryDate.format('MMM D, YYYY');
      }

      renderOrderSummary();
      renderPaymentSummary();
      updateCheckoutHeaderQuantity();
    });
  });
}

// Set default delivery date for items with no selection
cart.cartItems.forEach((cartItem) => {
  if (!cartItem.arrivingOn) {
    const freeShippingOption = getDeliveryOption('1');
    if (freeShippingOption) {
      const deliveryDate = dayjs().add(freeShippingOption.deliveryDays, 'days');
      cartItem.arrivingOn = deliveryDate.format('MMM D, YYYY');
    }
  }
});
cart.saveToStorage();

export function updateCheckoutHeaderQuantity() {
  let totalQuantity = 0;
  cart.cartItems.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  const countElement = document.querySelector('.js-checkout-count');
  if (countElement) {
    countElement.innerText = `${totalQuantity} items`;
  }

  if (cart.cartItems.length === 0) {
    document.querySelector('.js-order-summary').innerHTML = `
    <div class="payment-summary-title">Your cart is empty</div>
    <a class="button-primary view-products-link" href="index.html" data-testid="view-products-link">
      View Products
    </a>
    `;
  }
}
