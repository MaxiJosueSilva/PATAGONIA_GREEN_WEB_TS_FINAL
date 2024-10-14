import React from 'react';
import './Loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <span>C</span>
      <span>A</span>
      <span>R</span>
      <span>G</span>
      <span>A</span>
      <span>N</span>
      <span>D</span>
      <span>O</span>

      <div className="covers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default Loader;