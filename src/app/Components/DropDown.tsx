"use client"

import { ReactNode, useEffect, useRef, useState } from "react";
import Button from "./Button";

export type TDropDownOption = {
    display: ReactNode
    , value?: number | string | Date | boolean | undefined
    , disabled?: boolean
    , fnAction?: (params?: number | string | Date | boolean | undefined) => void
}

const DropDown: React.FC<{
    options: Array<string | TDropDownOption>
    , disabled?: boolean
    , fnOnSelect?: (nOption: string) => void
    , classNames?: Array<string>
    , children?: ReactNode
}> = ({ options, disabled, fnOnSelect, classNames, children }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState<boolean>(false);

    const fnOptionSelectDisplay = (): ReactNode => {
        const found: string | TDropDownOption | undefined = options.find((option: string | TDropDownOption) => (
            typeof option === "string"
                ? option === children
                : option.value === children
        ))

        return typeof found === "string" ? found : found?.display ?? children;
    }

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        }
    }, []);

    return <div ref={ref} className={`relative text-white overflow-visible ${classNames?.join(" ")}`}>
        <Button disabled={disabled} fnOnClick={() => { if (!disabled) { setOpen(p => (!p)) } }}>{fnOptionSelectDisplay()}<> &#x25BC;</></Button>

        <div className={`${open ? "flex flex-col" : "hidden"} w-full items-center absolute p-1`}>
            <div className="absolute w-auto bg-black border-2 shadow-sm">
                {options.map((option: string | TDropDownOption) => {
                    const ddOpt: TDropDownOption = typeof option === "string"
                        ? { display: option, value: option }
                        : option

                    const fnOnClick = () => {
                        if (fnOnSelect) {
                            fnOnSelect((ddOpt.value ?? "").toString());
                        }

                        if (ddOpt.fnAction) {
                            ddOpt.fnAction();
                        }

                        setOpen(false);
                    }

                    return <div key={ddOpt.display as string} onClick={fnOnClick}
                        className="block w-auto cursor-pointer whitespace-nowrap px-2 py-1 hover:bg-white hover:bg-opacity-80 hover:text-black"
                    >
                        {ddOpt.display}
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default DropDown;