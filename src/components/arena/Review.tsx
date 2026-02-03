import React from 'react'
import { AgendaFormat, Collection, ColorOption, CoverImageTemplate, FontSize, Module, TextPosition } from '../../utilities/arenaSettings';

const Review = (
  {
    format,
    frontCoverColor,
    frontCoverCollection,
    frontCoverTemplate,
    frontCoverText,
    frontCoverFontSize,
    frontCoverPosition,
    modules,
    backCoverColor,
    backCoverText,
    backCoverFontSize,
    backCoverPosition,
  }:
    {
      format: AgendaFormat;
      frontCoverColor: ColorOption;
      frontCoverCollection: Collection;
      frontCoverTemplate: CoverImageTemplate;
      frontCoverText: string;
      frontCoverFontSize: FontSize;
      frontCoverPosition: TextPosition;
      modules: Module[];
      backCoverColor: ColorOption;
      backCoverText: string;
      backCoverFontSize: FontSize;
      backCoverPosition: TextPosition;
    }
) => {
  return (
    <div className="space-y-4 text-gray-100">
      <p><strong>Formato:</strong> {format}</p>

      <div className="border-l-2 border-indigo-200 pl-3">
        <p><strong>Copertina Anteriore:</strong></p>
        <ul className="list-disc list-inside pl-4 text-sm space-y-1">
          <li>Colore: {frontCoverColor.name}</li>
          <li>Collezione/Template: "{frontCoverCollection}" / {frontCoverTemplate}</li>
          {
            frontCoverText.trim() != '' ? (<>
              <li>Testo: "{frontCoverText}"</li>
              <li>**Dimensione Testo:** {frontCoverFontSize}</li>
              <li>**Posizione Testo:** {frontCoverPosition}</li>
            </>
            )
              :
              <li>Nessun testo aggiunto.</li>
          }

        </ul>
      </div>

      <div className="pl-4 border-l-2 border-gray-200 space-y-2">
        <p className="font-semibold">Sidebars ({modules.length}):</p>
        {modules.map((mod, index) => (
          <div key={mod.id} className="text-sm">
            <p><em>Sidebar {index + 1}:</em> Colore: {mod.sidebarColor.name}, Testo: "{mod.sidebarText}" | Pagine: {mod.pageInterior}</p>
          </div>
        ))}
      </div>

      <div className="border-l-2 border-rose-200 pl-3">
        <p><strong>Copertina Posteriore:</strong></p>
        <ul className="list-disc list-inside pl-4 text-sm space-y-1">
          <li>Colore: {backCoverColor.name}</li>
          {
            backCoverText.trim() !== '' ?
              <>
                <li>Testo: "{backCoverText}"</li>
                <li>**Dimensione Testo:** {backCoverFontSize}</li>
                <li>**Posizione Testo:** {backCoverPosition}</li>
              </> :
              <li>Nessun testo aggiunto.</li>
          }
        </ul>
      </div>
    </div>
  )
}

export default Review