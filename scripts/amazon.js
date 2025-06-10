/* This file handles product rendering, displaying them in a grid layout,
  and managing "Add to Cart" interactions using the Cart class and product data.
*/

import { Cart } from '../data/cart.js';
import { products, loadProductsFetch } from "../data/products.js";
import { updateCartQuantity } from "./utils/cart-util.js";

// Create a new Cart instance using localStorage key 'cart-oop'
const cart = new Cart('cart-oop');

// Fetch products and render them once loaded
loadProductsFetch(renderProductsGrid);

// Renders the product grid on the page
export function renderProductsGrid() {
  let productsHTML = '';

  // Generate HTML for each product
  products.forEach((product) => {
    productsHTML += `
    <div class="product-container js-product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="js-product-quantity">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
    `;
  });

  // Inject the generated HTML into the DOM
  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  // Utility function to display the "Added" message briefly
  function diplayAddedMessageInSec(addedMessage) {
    if (addedMessage) {
      addedMessage.classList.add('visible');
      setTimeout(() => {
        addedMessage.classList.remove('visible');
      }, 2000);
    }
  }

  // Attach click listeners to all "Add to Cart" buttons
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const productContainer = button.closest('.js-product-container');
      const quantitySelect = productContainer.querySelector('.js-product-quantity');
      const selectedQuantity = parseInt(quantitySelect.value);

      cart.addToCart(productId, selectedQuantity);
      updateCartQuantity(cart);
      cart.saveToStorage();

      const addedMessage = productContainer.querySelector('.js-added-to-cart');
      diplayAddedMessageInSec(addedMessage);
    });
  });

  // Set the cart quantity and redirect to checkout on click
  document.querySelector('.js-cart-quantity').textContent = cart.cartItems.length;
  document.querySelector('.js-cart-quantity').addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
}
