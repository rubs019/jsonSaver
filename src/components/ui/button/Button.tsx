import React from "react";

type Colors = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
export type ButtonProps = {
  type: Colors
  onClick?: () => void
  disabled?: boolean
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {

  const buttonColor = getColorButton(props.type)

  function getColorButton(type: Colors) {
    const colors = {
      warning: 'bg-orange-300 hover:bg-orange-500',
      success: 'bg-green-300 hover:bg-green-500',
      primary: 'bg-blue-300 hover:bg-blue-500',
      secondary: 'bg-amber-300 hover:bg-amber-500',
      danger: 'bg-red-300 hover:bg-red-500',
    }
    return colors[type]
  }

  return (<button onClick={props.onClick} disabled={props.disabled}
                  className={`p-3 w-full h-full rounded cursor transition ease-in-out text-white ${buttonColor}`}>{props.children}</button>)
}
