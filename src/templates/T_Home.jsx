import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function T_Home({ children }) {
  return (
    <div>
      <Header></Header>
      <div>{children}</div>
      <Footer></Footer>
    </div>
  )
};

export default T_Home;
