export const initialState = {
  top: false,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_TOP': {
      console.log('ACT:', action, 'ST:', state);
      return { ...action.payload };
    }
    default: {
      return state;
    }
  }
};
