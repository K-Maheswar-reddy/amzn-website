/*🚚 Delivery Options Module
  Defines available delivery options and provides a utility function to retrieve one by ID.
*/
export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
},
{
  id: '2',
  deliveryDays: 3,
  priceCents: 499
},
{
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

// Returns the delivery option object for the given ID.
// Defaults to the first option if no match is found.
export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((Option) => {
    if (Option.id === deliveryOptionId) {
      deliveryOption = Option;
    }
  });

  return deliveryOption || deliveryOptions[0];
}