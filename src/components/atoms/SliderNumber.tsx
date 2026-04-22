import React from 'react';

interface SliderNumberProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const SliderNumber: React.FC<SliderNumberProps> = ({ value, onChange, min = 1, max = 10, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-yellow"
      />
      <span className="w-8 text-center font-bold text-[#f6f8ff] bg-[#0b1531] rounded px-2 py-1 border border-white/10">{value}</span>
    </div>
  );
};

export default SliderNumber;
