const initialState = { output: 'USD', cart: {}};

const pizzaReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENCY':
      return { ...state, output: action.output };
    case 'ADD_TO_CART':
      if (state.cart[action.product])
      	state.cart[action.product] = state.cart[action.product] + 1
      else
      	state.cart[action.product] = 1
      return { output: state.output, cart: state.cart };
    default:
      return state;
  }
};

export default pizzaReducers;
