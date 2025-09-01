import { useEffect } from "react";
import * as S from "./style"
import confetti from "canvas-confetti"
import config from "../../config.json"
import { formatImageUrl } from "../../utils/helpers";

const MintedModal = (props: any) => {

    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, [])

    return (
        <S.Modal>
            <S.Overlay onClick={props.close}></S.Overlay>
            <S.Dialog>
                <S.DialogHeader>
                    <S.DialogTitle></S.DialogTitle>
                    <S.CloseButton onClick={props.close}>&times;</S.CloseButton>
                </S.DialogHeader>
                <S.DialogBody>
                    {props.mints.length === 1 && (
                        <>
                            <S.NftSingle>
                                <S.Nft href={`https://suiscan.xyz/${config.network}/object/${props.mints[0].id}`} target="_blank" rel="noopener noreferrer">
                                    <S.NftImage src={formatImageUrl(props.mints[0].image)}></S.NftImage>
                                    <S.NftTitle>
                                        {props.mints[0].name}
                                    </S.NftTitle>
                                </S.Nft>
                            </S.NftSingle>
                        </>
                    )}

                    {props.mints.length > 1 && (
                        <S.Nfts>
                            {props.mints.map((mint: any, i: number) => (
                                <S.Nft key={i} href={`https://suiscan.xyz/${config.network}/object/${mint.id}`} target="_blank" rel="noopener noreferrer">
                                    <S.NftImage src={formatImageUrl(mint.image)}></S.NftImage>
                                    <S.NftTitle>
                                        {mint.name}
                                    </S.NftTitle>
                                </S.Nft>
                            ))}
                        </S.Nfts>
                    )}

                    <S.Bottom>

                        {props.mints.length > 1 && (
                            <S.Title>
                                Mint Successful!
                            </S.Title>
                        )}

                        <S.Button onClick={props.close}>
                            OK
                        </S.Button>
                    </S.Bottom>
                </S.DialogBody>
            </S.Dialog>
        </S.Modal>
    )

}

export default MintedModal;