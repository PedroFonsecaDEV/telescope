import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { PostStateContext, PostStateDispatch } from '../PostContext';
import { postReducer, initialState } from '../PostReducer';

const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);
  return (
    <PostStateContext.Provider value={state}>
      <PostStateDispatch.Provider value={dispatch}>{children}</PostStateDispatch.Provider>
    </PostStateContext.Provider>
  );
};

PostProvider.propTypes = {
  children: PropTypes.elementType,
};

export default PostProvider;
