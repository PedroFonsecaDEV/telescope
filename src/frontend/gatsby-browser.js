import React from 'react';
import UserProvider from './src/contexts/User/UserProvider';
import PostProvider from './src/contexts/Post/PostProvider';

// Named export required for useContext
/* eslint-disable import/prefer-default-export */
export const wrapRootElement = ({ element }) => {
  return (
    <PostProvider>
      <UserProvider>{element}</UserProvider>
    </PostProvider>
  );
};
