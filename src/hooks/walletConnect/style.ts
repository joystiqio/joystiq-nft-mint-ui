import styled from "styled-components"
import { color } from "../../styles/color"

export const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 100dvh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 20;
    display:flex;
     backdrop-filter: blur(40px);
`


export const Overlay = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index:1;
   
`

export const Dialog = styled.div`
    position: relative;
    width:374px;
    max-width:100%;
    max-height:100%;
    z-index:2;
    padding-top:0px;
    border-radius: 8px;
    background: ${color.neutral4};
    
    display:flex;
    flex-direction:column;

    @media (max-width: 576px) {
        width:100%;
        overflow-y: auto;
        overflow: auto;
    }
    margin:auto;   
`

export const DialogHeader = styled.div`
    cursor:default;
    user-select:none;
    padding:40px;
    position: relative;
`

export const DialogTitle = styled.div`
    font-size:24px;
    font-family: 'Tiny5';
    text-align:center;

`

export const CloseButton = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    font-size: 24px;
    padding-top:16px;
    padding-right:16px;
    padding-bottom:24px;
    padding-left:24px;
`

export const DialogBody = styled.div`
    padding: 40px;
    padding-top: 0;
    overflow-y: scroll;
    max-height:400px;
    padding-right:30px;

    @media (max-width: 576px) {
        max-height: unset;
        padding: 24px;
        overflow-y: initial;
    }

    &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: ${color.neutral2};  
        border-radius: 4px; 
    }
    scrollbar-color: ${color.neutral2} transparent;
    scrollbar-width: thin;
`

export const Wallet = styled.div`
    display:flex;
    padding:16px;
    align-items:center;
    justify-content:space-between;
    font-size:14px;
    border-radius: 8px;
    transition: background .1s ease-in-out;
    cursor:pointer;
    background: ${color.transparent2};
    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }
    &:not(:last-child) {
        margin-bottom: 8px;
    }

    & svg {
        width: 16px;
        height: 16px;
        color: ${color.neutral0};
    }
`

export const WalletInfo = styled.div`
    display: flex;
    align-items: center;
`

export const WalletIcon = styled.img`
    width: 32px;
    height: 32px;
    border-radius:8px;
`

export const WalletName = styled.div`
    margin-left: 16px;
`