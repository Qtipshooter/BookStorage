import React, { useState } from 'react';
import T_Home from '../templates/T_Home';

function Books() {
  const [count, setCount] = useState(1);
  return (
    <T_Home>
      <h1>Books Page</h1>
      <p>Welcome to the Books page!</p>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>Press Me</button>
    </T_Home>
  )
};

export default Books;

