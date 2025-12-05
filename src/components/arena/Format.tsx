import React from 'react'
import { AgendaFormat } from '../../utilities/arenaSettings'

const Format = ({ formats, setFormat, format }: { formats: AgendaFormat[], setFormat: (format: AgendaFormat) => void, format: AgendaFormat }) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">Choose your agenda size:</p>
      <div className="flex gap-4">
        {formats.map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`px-4 py-2 rounded-lg border-2 transition-all ${format === f ? 'border-indigo-500 bg-indigo-100 text-indigo-700 font-semibold' : 'border-gray-300 hover:border-indigo-300'}`}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Format