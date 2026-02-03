import React from 'react'
import { AgendaFormat } from '../../utilities/arenaSettings'
import TextButton from './TextButton'

const Format = ({ formats, setFormat, format }: { formats: AgendaFormat[], setFormat: (format: AgendaFormat) => void, format: AgendaFormat }) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">Scegli il formato della tua agenda:</p>
      <div className="flex gap-4">
        {formats.map((f) => (
          <TextButton
            key={f}
            text={f}
            onClick={() => setFormat(f)}
            active={format === f}
          />
        ))}
      </div>
    </div>
  )
}

export default Format