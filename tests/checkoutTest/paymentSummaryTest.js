import { renderPaymentSummary } from "../../scripts/checkout/paymentSummary.js";
import { cart } from "../../scripts/checkout/oderSummary.js";
import { products } from "../../data/products.js";
import formatCurrency from "../../scripts/utils/money.js";

describe('render payment summary', () => {

    beforeEach(() =>{
        // set up DOM
        document.querySelector('.js-test-container').innerHTML = `
        <div class="js-payment-summary"></div>
        `;

        // Mock cart Data
        cart.cartItems = [
            {
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                quantity: 2,
                deliveryOptionId: '1'
            },
            {
                productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                quantity: 1,
                deliveryOptionId: '2'
            }
        ]

        // Mock product data
        products.length = 0;
        products.push(
        {
            id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            name: 'T-shirt',
            priceCents: 1000
        },
        {
            id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            name: 'shirt',
            priceCents: 2000
        }
    )

    renderPaymentSummary();
    })
    it('displays order sumamry with correct values', () => {
        expect(document.querySelector('.payment-summary-title').textContent).toContain('Order Summary');

        const rows = document.querySelectorAll('.payment-summary-row');
        expect(rows[0].textContent).toContain('Items (3)');
        expect(rows[1].textContent).toContain('Shipping');
        expect(rows[4].textContent).toContain('Order total');
        expect(document.querySelector('.payment-summary-money').textContent).toEqual(formatCurrency(4000));
    })

    it('show place order button', () => {
        const button = document.querySelector('.js-place-order');
        expect(button.textContent).toContain('Place your order');
    })

    it('make place order button clickable', () => {
        document.querySelector('.js-place-order').click();
    })

    it('disables button if cart is empty', () => {
        cart.cartItems = [];
        renderPaymentSummary();
        expect(document.querySelector('.js-place-order').disabled).toBeTrue();
    })
})