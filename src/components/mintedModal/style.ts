import styled from "styled-components"
import { color } from "../../styles/color"

export const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 100vh;
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
    width:500px;
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
    z-index:2;
`

export const NftImage = styled.img`
    width:100%;
    max-width:272px;
    border-radius: 24px;
`

export const NftTitle = styled.div`
    font-size: 14px;
    margin-top:8px;
    color:${color.neutral0};
    text-decoration:none;
`

export const Nft = styled.a`
    text-align:center;
    text-decoration:none;
`

export const Nfts = styled.div`
    display:flex;
    overflow-x:auto;
    padding:0 24px;
    white-space: nowrap;

    & ${NftImage}{
        width:214px;
    }

    & ${Nft}:not(:last-child){
        margin-right:24px;
    }

    & ${NftTitle}{
        margin-bottom:8px;
    }

    &::-webkit-scrollbar {
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: ${color.neutral2};  
        border-radius: 4px; 
    }
    scrollbar-color: ${color.neutral2} transparent;
`

export const NftSingle = styled.div`
    display:flex;
    justify-content:center;
    width:100%;
`


export const Bottom = styled.div`
    width:100%;
    padding:0 24px;
    padding-bottom:24px;
    display:flex;
    flex-direction:column;
    align-items:center;
`

export const Title = styled.div`
    font-size: 24px;
    margin-top:24px;
    text-align:center;
    font-weight:500;
    color:${color.neutral0};
`

export const Button = styled.button`
    margin-top:24px;
   background-color: ${color.transparent3};
    width: 80%;
    height: 48px;
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-top: 16px;
    border: none;
    font-family: "Tiny5";
    font-size: 18px;
    position: relative;
    &:hover {
        background-color: ${color.transparent2};
    }
    &:active {
        top: 1px;
    }
`
