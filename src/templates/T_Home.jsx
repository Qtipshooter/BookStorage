import React from 'react';
import Header from '../components/Header';

function T_Home({ children }) {
  return (
    <div>
      <Header></Header>
      <div>{children}</div>
    </div>
  )
};

export default T_Home;
