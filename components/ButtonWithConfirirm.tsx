'use client'

import { ReactNode } from "react"
import { Button } from "./ui/button"

export default function ButtonWithConfirm({ children, onClick, confirmMessage, ...props }: { children: ReactNode, onClick: () => void, confirmMessage: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const handleClick = () => {
    const confirmed = confirm(confirmMessage)
    if (confirmed) {
      onClick()
    }
  } 

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}