import React from 'react';
import Chip from './Chip';
import { Module, ColorOption } from '../../utilities/arenaSettings';

interface FrontCover {
  collection: string;
  template?: string;
  color: ColorOption;
  text: string;
  fontSize: string;
  position: string;
  textColor: ColorOption;
}

interface BackCover {
  color: ColorOption;
  text: string;
  fontSize: string;
  position: string;
  textColor: ColorOption;
}

interface ProductCustomizationDetailsProps {
  frontCover?: FrontCover;
  backCover?: BackCover;
  modules?: Module[];
  productType?: 'agenda' | 'spare';
  sparePart?: {
    id: string;
    nome: string;
    description: string;
    personalization?: {
      color: ColorOption;
      text: string;
    };
  };
  cartId: string | number;
  size?: 'sm' | 'md';
}

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

  if (productType === 'spare' || (!frontCover && !backCover && !modules?.length)) {
    return (
      <div className="space-y-1.5">
        <div className={containerClasses}>
          <p className={`mb-1 ${titleClasses}`}>Ricambio</p>
          <div className={`flex flex-wrap ${chipContainerClasses}`}>
            <Chip label={sparePart?.nome || 'Ricambio UUUK'} size={size} />
            <Chip label={sparePart?.description || 'Ricambio universale'} size={size} />
            {sparePart?.personalization && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    )
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
