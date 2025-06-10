// This file renders the user's order history page, handles "Buy Again" actions, and package tracking

import { cart } from './checkout/oderSummary.js'; // Cart instance
import { getProduct, products, loadProductsFetch } from '../data/products.js';
import formatCurrency from './utils/money.js';
import { updateCartQuantity } from './utils/cart-util.js';

console.log('Loaded products:', products);

// Retrieve orders from localStorage or fallback to empty array
export const orderData = JSON.parse(localStorage.getItem('orders')) || [];

// Cart quantity displayed after placing an order
const afterOrderPlcaedCartQuantity = localStorage.getItem('cart-quantity-after-order-placed') || 0;

// Wait for DOM to load and fetch product data
document.addEventListener("DOMContentLoaded", () => {
  loadProductsFetch(loadOrdersPage);
});

// Renders the order list UI
function loadOrdersPage() {
  let productsHTML = '';

  orderData.forEach((order) => {
    const totalPriceCents = order.totalCents || 0;

    productsHTML += `
      <div class="order-container js-order-container">
        <div class="order-header">
          <div class="order-header-left-section js-order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderTime ? new Date(order.orderTime).toLocaleDateString() : ''}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total Price:</div>
              <div>${formatCurrency(totalPriceCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${order.products.map(product => `
            <div class="product-image-container">
              <img src="${product.productImage || ''}">
            </div>
            <div class="product-details">
              <div class="product-name">${product.productName || ''}</div>
              <div class="product-delivery-date">
                Arriving on:${product.arrivingOn}
              </div>
              <div class="product-quantity">Quantity: ${product.quantity}</div>
              <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.id || product.productId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
                <span class="buy-again-success">✓ Added</span>
              </button>
            </div>
            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary js-track-package-button" data-product='${JSON.stringify(product)}'>
                  Track package
                </button>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  // Render all orders or fallback message
  document.querySelector('.js-order-grid').innerHTML = productsHTML;
  document.querySelector('.js-cart-quantity').textContent = afterOrderPlcaedCartQuantity;

  if (orderData.length === 0) {
    document.querySelector('.js-order-grid').innerHTML = '<p>No orders found.</p>';
  }

  // Handle "Buy Again" button clicks
  document.querySelectorAll('.js-buy-again-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const product = products.find(p => String(p.id) === String(productId));
      if (product) {
        cart.addToCart(productId, 1);
        cart.saveToStorage();
        updateCartQuantity(cart);

        // Show confirmation on button
        button.classList.add('added');
        setTimeout(() => {
          button.classList.remove('added');
        }, 4000);
      } else {
        alert('Product not found.');
      }
    });
  });

  // Handle package tracking
  document.querySelectorAll('.js-track-package-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productData = button.dataset.product;
      localStorage.setItem('tracking-product', productData);
      window.location.href = 'tracking.html';
    });
  });
}