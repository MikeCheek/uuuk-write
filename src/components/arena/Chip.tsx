import React from 'react';

interface ChipProps {
  label: string;
  size?: 'sm' | 'md'; // small for CartDrawer, medium for CartCheckout
}

/**
 * Reusable chip component for displaying customization details
 * @param label - Text content of the chip
 * @param size - 'sm' (default, for drawer) or 'md' (for checkout page)
 */
const Chip = ({ label, size = 'sm' }: ChipProps) => {
  const baseClasses = 'rounded border border-white/15';

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] bg-[#0b1531]',
    md: 'px-2 py-0.5 text-[11px] bg-[#101d3f]',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
};

export default Chip;
