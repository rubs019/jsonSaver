import React from "react";

type Colors = 'primary' | 'secondary' | 'success' | 'warning'
export type ButtonProps = {
  type: Colors
  onClick?: () => void
}

export default function Button(data: React.PropsWithChildren<ButtonProps>) {

  const buttonColor = getColorButton(data.type)

  function getColorButton(type: Colors) {
    const colors = {
      warning: 'bg-orange-300 hover:bg-orange-500',
      success: 'bg-green-300 hover:bg-green-500',
      primary: 'bg-blue-300 hover:bg-blue-500',
      secondary: 'bg-amber-300 hover:bg-amber-500',
    }
    return colors[type]
  }
  return (<button onClick={data.onClick} className={`p-3 w-full h-full rounded cursor transition ease-in-out text-white ${buttonColor}`}>{data.children}</button>)
}
