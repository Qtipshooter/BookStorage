import React from 'react';

const Template = ({ children }) => (
  <div>
    <nav>
      <a href="/">Home</a> | <a href="/about">About</a>
    </nav>
    <div>{children}</div>
  </div>
);

export default Template;
