
import {renderOrderSummary, updateCheckoutHeaderQuantity, cart} from '../../scripts/checkout/oderSummary.js'
import { Cart } from '../../data/cart.js'
import { getProduct, loadProductsFetch, products } from '../../data/products.js'

describe('render order summary', () =>{

  const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
  const productId2 = '15b6fc6f-327a-4ec4-896f-486349e85a3d';

  beforeEach(() => {
    products.length = 0;
    products.push({
      id:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      name: 'shirt',
      priceCents: 1000,
      getPrice: () => '₹10.00'
    },
    {
      id:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
      name: 'shirt-t',
      priceCents: 2000,
      getPrice: () => '₹20.00'
    })
    
    document.querySelector('.js-test-container').innerHTML = 
    `
    <div class="js-order-summary"></div>
    <div class="js-payment-summary"></div>
    `;

    // creating mock
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: '1'
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: '2'
        }
      ]);
    });

    spyOn(localStorage, 'setItem');
    cart.loadCart();

    renderOrderSummary();
  });

  it('displays the cart', () => {
    const items = document.querySelectorAll('.js-cart-item-container');
    expect(items.length).toBe(2);

    expect(document.querySelector(`.js-product-quantity-${productId1}`).textContent).toContain('Quantity: 2');
    expect(document.querySelector(`.js-product-quantity-${productId1}`).textContent).toContain('Delete');
    expect(document.querySelector(`.js-product-quantity-${productId2}`).textContent).toContain('Update');
  })

  it('removes product from cart', () =>{
    document.querySelector(`.js-delete-link-${productId1}`).click();
    expect(document.querySelectorAll(`.js-cart-item-container`).length).toBe(1);

    expect(products[0].name).toBe('shirt');
    expect(products[0].priceCents).toBe(1000);
    expect(products[0].id).toEqual(productId1);
  })

  it('+ and - button is displayed', () => {
    expect(document.querySelector(`.js-update-container-${productId1}`).textContent).toContain('−');
    expect(document.querySelector(`.js-update-container-${productId1}`).textContent).toContain('2');
    expect(document.querySelector(`.js-update-container-${productId1}`).textContent).toContain('+');
    expect(document.querySelector(`.js-update-container-${productId1}`).textContent).toContain('Save');
  }) 

  it('delivery option date', () => {
    // expect(document.querySelector(`.js-delivery-option-${productId1}`))
    const deliveryOptionEl = document.querySelector(`.js-delivery-option[data-product-id="${productId1}"][data-delivery-option-id="1"]`);

    const input = document.querySelector(`input.delivery-option-input`);
    expect(input.checked).toBeTrue();
    expect(deliveryOptionEl.textContent).toContain('Shipping');
    expect(deliveryOptionEl.textContent).toContain('Sunday June 22');
  })
})