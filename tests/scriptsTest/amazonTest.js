import { renderProductsGrid } from "../../scripts/amazon.js";
import { Cart } from "../../data/cart.js";
import { products } from "../../data/products.js";

describe('render products grid', () => {

    const cart = new Cart('cart-oop');

    beforeEach(() => {

        // set up DOM
        document.querySelector('.js-test-container').innerHTML = `
        <div class="js-products-grid"></div>
        <div class="js-cart-quantity"></div>
        `;

        // mock products data
        products.length = 0;
        products.push(
            {
                id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                name: 'jeans',
                priceCents: 1999,
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
                priceCents: 2999,
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

        renderProductsGrid();
    })

    it('procuts grid displaying', () => {
        expect(document.querySelector('.js-product-container').textContent).toContain('jeans')
        expect(document.querySelector('.product-quantity-container').textContent).toContain('1');
    })

    it('displaying cart details', () =>{
        expect(document.querySelector('.js-add-to-cart').textContent).toContain('Add to Cart');
        expect(document.querySelector('.js-added-to-cart').textContent).toContain('Added');
    });
    it('adds products to cart and update cart quantity', () => {
        const addToCartBtn = document.querySelector('.js-add-to-cart');
    
        expect(cart.cartItems.length).toBe(1);
        expect(document.querySelector('.js-cart-quantity').textContent).toBe('1');
        addToCartBtn.click();
    })

    it('displays extra info HTML if present', () => {
        expect(document.querySelector('.js-products-grid').innerHTML).toContain('sizeChartLink');
    });

})