import React from 'react'

const Connection = ({ bottom = true, right = true, width = 260, height = 40, bgColor = 'bg-white/10' }: { bottom?: boolean, right?: boolean, width?: number, height?: number, bgColor?: string }) => {
  const common = bgColor + " transition-bgColor duration-200"

  return (
    <span className='hidden md:block'>
      <span className={`w-[4px] ${common} absolute ${right ? 'left-[120px]' : 'right-[120px]'}`}
        style={bottom ? { height, bottom: -height - 1 } : { height, top: -height - 1 }}>
      </span>
      <span className={`h-[4px] ${common} absolute ${right ? 'left-[120px]' : 'right-[120px]'}`}
        style={bottom ? { width, bottom: -height - 5 } : { width, top: -height - 5 }}>
      </span>
      <span className={`rounded-full h-6 w-6 ${common} absolute`}
        style={{
          left: right ? width + 120 : 'auto',
          right: right ? 'auto' : width + 120,
          bottom: bottom ? -height - 15 : 'auto',
          top: bottom ? 'auto' : -height - 15
        }}>
      </span>
    </span>
  )
}

export default Connection