import React, { useState, useEffect } from 'react';
import '../css/Streak.css';

interface CounterProps {
  value: number;
}

const Counter: React.FC<CounterProps> = ({ value }) => {

  return (
    <div className="counter-container">
        <h3>streak:</h3>
        <span className={`counter-value ${value !== 0 ? 'counter-animation' : ''}`}>
            {value}
            
        </span>
    </div>
  );
};

export default Counter;