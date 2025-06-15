import { loadProductsFetch, products, getProduct } from "../../data/products.js";

describe('loadProductsFetch', () => {
    const mockProductsData = [
        {
            id: '1',
            name: 'shirt',
            priceCents: 2999,
            type: 'clothing'
        },
        {
            id: '2',
            name: 'mouse',
            priceCents: 999,
            type: 'electronics' 
        }
    ];

    beforeEach(async() => {
        spyOn(window, 'fetch').and.returnValue(Promise.resolve({
            json: () => Promise.resolve(mockProductsData)
        }));

        const callback = jasmine.createSpy('callback');
        // Load products before each test to ensure `products` array is populated
        await loadProductsFetch(callback);
    });
    
    it('should fetch products and populate products array with correct types', () => {
        expect(products.length).toBe(2);
        expect(products[0].name).toBe('shirt');
        expect(products[1].name).toBe('mouse');

        expect(products[0].extraInfoHTML()).toContain('Size chart');
        expect(typeof products[1].extraInfoHTML()).toBe('string');
    });

    it('should return a matchingProduct id', () => {
        const product = getProduct('1');
        expect(product.id).toBe('1');
        expect(product.priceCents).toBe(2999);
    });
})