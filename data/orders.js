/*📦 Orders Module
  Handles order data by storing and retrieving it from localStorage.
*/

// Loads existing orders from localStorage or initializes an empty array.
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

// Adds a new order to the beginning of the orders array and saves it.
export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

// Saves the current orders array to localStorage.
function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}