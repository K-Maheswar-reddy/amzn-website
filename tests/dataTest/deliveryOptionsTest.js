import { getDeliveryOption } from "../../data/deliveryOptions.js";

describe('delivery option', () => {
    it('should return correct delivery option object for valid id', () => {
        expect(getDeliveryOption('1')).toEqual({
            id: '1',
            deliveryDays : 7,
            priceCents: 0
        });
    })

    it('should return 1st delivery option is id is not matching', () => {
        expect(getDeliveryOption('0')).toEqual({
            id: '1',
            deliveryDays: 7,
            priceCents: 0
        })
    })
})