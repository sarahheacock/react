import React from 'react';
//import PropTypes from 'prop-types';
import './Home.css';

const Home = (props) => {
  return (
    <div>
      <div className="red">Hello, You are on your {props.data} page.</div>
    </div>
  )
}

export default Home;
