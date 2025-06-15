# 🛒 Amazon Website Clone

This is a simplified Amazon-like shopping site built using **HTML, CSS, and JavaScript**. It includes product listings, cart functionality, order tracking, and a mock checkout experience.

---

## 📁 Project Structure

amzn-website-main/
│
├── data/ # Product, cart, and delivery option data (JS)
├── images/ # All product and UI images
├── scripts/ # Core app functionality
│ ├── checkout/ # Checkout page logic
│ └── utils/ # Utility scripts (e.g., formatCurrency)
│
├── styles/ # CSS files
│ ├── pages/ # Page-specific CSS
│ └── shared/ # Shared styles
│
├── tests/ # Jasmine test suites
│ ├── checkoutTest/
│ ├── dataTest/
│ ├── scriptsTest/
│ ├── utilsTest/
│ └── tests.html # Entry point to run all tests
│
├── index.html # Homepage
├── checkout.html # Checkout page
├── orders.html # Orders overview
├── tracking.html # Order tracking
└── MIT.LICENSE # License file



---

## 🚀 How to Run the Project

1. Open the folder in VS Code.
2. Right-click `index.html` and choose **"Open with Live Server"**, or open in browser manually.
3. Navigate to other pages like `checkout.html`, `orders.html`, etc.

---

## 🧪 How to Run Tests

1. Open `tests/tests.html` in a browser.
2. You'll see Jasmine test results for:
   - Cart logic
   - Product data
   - Checkout scripts
   - Utility functions

---

## 📷 Using Images

All images are inside the `images/` folder. Example usage:

```html
<img src="../images/product1.jpg" alt="Product Image">
