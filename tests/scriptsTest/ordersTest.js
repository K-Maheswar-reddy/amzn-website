import { loadOrdersPage, orderData } from "../../scripts/orders.js";
import { Cart } from "../../data/cart.js";
import { products } from "../../data/products.js";

describe('orders page', () => {
    
    const cart = new Cart('cart-oop');

    beforeEach(() => {
        // set up DOM
        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-grid"></div>
            <div class="js-cart-quantity"></div>
        `;

        // Mock the product data used in orderData
        products.length = 0;
        products.push(
            {
                id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                name: 'jeans',
                getPrice: () => '₹20.00',
                getStarsUrl: function () {
                    return `images/ratings/rating-rating-10.png`;
                },
                rating: { stars: 5.0, count: 20},
                extraInfoHTML: () =>{
                    return ''
                }
            },
            {
                id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                name: 'T-shirt',
                getPrice: () => '₹40.00',
                getStarsUrl: function () {
                    return `images/ratings/rating-rating-20.png`; 
                },
                rating: { stars: 4.5, count: 127},
                extraInfoHTML: () => {
                    return '<a href="image/clothing-size-chart.png" target="_blank">sizeChartLink</a>'
                }
            }
        )

        // mock local storage orders
        localStorage.setItem('orders', JSON.stringify([
            {
                id: '1',
                orderTime: Date.now(),
                totalCents: 1999,
                products: [
                    {
                        id:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                        productName: 'T-shirt',
                        quantity: 2,
                        arrivingOn: '2025-06-16'
                    }
                ]
            },
            {
                id: '2',
                orderTime: Date.now(),
                totalCents: 1999,
                products: [
                    {
                        id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
                        productName: 'shirt',
                        quantity: 2,
                        arrivingOn: '2025-06-17'
                    }
                ]
            }
        ]));

        // also mock the cart quantity
        localStorage.setItem('cart-quantity-after-order-placed', '2');
        loadOrdersPage();
    });

    it('should render order data with product info', () => {
        const orderGrid = document.querySelector('.js-order-grid');
        expect(orderGrid.innerHTML).toContain('order-date');
        expect(orderGrid.innerHTML).toContain('Quantity: 3');
        expect(orderGrid.innerHTML).toContain('Buy it again');
        expect(document.querySelector('.js-cart-quantity').textContent).toBe('2');
    })

    it('should add poduct to cart when buy it again clicked', () => {
        const buyAgainBtn = document.querySelector('.js-buy-again-button');
        buyAgainBtn.click();

        expect(cart.cartItems.length).toBe(1) //or 
        expect(cart.cartItems.length).toBeGreaterThan(0)
    })

    it('should store product data in localstorage on track package clicked', () => {
        const trackBtn = document.querySelector('.js-track-package-button');
        
        trackBtn.click();

        const stored = JSON.parse(localStorage.getItem('tracking-product'));
        expect(stored.productName).toBe('T-shirt');  
    })

    it('should render arriving date correctly', ()=> {
        const orderGrid = document.querySelector('.product-delivery-date');
        expect(orderGrid.innerHTML).toContain("Arriving on:2025-06-16");
    })
})