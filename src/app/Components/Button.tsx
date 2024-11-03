"use client"

import { ReactNode } from "react"

const Button: React.FC<{
    children?: ReactNode
    , classNames?: Array<string>
    , disabled?: boolean
    , fnOnClick?: () => void
}> = ({ children, classNames, disabled, fnOnClick }) => (
    <div onClick={() => { if (!disabled && fnOnClick) { fnOnClick(); } }}
        className={`flex justify-center border-2 rounded-md px-2 py-1 bg-opacity-80 select-none bg-white ${disabled ? "text-gray-400 cursor-default" : "text-black hover:bg-opacity-60 cursor-pointer"} ${classNames?.join(" ")}`}
    >
        {children ?? <>Button</>}
    </div>
)

export default Button;