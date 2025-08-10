import styled from "styled-components"
import { color } from "../styles/color"

export const Home = styled.div`
    min-height:100dvh;
    height:100%;
`

export const Container = styled.div`
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 16px;
    height:100%;
    width:100%;
    position:relative;
    z-index:1;
    @media (max-width: 768px) {
        padding: 0 10px;
    }
`

export const Header = styled.div`
    height:88px;
    display:flex;
    justify-content:space-between;
    align-items:center;

    @media (max-width: 768px) {
        height: 64px;
        margin-bottom:24px;
    }
`

export const Logo = styled.img`
    width:112px;
`

export const WalletConnect = styled.button`
    background-color: ${color.neutral4};
    border-radius: 4px;
    font-family: "Tiny5";
    color: ${color.neutral1};
    font-size: 14px;
    outline:none;
    border:none;
    width:88px;
    height:32px;
    cursor:pointer;
    display:flex;
    justify-content:center;
    align-items:center;

    &:hover {
        color: ${color.main};
    }

    &:active {
        color: ${color.main};
        background-color: ${color.secondary};
    }
`

export const Loading = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    margin-top: 64px;
` 

export const Main = styled.div`
    display:flex;

    @media (max-width: 768px) {
        flex-direction:column;
    }
`

export const CollectionInfo = styled.div`
    flex:1;
    padding-right: 16px;

    @media (max-width: 768px) {
        padding-right:0;
    }
`

export const MainInfo = styled.div`
    width:640px;
    height:640px;
    background-image: url("/collection.png");
    background-size: cover;
    background-position: center;
    border-radius: 16px;
    position: relative;

    @media (max-width: 1150px) {
        width:100%;
    }

    @media (max-width: 968px) {
        height: 480px;
    }

    @media (max-width: 868px) {
        height: 400px;
    }

    @media (max-width: 768px) {
        width: 100%;
        height: 340px;
    }
`

export const MainInfoContent = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 16px;
`

export const MainInfoShadow = styled.div`

`

export const Title = styled.div`
    font-size: 24px;
    font-weight: 600;
`

export const Links = styled.div`
    margin-left: 24px;
    display: flex;
    align-items: center;
`

export const Link = styled.a`
    color: ${color.neutral0};
    border-radius: 8px;
    background-color: ${color.transparent3};
    border: 1px solid ${color.transparent3};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    & svg {
        width: 24px;
        height: 24px;
    }
    width:40px;
    height:32px;

    &:hover {
        border-color: ${color.transparent2};
    }
    &:active {
        border-color: ${color.neutral2};
    }

    &:not(:last-child) {
        margin-right: 16px;
    }
`

export const ExtraInfo = styled.div`
    @media (max-width: 768px) {
        display: none;
    }

     margin-top: 16px;
`

export const ExtraInfoMobile = styled.div`
    display: none;
    margin-bottom: 48px;

    @media (max-width: 768px) {
        display: block;
       
    }

`

export const Description = styled.div`
    font-size: 14px;
    color: ${color.neutral2};
    margin-top: 24px;
`

export const Address = styled.div`
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const AddressLabel = styled.div`
    font-family: "Tiny5";
`

export const AddressValue = styled.button`
    & svg{
        width: 14px;
        height: 14px;
        margin-left: 8px;
        color: ${color.neutral0};
    }
    display: flex;
    align-items: center;
    font-size: 14px;
    padding:8px 16px;
    border-radius: 8px;
    cursor: pointer;
    color: ${color.neutral1};
    background-color: ${color.transparent3};
    border: 1px solid ${color.transparent3};
    outline:none;
    &:hover {
         border: 1px solid ${color.transparent2};
    }
    &:active {
         border: 1px solid ${color.neutral2};
    }
`

export const Launch = styled.div`
    flex:1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
`

export const LaunchContent = styled.div`
    width:480px;
    background-color: ${color.transparent1};
    padding:16px;

    @media (max-width: 768px) {
        width: 100%;
        background-color: transparent;
        padding: 0;
        padding-top: 16px;
    }
`

export const LaunchInfo = styled.div`
    padding:16px;
    border-radius:8px;
    background-color: ${color.transparent1};
`

export const TotalMintedInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
`

export const TotalMintedTitle = styled.div`
    font-size: 14px;
    color: ${color.neutral0};
    font-family: "Tiny5";
`

export const TotalMintedValue = styled.div`
    color: ${color.neutral1};
    font-size: 12px;

    & span{
        font-weight: 600;
        margin-right: 8px;
    }
`

export const PriceSection = styled.div<{$multiple?: boolean}>`
    margin-top: 24px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    ${props => props.$multiple && `
        align-items: center;
    `}
`

export const Price = styled.div`

`

export const PriceLabel = styled.div`
    font-size: 12px;
    color: ${color.neutral1};
`

export const PriceValue = styled.div`
    margin-top: 4px;
    font-size:30px;
    font-family: "Tiny5";
`

export const PriceMultiple = styled.div`
    display:flex;
    flex-wrap:wrap;
    align-items:center;
`

export const PriceMultipleItem = styled.div`
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    
    & > span{
        padding: 6px;
        border-radius:8px;
        background-color: ${color.neutral0};
    }

    & span{
        color:${color.neutral5};
        font-weight:500;
        font-family: "Tiny5";
        font-size: 14px;
        white-space: nowrap;
    }
`

export const Amount = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding:8px 16px;
    border-radius: 8px;
    background-color: ${color.transparent2};
`

export const AmountAction = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    & img {
        width:24px;
    }
    user-select: none;
    position: relative;
    &:active {
        top: 1px;
    }
`

export const AmountValue = styled.input`
    width: 40px;
    background-color: transparent;
    outline: none;
    text-align: center;
    font-size: 18px;
    color: #F1F4F6;
    font-weight: 600;
    border:none;
     &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
`

export const MintButton = styled.button`
    background-color: ${color.transparent3};
    width: 100%;
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

    &:disabled {
        cursor: default;
        &:hover {
            background-color: ${color.transparent3};
        }
        &:active {
            top: 0;
        }
    }
`

export const Phases = styled.div`
    margin-top: 16px;
`

export const Phase = styled.div<{$active:boolean,$switch?:boolean}>`
    background-color:${color.transparent2};
    ${props => !props.$active && `
        opacity:0.4;    
    `}
    color:${props => props.$active ? color.neutral1 : color.neutral2};
    position:relative;
    border-radius:10px;
    padding:16px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    font-size:14px;

    &:not(:last-child){
        margin-bottom:16px;
    }

    ${props => (props.$switch && !props.$active) && `
        cursor:pointer;
        &:hover{
            background-color:${color.transparent3};
        }
        &:active{
            top:1px;
        }
    `}

    transition:all .1s ease-in-out;
`

export const PhaseTop = styled.div`
    display:flex;
    justify-content:space-between;
    margin-bottom:8px;
`

export const PhaseTitle = styled.div`
    color:${color.neutral0};
    display:flex;
`

export const PhaseReserved = styled.div`
    margin-left:4px;
`

export const PhaseDate = styled.div`
    & span {
        color: ${color.neutral1};
    }
`

export const PhaseBottom = styled.div`
    display:flex;
    flex-wrap:wrap;
    & span{
        white-space:nowrap;
        display:flex;
        flex-wrap:nowrap;
        align-items:center;
    }
    & span:not(:last-child){
        margin-right:4px;
    }
`

export const PhaseBadge = styled.div`
    position:absolute;
    right:16px;
    top:16px;

    & img {
        height:16px;
    }
`