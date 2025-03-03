import React from 'react'

type TypoType = "p" | "h2" | "h1"

const Typography = ({ variant, render, children }: { variant: TypoType, render?: TypoType, children: string | React.ReactNode }) => {
  let renderElem: TypoType
  if (render) renderElem = render
  else renderElem = variant

  const h1Class = "font-calligraph text-8xl md:text-9xl text-white mt-4 mr-4"
  const h2Class = "text-5xl md:text-7xl font-heading font-extrabold text-transparent bg-clip-text bg-white drop-shadow-lg"
  const pClass = "text-lg md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto"

  const assignedClass = variant === "h1" ? h1Class :
    variant === "h2" ? h2Class :
      variant === "p" ? pClass :
        ""

  return renderElem === "h1" ?
    <h1 className={assignedClass}>{children}</h1>
    : renderElem === "h2" ?
      <h2 className={assignedClass}>{children}</h2>
      : renderElem === "p" ?
        <p className={assignedClass}>{children}</p>
        :
        <></>
}

export default Typography