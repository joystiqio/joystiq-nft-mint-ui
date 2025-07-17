import styled from "styled-components"
import { color } from "../../styles/color"

export const Wallet = styled.div`
    background-color:${color.neutral4};
    padding:4px;
    padding-left:16px;
    border-radius:6px;
    font-size:14px;
    display:flex;
    align-items:center;
    cursor:pointer;
`

export const WBalance = styled.div`
    padding:0px 8px;
    background-color:${color.secondary};
    font-family: 'Tiny5';
    color:${color.main};
    border-radius:4px;
    margin-left:16px;
    font-size:14px;
    display:flex;
    align-items:center;
    height:32px;
`

export const WAddress = styled.div`
    color:${color.neutral0};
    font-size:14px;
`

export const DropdownButtonContent = styled.div<{$side?:string, $mobileSide?:string}>`
    background: ${color.neutral4};
    position: absolute;
    ${props => props.$side === "left" ? "left: 0" : "right: 0"};
    z-index: 1;
    border-radius: 10px;
    display:none;
    overflow:hidden;
    width: fit-content;
    margin-top: 4px;
    z-index: 2;
    padding:8px;
    @media (max-width: 768px) {
        ${props => props.$mobileSide === "left" ? "left: 0" : "right: 0"};
    }
`

export const DropdownButton = styled.div<{$dropdownOpen : boolean}>`
    position: relative;

    ${props => props.$dropdownOpen && `
        ${DropdownButtonContent} {
            display: block;
        }
    `}
`

export const DropdownItem = styled.div`
    padding: 8px;
    font-size: 12px;
    display: flex;
    min-width: 160px;
    cursor: pointer;
    display: flex;
    align-items: center;
    color: ${color.neutral1};
    justify-content: center;
    user-select: none;

    & > svg{
        margin-left: 8px;
        width:14px;
    }
    border: 1px solid ${color.transparent1};
    border-radius: 8px;
    background: ${color.transparent1};

    &:hover {
        background: ${color.transparent3};
        border: 1px solid ${color.transparent2};
    }
    &:active {
        background: ${color.transparent3};
        border: 1px solid ${color.neutral2};
    }

    &:not(:last-child) {
        margin-bottom: 6px;
    }

    &:last-child {
        color: ${color.main};
        font-family: 'Tiny5';
    }


`