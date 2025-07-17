import React, { useEffect } from "react"
import * as S from "./style"
import { shortenPublicKey } from "../../utils/helpers"

const DropdownButton = (props: any) => {

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])

    const dropdownRef = React.useRef<any>(null);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleClickOutside = (event: any) => {

        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    }

    const openDropdown = () => {
        if (!dropdownOpen)
            setDropdownOpen(true)
        else
            setDropdownOpen(false)
    }

    return (
        <S.DropdownButton ref={dropdownRef} onClick={openDropdown} $dropdownOpen={dropdownOpen}>
            <S.Wallet>
                <S.WAddress>{shortenPublicKey(props.address)}</S.WAddress>
                <S.WBalance>{props.balance} SUI</S.WBalance>
            </S.Wallet>

            <S.DropdownButtonContent $side={props.side} $mobileSide={props.mobileSide} onClick={() => setDropdownOpen(false)}>
                {props.children}
            </S.DropdownButtonContent>
        </S.DropdownButton>
    )
}

export const DropdownItem = (props: any) => {

    return (
        <S.DropdownItem onClick={props.onClick ?? (() => { })}>
            {props.children}
        </S.DropdownItem>
    )
}

export default DropdownButton