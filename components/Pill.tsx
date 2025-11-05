import { CSSProperties, ReactNode } from "react"

interface Props {
  bgColor: string
  children?: ReactNode
  fgColor?: string
  border?: string
}

export default function Pill ({ children, bgColor, fgColor, border }: Props) {

  const borderClass = border
    ? `border`
    : ''
  
  const cssProps: CSSProperties = {
    backgroundColor: bgColor,
    color: fgColor,
    borderColor: border
  }

    return (
    <span style={cssProps} className={`py-1 px-3 rounded-full h-fit w-fit text-xs text-nowrap ${borderClass}`}>{children}</span>
  )
}