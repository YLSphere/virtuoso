import React, { useState, useEffect } from 'react';
import { AiFillFire } from "react-icons/ai";
import '../css/Streak.css';

interface CounterProps {
  value: number;
}

const Counter: React.FC<CounterProps> = ({ value }) => {

  return (
    <div className="flex flex row items-center gap-1">
        <AiFillFire size = {23} className = 'text-[#be3535]'/>
        <div
        className={`items-start text-start counter-value ${value !== 0 ? 'counter-animation' : ''}`}
        style={{ animationDuration: value !== 0 ? `${Math.max(1 / value, 0.3)}s` : '1s' }}
        >
        {value}
        </div>
    </div>
  );
};

export default Counter;