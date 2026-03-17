import React from 'react'

type TypoType = "p" | "h2" | "h1" | "div"

const Typography = ({ variant, render, children, className = "", dangerouslySetInnerHTML = false }: { variant: TypoType, render?: TypoType, children: string | React.ReactNode, className?: string, dangerouslySetInnerHTML?: boolean }) => {
  let renderElem: TypoType
  if (render) renderElem = render
  else renderElem = variant

  const h1Class = "font-heading text-4xl md:text-7xl leading-[0.95] " + className
  const h2Class = "font-heading text-3xl md:text-6xl font-extrabold mb-8 md:mb-16 " + className
  const pClass = "text-base md:text-xl mt-4 max-w-2xl mx-auto max-w-[84vw] md:max-w-[42vw] leading-relaxed " + className

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