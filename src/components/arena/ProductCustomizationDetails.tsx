import React from 'react';
import Chip from './Chip';
import { CartItem } from '../../utilities/arenaSettings';

type ProductCustomizationDetailsProps = Pick<CartItem, 'cartId'> &
  Partial<Pick<CartItem, 'frontCover' | 'backCover' | 'modules' | 'productType' | 'sparePart'>> & {
    size?: 'sm' | 'md';
  };

/**
 * Reusable component for displaying product customization details
 * Used in both CartDrawer and CartCheckout with different sizes
 */
const ProductCustomizationDetails = ({
  frontCover,
  backCover,
  modules,
  productType,
  sparePart,
  cartId,
  size = 'sm',
}: ProductCustomizationDetailsProps) => {
  const containerClasses =
    size === 'sm'
      ? 'rounded border border-white/10 bg-[#101d3f]/70 p-1.5'
      : 'rounded-lg border border-white/10 bg-[#0b1531]/70 p-2';

  const titleClasses =
    size === 'sm'
      ? 'text-[10px] font-bold uppercase tracking-wide text-[#8ea2d0]'
      : 'text-[11px] font-bold uppercase tracking-wide text-[#8ea2d0]';

  const chipContainerClasses = size === 'sm' ? 'gap-1' : 'gap-1.5';

  // Only render personalization section if spare part HAS personalization (e.g., sidebars)
  // If no personalization exists (e.g., binders), render nothing
  if (productType === 'spare') {
    if (sparePart?.personalization) {
      return (
        <div className="space-y-1.5">
          <div className={containerClasses}>
            <p className={`mb-1 ${titleClasses}`}>Personalizzazione</p>
            <div className={`flex flex-wrap ${chipContainerClasses}`}>
              <Chip
                label={`Colore: ${sparePart.personalization.color.name}`}
                size={size}
              />
              {sparePart.personalization.text && (
                <Chip
                  label={`Testo: ${sparePart.personalization.text}`}
                  size={size}
                />
              )}
            </div>
          </div>
        </div>
      )
    }
    // If spare part has no personalization, render nothing
    return null
  }

  if (!frontCover && !backCover && !modules?.length) {
    return null
  }

  return (
    <div className="space-y-1.5">
      {/* Front Cover */}
      <div className={containerClasses}>
        <p className={`mb-1 ${titleClasses}`}>Anteriore</p>
        <div className={`flex flex-wrap ${chipContainerClasses}`}>
          <Chip label={frontCover?.collection || 'Custom'} size={size} />
          <Chip label={frontCover?.template ?? 'Custom'} size={size} />
          <Chip label={`Colore: ${frontCover?.color.name || 'N/D'}`} size={size} />
          <Chip
            label={
              frontCover?.text?.trim()
                ? `Testo: ${frontCover.text} (${frontCover.fontSize}, ${frontCover.position}, ${frontCover.textColor.name})`
                : 'Testo: Nessuno'
            }
            size={size}
          />
        </div>
      </div>

      {/* Sidebars */}
      <div className={containerClasses}>
        <p className={`mb-1 ${titleClasses}`}>Sidebars ({modules?.length || 0})</p>
        <div className={`flex flex-wrap ${size === 'sm' ? 'max-h-14 overflow-y-auto pr-1' : ''} ${chipContainerClasses}`}>
          {modules?.map((mod, modIndex) => (
            <Chip
              key={`${cartId}-mod-${mod.id}-${modIndex}`}
              label={`${mod.sidebarText} · ${mod.sidebarColor.name}${mod.isDouble ? ' · Doppio' : ''}`}
              size={size}
            />
          ))}
        </div>
      </div>

      {/* Back Cover */}
      <div className={containerClasses}>
        <p className={`mb-1 ${titleClasses}`}>Posteriore</p>
        <div className={`flex flex-wrap ${chipContainerClasses}`}>
          <Chip label={`Colore: ${backCover?.color.name || 'N/D'}`} size={size} />
          <Chip
            label={
              backCover?.text?.trim()
                ? `Testo: ${backCover.text} (${backCover.fontSize}, ${backCover.position}, ${backCover.textColor.name})`
                : 'Testo: Nessuno'
            }
            size={size}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizationDetails;
