import { addOrder, orders } from '../../data/orders.js';

describe('addOrder function', () => {
  const mockOrder = {
    id: 'order123',
    totalCents: 2500,
    products: []
  };

  beforeEach(() => {
    // Reset orders array and mock localStorage
    orders.length = 0;
    spyOn(localStorage, 'setItem');
  });

  it('should add the order to the beginning of the orders array and save it', () => {
    addOrder(mockOrder);

    // Check if order is added
    expect(orders[0]).toEqual(mockOrder);
    expect(orders.length).toBe(1);

    // Check if localStorage is updated
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'orders',
      JSON.stringify([mockOrder])
    );
  });
});
