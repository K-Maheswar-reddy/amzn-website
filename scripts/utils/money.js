/* Converts a price from cents (USD) to Indian Rupees (INR)
  using a fixed exchange rate of 1 USD = 83.5 INR,
  then rounds the result and formats it with the ₹ symbol.
*/

export function formatCurrency(priceCents){
  const rupee = (priceCents * 83.5) / 100;
  return `\u20B9${Math.round(rupee)}`;
}

export default formatCurrency;