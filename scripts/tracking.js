// This file handles displaying tracking information for a specific product after an order is placed.

export const orderData = JSON.parse(localStorage.getItem('orderData')) || [];

// Get cart quantity after order placement (for header icon update)
const afterOrderPlcaedCartQuantity = localStorage.getItem('cart-quantity-after-order-placed') || 0;

// Retrieve tracking product details from localStorage
const trackingProduct = JSON.parse(localStorage.getItem('tracking-product') || '{}');

// Render tracking progress and product info
function trackingOrders() {
  let trackerHTML = '';

  // Show tracking UI only if product data is available
  if (trackingProduct && trackingProduct.productName) {
    trackerHTML += 
    `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving On ${trackingProduct.arrivingOn}
    </div>

    <div class="product-info">
      ${trackingProduct.productName}
    </div>

    <div class="product-info">
      Quantity: ${trackingProduct.quantity}
    </div>

    <img class="product-image" src="${trackingProduct.productImage}">

    <div class="progress-labels-container">
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" id="progressBar"></div>
    </div>
    `;
  } else {
    trackerHTML = `<div>No product selected for tracking.</div>`;
  }

  // Inject tracking UI
  document.querySelector('.js-order-tracking').innerHTML = trackerHTML;
  document.querySelector('.js-cart-quantity').textContent = afterOrderPlcaedCartQuantity;

  // Animate progress bar after short delay
  setTimeout(() => {
    const progressBar = document.getElementById('progressBar');
    if (trackingProduct && trackingProduct.arrivingOn && progressBar) {
      const orderDate = new Date();
      orderDate.setHours(0, 0, 0, 0);

      const deliveryDate = new Date(trackingProduct.arrivingOn);
      deliveryDate.setHours(0, 0, 0, 0);

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const totalDays = Math.max(1, (deliveryDate - orderDate) / (1000 * 60 * 60 * 24));
      const daysPassed = Math.max(0, (now - orderDate) / (1000 * 60 * 60 * 24));

      // Set progress bar percentage
      let percent = 10; // Minimum progress for 'Preparing'
      if (now >= deliveryDate) {
        percent = 100;
      } else if (daysPassed > 0) {
        const progressPerDay = 90 / totalDays;
        percent = 10 + (progressPerDay * daysPassed);
        percent = Math.min(33, Math.round(percent)); // Max 33% until "Shipped"
      }

      progressBar.style.width = percent + '%';
    }
  }, 100); // Delay ensures CSS transition runs
}

// Initialize tracking logic after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  trackingOrders();
});