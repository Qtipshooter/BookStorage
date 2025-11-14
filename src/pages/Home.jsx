import React from 'react';
import T_Home from '../templates/T_Home.jsx';

function Home() {
  return (
    <T_Home>
      <div className="home-section">
        <h1>Homepage Section: Splash</h1>
      </div>
      <div className="home-section">
        <h1>Homepage Section: Sample Books</h1>
      </div>
      <div className="home-section">
        <h1>Homepage Section: Comments/Reviews</h1>
      </div>
    </T_Home>
  )
};

export default Home;
