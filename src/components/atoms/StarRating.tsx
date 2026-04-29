import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, max = 5, className = '' }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Valuta ${n} stelle`}
          className={`text-4xl transition-colors ${(hovered !== null ? n <= hovered : n <= value) ? 'text-yellow' : 'text-[#b6c8f2]'} hover:text-yellow focus:outline-none`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
