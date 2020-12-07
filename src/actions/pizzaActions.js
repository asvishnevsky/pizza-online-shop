export const setCurrency = output => ({
  type: 'SET_CURRENCY',
  output: output
});

export const addToCart = product => ({
  type: 'ADD_TO_CART',
  product: product
});