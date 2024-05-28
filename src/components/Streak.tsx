import React, { useState, useEffect } from 'react';
import { AiFillFire } from "react-icons/ai";
import '../css/Streak.css';

interface CounterProps {
  value: number;
}

const Counter: React.FC<CounterProps> = ({ value }) => {

  return (
    <div className="counter-container">
        <AiFillFire size = {23} className = 'mb-[2px] text-[#be3535]'/>
        <span className={`counter-value ${value !== 0 ? 'counter-animation' : ''}`}>
            {value}
            
        </span>
    </div>
  );
};

export default Counter;