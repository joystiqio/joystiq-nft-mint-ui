import { useEffect, useRef, useState } from 'react'
import * as S from './style'

const Progress = ({ value }: { value: number }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [layout, setLayout] = useState({
        barCount: 2,
        barWidth: 10,
        gap: 2,
        offset: 0,
    })

    useEffect(() => {
        const updateLayout = () => {
            if (!containerRef.current) return

            const containerWidth = containerRef.current.offsetWidth - 4;
            const outerPixels = 4 
            const idealBar = 10
            const idealGap = 2

            const available = containerWidth - outerPixels
            const idealUnit = idealBar + idealGap

            let barCount = Math.floor((available + idealGap) / idealUnit)
            barCount = Math.max(barCount, 3)

            const totalGaps = (barCount - 1) * idealGap
            const totalBarSpace = available - totalGaps
            const barWidth = totalBarSpace / barCount

            const totalFilledWidth = barCount * barWidth + totalGaps
            const horizontalOffset = Math.max((available - totalFilledWidth) / 2, 0)

            setLayout({
                barCount,
                barWidth,
                gap: idealGap,
                offset: horizontalOffset,
            })
        }

        updateLayout()
        window.addEventListener('resize', updateLayout)
        return () => window.removeEventListener('resize', updateLayout)
    }, [])

    return (
        <S.TotalMintedProgress ref={containerRef}>
            <S.TMPSkeleton>
                <S.TMPLeftArea>
                    <S.TMPTopLeft />
                    <S.TMPLeft />
                    <S.TMPBottomLeft />
                </S.TMPLeftArea>
                <S.TMPCenterArea>
                    <S.TMPCenterTop />
                    <S.TMPCenterBottom />
                </S.TMPCenterArea>
                <S.TMPRightArea>
                    <S.TMPTopRight />
                    <S.TMPRight />
                    <S.TMPBottomRight />
                </S.TMPRightArea>
            </S.TMPSkeleton>

            <S.TMPProgress>
                <S.TMPMask $progress={value}> </S.TMPMask>
                    <S.TMPBars $progress={value} $gap={layout.gap} style={{ marginLeft: layout.offset, marginRight: layout.offset }}>
                        {/* LEFT BAR */}
                        <S.TMPBar $width={layout.barWidth}>
                            <S.TMPBarLeftLeft />
                            <S.TMPBarLeftRight $width={layout.barWidth - 2} />
                        </S.TMPBar>

                        {/* CENTER BARS */}
                        {[...Array(layout.barCount - 2)].map((_, i) => (
                            <S.TMPBar key={i} $width={layout.barWidth}>
                                <S.TMPBarInner />
                            </S.TMPBar>
                        ))}

                        {/* RIGHT BAR */}
                        <S.TMPBar $width={layout.barWidth}>
                            <S.TMPBarRightLeft $width={layout.barWidth - 2} />
                            <S.TMPBarRightRight />
                        </S.TMPBar>
                    </S.TMPBars>
               


            </S.TMPProgress>

        </S.TotalMintedProgress>
    )
}

export default Progress
