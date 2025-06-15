describe('Tracking orders page', () => {
  let trackingOrders;

  beforeEach(async () => {
    // Setup DOM before importing the file
    const container = document.querySelector('.js-test-container');
    container.innerHTML = `
      <div class="js-order-tracking"></div>
      <div class="js-cart-quantity"></div>
    `;

    // Mock localStorage
    localStorage.setItem('tracking-product', JSON.stringify({
      productName: 'shirt',
      quantity: 2,
      arrivingOn: '2025-06-17',
    }));

    localStorage.setItem('cart-quantity-after-order-placed', '3');

    // Dynamically import the script after DOM is ready
    const module = await import('../../scripts/tracking.js');
    trackingOrders = module.trackingOrders;

    // Now call it safely
    trackingOrders();
  });

  it('should render product tracking information if data exists', () => {
    const trackingContainer = document.querySelector('.js-order-tracking');
    expect(trackingContainer.innerHTML).toContain('Arriving On 2025-06-17');
    expect(trackingContainer.innerHTML).toContain('shirt');
    expect(trackingContainer.innerHTML).toContain('Quantity: 2');

    const cartQuantity = document.querySelector('.js-cart-quantity');
    expect(cartQuantity.textContent).toBe('3');
  });
});
