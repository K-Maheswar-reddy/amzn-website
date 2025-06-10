// Initializes the checkout page: loads products, renders cart and payment summary

import { renderOrderSummary, updateCheckoutHeaderQuantity } from "./checkout/oderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProductsFetch } from "../data/products.js";

// Load product data and render checkout sections
async function loadPage() {
  try {
    await loadProductsFetch(() => {});
  } catch (error) {
    console.log(error);
    console.log('Unexpected error. Please try again later.');
  }

  renderOrderSummary();
  updateCheckoutHeaderQuantity();
  renderPaymentSummary();
}

loadPage();