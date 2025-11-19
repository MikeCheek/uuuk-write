import React from 'react'

type TypoType = "p" | "h2" | "h1" | "div"

const Typography = ({ variant, render, children, className = "", dangerouslySetInnerHTML = false }: { variant: TypoType, render?: TypoType, children: string | React.ReactNode, className?: string, dangerouslySetInnerHTML?: boolean }) => {
  let renderElem: TypoType
  if (render) renderElem = render
  else renderElem = variant

  const h1Class = "text-5xl md:text-8xl " + className
  const h2Class = "text-4xl md:text-7xl font-extrabold text-transparent " + className // bg-clip-text bg-white
  const pClass = "text-lg md:text-2xl mt-4 max-w-2xl mx-auto max-w-[80vw] md:max-w-[40vw] " + className

  const assignedClass = variant === "h1" ? h1Class :
    variant === "h2" ? h2Class :
      variant === "p" ? pClass :
        ""

  return renderElem === "h1" ?
    <h1 className={assignedClass}
    // style={{ wordSpacing: '100vw' }}
    >{children}</h1>
    : renderElem === "h2" ?
      <h2 className={assignedClass}>{children}</h2>
      : renderElem === "p" ?
        dangerouslySetInnerHTML && typeof children === "string" ?
          <p className={assignedClass} dangerouslySetInnerHTML={{ __html: children }}></p> :
          <p className={assignedClass}>{children}</p>
        : renderElem === "div" ?
          <div className={assignedClass}>{children}</div>
          :
          <></>
}

export default Typography