import React from 'react'
import { ColorOption, MAX_MODULES, Module, PageInterior } from '../../utilities/arenaSettings'

const Modules = (
  {
    modules,
    setActiveModuleIndex,
    activeModuleIndex,
    addModule,
    removeModule,
    updateModule,
    colors,
    pageInteriors
  }: {
    modules: Module[];
    setActiveModuleIndex: (index: number) => void;
    activeModuleIndex: number;
    addModule: () => void;
    removeModule: (index: number) => void;
    updateModule: (index: number, updatedFields: Partial<Module>) => void;
    colors: ColorOption[];
    pageInteriors: PageInterior[];
  }
) => {
  const activeModule = modules[activeModuleIndex];

  return (
    <div className="space-y-6">
      {/* Module selection/addition/removal buttons (omitted for brevity) */}
      <div className="flex items-center gap-2 flex-wrap border-b pb-4 mb-4">
        <span className="text-gray-600 font-medium">Modules:</span>
        {modules.map((mod, index) => (
          <button
            key={mod.id}
            onClick={() => setActiveModuleIndex(index)}
            className={`px-3 py-1 rounded-md text-sm border ${activeModuleIndex === index ? 'bg-indigo-100 text-indigo-700 border-indigo-300 font-semibold' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}
          >
            Module {index + 1}
          </button>
        ))}
        <button
          onClick={addModule}
          disabled={modules.length >= MAX_MODULES}
          className="px-3 py-1 rounded-md bg-emerald-500 text-white text-sm hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          + Add
        </button>
      </div>

      <h3 className="text-lg font-semibold text-black">Editing Module {activeModuleIndex + 1}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sidebar Customization (omitted for brevity) */}
        <div className="space-y-4">
          <p className="text-gray-600 font-medium">Sidebar Settings:</p>
          <div>
            <p className="text-gray-600 mb-2 text-sm">Color:</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => updateModule(activeModuleIndex, { sidebarColor: c })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${c.class} ${activeModule.sidebarColor.name === c.name ? 'ring-2 ring-offset-1 ring-indigo-500 border-white' : 'border-transparent hover:border-gray-300'}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div>
            <label htmlFor={`sidebarText-${activeModule.id}`} className="block text-gray-600 mb-1 text-sm">Text:</label>
            <input
              type="text"
              id={`sidebarText-${activeModule.id}`}
              value={activeModule.sidebarText}
              onChange={(e) => updateModule(activeModuleIndex, { sidebarText: e.target.value })}
              maxLength={15}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          {modules.length > 1 && (
            <button
              onClick={() => removeModule(activeModuleIndex)}
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Remove Module {activeModuleIndex + 1}
            </button>
          )}
        </div>

        {/* Page Interior Customization (omitted for brevity) */}
        <div className="space-y-4">
          <p className="text-gray-600 font-medium">Page Interior:</p>
          <div className="flex flex-col gap-2">
            {pageInteriors.map((p) => (
              <button
                key={p}
                onClick={() => updateModule(activeModuleIndex, { pageInterior: p })}
                className={`px-3 py-1.5 text-left rounded-lg border-2 transition-all text-sm ${activeModule.pageInterior === p ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 hover:border-indigo-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="w-full h-24 bg-white border border-gray-300 rounded p-2 mt-2 overflow-hidden">
            {activeModule.pageInterior === 'Lined' && <div className="space-y-2 h-full border-l border-red-200 pl-2"><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div><div className="h-px bg-blue-200"></div></div>}
            {activeModule.pageInterior === 'Dotted' && <div className="h-full bg-[radial-gradient(#d1d5db_0.5px,transparent_0.5px)] [background-size:10px_10px]"></div>}
            {activeModule.pageInterior === 'Blank' && <div className="h-full"></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modules