import styled from 'styled-components'
import { color } from "../../styles/color"

export const TotalMintedProgress = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 18px;
    margin-top: 16px;
`

export const TMPSkeleton = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    height: 18px;
    width: 100%;
`

export const TMPLeftArea = styled.div`
    height: 14px;
    width: 4px;
    position: relative;
`

export const TMPTopLeft = styled.div`
    width: 2px;
    height: 2px;
    background-color: #555;
    position: absolute;
    left: 2px;
    top: 0;
`

export const TMPLeft = styled.div`
    width: 2px;
    height: 10px;
    background-color: #555;
    position: absolute;
    left: 0;
    top: 2px;
`

export const TMPBottomLeft = styled.div`
    width: 2px;
    height: 2px;
    background-color: #555;
    position: absolute;
    left: 2px;
    bottom: 0;
`

export const TMPCenterArea = styled.div`
    position: relative;
    width: calc(100% - 8px);
    height: 18px;
`

export const TMPCenterTop = styled.div`
    height: 2px;
    background-color: #555;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
`

export const TMPCenterBottom = styled.div`
    height: 2px;
    background-color: #555;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
`

export const TMPRightArea = styled.div`
    height: 14px;
    width: 4px;
    position: relative;
`

export const TMPTopRight = styled.div`
    width: 2px;
    height: 2px;
    background-color: #555;
    position: absolute;
    right: 2px;
    top: 0;
`

export const TMPRight = styled.div`
    width: 2px;
    height: 10px;
    background-color: #555;
    position: absolute;
    right: 0;
    top: 2px;
`

export const TMPBottomRight = styled.div`
    width: 2px;
    height: 2px;
    background-color: #555;
    position: absolute;
    right: 2px;
    bottom: 0;
`
export const TMPProgress = styled.div`
    position: absolute;
    left: 4px;
    top: 4px;
    height: 10px;
    width: calc(100% - 8px);
    display: flex;
    align-items: center;
`

export const TMPBarLeftLeft = styled.div`
    width: 2px;
    height: 6px;
`


export const TMPBarLeftRight = styled.div<{ $width: number; }>`
    height: 10px;
    width: ${({ $width }) => $width}px;
`

export const TMPMask = styled.div<{  $progress: number }>`
    width: ${props => 100 - props.$progress}%;
    height: 100%;
    right: 0;
    position: absolute;
    z-index: 1;
    background-color: ${color.neutral3};
    transition: width 0.3s ease-in-out;
`

export const TMPBars = styled.div<{ $gap: number, $progress: number }>`
    
    display: flex;
    gap: ${({ $gap }) => $gap}px;
    flex-grow: 1;
    justify-content: center;
    & div {
        background-color: ${props => props.$progress === 100 ? color.main : color.neutral0};
    }
`


export const TMPBar = styled.div<{ $width: number }>`
    display: flex;
    height: 10px;
    width: ${({ $width }) => $width}px;
    align-items: center;
    background-color: transparent !important;
`

export const TMPBarInner = styled.div`
    height: 10px;
    width: 100%;
`

export const TMPBarRightLeft = styled.div<{ $width: number;  }>`
    height: 10px;
    width: ${({ $width }) => $width}px;
   
`

export const TMPBarRightRight = styled.div`
    width: 2px;
    height: 6px;
    
`