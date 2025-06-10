/*🛒 Product Module
  Handles product data, classes, fetching from backend, and utilities like price formatting.
*/

import { formatCurrency } from '../scripts/utils/money.js';

export let products = [];

// Returns the product matching the given ID.
export function getProduct(productId) {
  const matchingProduct = products.find(product => product.id === productId);
  if (!matchingProduct) console.warn(`Product with ID ${productId} not found.`);
  return matchingProduct;
}

// Product class representing general product data.
class Product {
  id;
  image;
  name;
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML() {
    return ``;
  }
}

// Clothing class extending Product, includes size chart link.
class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
    super.extraInfoHTML();
    return `
    <a href="${this.sizeChartLink}" target="_blank">Size chart</a>
    `;
  }
}

// Fetches products from backend and loads them into global array.
export function loadProductsFetch(fun) {
  const promise = fetch('https://supersimplebackend.dev/products')
    .then((response) => response.json())
    .then((productsData) => {
      products = productsData.map((productDetails) => {
        if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
        } else {
          return new Product(productDetails);
        }
      });
      fun();
    })
    .catch((error) => {
      console.error('Fetch failed:', error);
      console.log('Unexpected error. Please try again later.');
    });

  return promise;
}