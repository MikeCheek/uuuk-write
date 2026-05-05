import React from 'react'
import { AgendaFormat, ColorOption, MAX_MODULES, Module } from '../../utilities/arenaSettings'
import ColorButton from './ColorButton';
import InputText from './InputText';
import TextButton from './TextButton';

const Modules = (
  {
    modules,
    setActiveModuleIndex,
    activeModuleIndex,
    addModule,
    removeModule,
    updateModule,
    colors,
    format
  }: {
    modules: Module[];
    setActiveModuleIndex: (index: number) => void;
    activeModuleIndex: number;
    addModule: () => void;
    removeModule: (index: number) => void;
    updateModule: (index: number, updatedFields: Partial<Module>) => void;
    colors: ColorOption[];
    format: AgendaFormat;
  }
) => {
  const activeModule = modules[activeModuleIndex];

  const checkModuleLimit = () => {
    const maxModules = format.toUpperCase() === 'A7' ? 2 : MAX_MODULES;
    if (modules.length >= maxModules
      ||
      (modules.filter(m => m.isDouble).length > 0 && modules.length >= maxModules - 1)) {
      return true;
    }
    return false;
  }

  const checkDoublePresence = () => modules.filter(m => m.isDouble).length > 0

  const checkDoubleAvailability = () => {
    const isA7 = format.toUpperCase() === 'A7';
    return !isA7 && !checkDoublePresence() && modules.length < MAX_MODULES;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap border-b pb-4 mb-4">
        <span className="text-gray-300 font-medium">Sidebars:</span>
        {modules.map((mod, index) => (
          <TextButton
            key={mod.id}
            text={`${mod.sidebarText} ${mod.isDouble ? '(2x)' : ''}`}
            onClick={() => setActiveModuleIndex(index)}
            active={activeModuleIndex === index}
          />
        ))}
        <button
          onClick={addModule}
          disabled={checkModuleLimit()}
          className="px-3 py-1 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          + Aggiungi
        </button>
      </div>

      <h3 className="text-lg font-semibold text-white">{activeModule.sidebarText} {activeModule.isDouble ? '(2x)' : ''}</h3>

      <div className="grid gap-6">
        <div className="space-y-4">
          {format.toUpperCase() !== 'A7' && (
            <div>
              <label className="flex items-center gap-2 text-gray-300 mb-3">
                <input
                  type="checkbox"
                  checked={activeModule.isDouble || false}
                  onChange={(e) => updateModule(activeModuleIndex, { isDouble: e.target.checked })}
                  disabled={!checkDoubleAvailability() && !activeModule.isDouble}
                  className="w-4 h-4"
                />
                <span className="text-sm">Doppia (occupa 2 slot)</span>
              </label>
            </div>
          )}
          <div>
            <p className="text-gray-300 mb-2 text-sm">Colore:</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <ColorButton key={c.name} name={c.name}
                  color={c.color}
                  active={activeModule.sidebarColor.name === c.name}
                  onClick={() => updateModule(activeModuleIndex, { sidebarColor: c })} />
              ))}
            </div>
          </div>
          <div>
            <InputText
              label="Testo Sidebar:"
              id={`sidebarText-${activeModule.id}`}
              value={activeModule.sidebarText}
              onChange={(e) => updateModule(activeModuleIndex, { sidebarText: e.target.value })}
            />
          </div>
          {modules.length > 1 && (
            <button
              onClick={() => removeModule(activeModuleIndex)}
              className="text-sm text-rose-600 hover:text-rose-900 flex items-center gap-1 mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Elimina Sidebar {activeModuleIndex + 1}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Modules
