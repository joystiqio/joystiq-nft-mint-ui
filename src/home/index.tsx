import * as S from "./style"
import IconWeb from "../styles/icons/web"
import IconX from "../styles/icons/x"
import IconDiscord from "../styles/icons/discord"
import IconCopy from "../styles/icons/copy"
import config from "../config.json"
import { formatBigNumber, shortenPublicKey, verifyTransaction } from "../utils/helpers"
import { keccak_256 } from '@noble/hashes/sha3'
import { useWallet } from '@suiet/wallet-kit';
import { useEffect, useRef, useState } from "react"
import { useWalletConnect } from "../hooks/walletConnect"
import Wallet, { DropdownItem } from "../components/wallet"
import Progress from "../components/progress"
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client"
import BigNumber from "bignumber.js"
import Loading from "../components/loading"
import { Timer } from "../components/timer"
import toast from "react-hot-toast"
import { Transaction } from "@mysten/sui/transactions"
import { MerkleTree } from 'merkletreejs';
import MintedModal from "../components/mintedModal"

const client = new SuiClient({
    url: config.rpc || getFullnodeUrl("testnet"),
    network: config.network || "testnet",
});

const JOYSTIQ_CORE = "0xdee6a2701e148576c687d5b15f53e57dd7205128f7a7c54fd7f87383b40445f1";
const JOYSTIQ_CORE_ROOT = "0xa53664b81324f5663f36a713389730e1435f51419e353c3bca96b6658656f74f";

var phaseTimer: any = {}
var phaseSwitch = false
var interval: any = null

export default () => {

    const wallet = useWallet()
    const { disconnectWallet, openWalletConnect } = useWalletConnect()

    const [coins, setCoins] = useState<any>({
        "0x2::sui::SUI": {
            symbol: "SUI",
            decimals: 9,
        }
    })

    const [loading, setLoading] = useState(true)
    const [collection, setCollection] = useState<{
        supply: BigNumber,
        mintedSupply: BigNumber,
        phases: any[],
    } | null>(null)
    const [phases, setPhases] = useState<any[]>([])
    const [currentPhase, setCurrentPhase] = useState<any>(null)
    const [walletWhitelisted, setWalletWhitelisted] = useState(true)

    const [amount, setAmount] = useState(1)
    const amountInput = useRef<any>(null)

    const [balance, setBalance] = useState('0')

    const [mintedInfo, setMintedInfo] = useState<any>({})
    const [showMintedModal, setShowMintedModal] = useState(false)

    useEffect(() => {
        document.title = config.name
    }, [])

    useEffect(() => {
        load()
        return () => clearInterval(interval)
    }, [wallet])

    const load = async () => {
        refresh()
        clearInterval(interval)

        interval = setInterval(() => {
            refresh()
        }, 5000)
    }

    const getBalance = async () => {
        if (!wallet.connected) {
            return;
        }
        try {
            const balance = await client.getBalance({ owner: wallet.address!, coinType: "0x2::sui::SUI" });

            setBalance(new BigNumber(balance.totalBalance).div(1e9).toString());
        } catch (error) {
            console.error("Error fetching balance:", error)
        }
    }

    const refresh = async () => {
        try {
            const project = await client.multiGetObjects({
                ids: [config.artifacts.collectionObjectID, config.artifacts.collectionJqCoreConfigID, JOYSTIQ_CORE_ROOT],
                options: { showContent: true }
            })

            let root: any = project.find((object: any) => object.data.objectId === JOYSTIQ_CORE_ROOT)!
            let collectionJqCoreObject: any = project.find((object: any) => object.data.objectId === config.artifacts.collectionJqCoreConfigID)!
            let collectionObject: any = project.find((object: any) => object.data.objectId === config.artifacts.collectionObjectID)!

            if (!root || !collectionJqCoreObject || !collectionObject) {
                console.error("Required objects not found in project data")
                return
            }

            let collectionData: any = {
                supply: new BigNumber(collectionObject.data.content.fields.fixed_metadata ?
                    collectionObject.data.content.fields.metadata_count === 0 ? -1 : collectionObject.data.content.fields.supply
                    : collectionObject.data.content.fields.metadata_count_real),
                mintedSupply: new BigNumber(collectionObject.data.content.fields.next_token_id).minus(new BigNumber(collectionObject.data.content.fields.starting_token_id)),
                phases: [],
            }

            for (let i = 0; i < config.groups.length; i++) {
                for (let j = 0; j < collectionJqCoreObject.data.content.fields.mint_groups.length; j++) {
                    let group = collectionJqCoreObject.data.content.fields.mint_groups[j].fields
                    let groupConfig: any = config.groups[i]
                    if (groupConfig.name.toLowerCase().trim() === group.name.toLowerCase().trim()) {
                        collectionData.phases.push({
                            ...group,
                            groupIndex: j,
                            start_time: parseInt(group.start_time),
                            end_time: parseInt(group.end_time),
                            allowlist: groupConfig.allowlist,
                            max_mints_per_wallet: parseInt(group.max_mints_per_wallet),
                            reserved_supply: parseInt(group.reserved_supply),
                        })
                    }
                }
            }

            setCollection(collectionData)
            await managePhases(collectionData.phases)
            setLoading(false)
            getBalance()


        } catch (error) {
            console.error("Error loading project data:", error)
        }
    }

    const managePhases = async (phases: any[]) => {
        let currentPhase = null;
        let paymentTasks: { groupIndex: number, paymentIndex: number, key: string }[] = [];

        for (let i = 0; i < phases.length; i++) {
            const phase = phases[i];

            // Prepare payment fetch tasks with metadata
            if (phase.payments > 0) {
                paymentTasks.push({ groupIndex: i, paymentIndex: 0, key: `payment_0_of_group_${i}` });
            }
            if (phase.payments > 1) {
                paymentTasks.push({ groupIndex: i, paymentIndex: 1, key: `payment_1_of_group_${i}` });
            }
        }

        // Fetch payment objects and associate them 
        let payments: Record<number, Record<number, any>> = {};

        let coinAddresses: any = []

        if (paymentTasks.length > 0) {
            const promises = paymentTasks.map(task => {
                return client.getDynamicFieldObject({
                    parentId: config.artifacts.collectionJqCoreConfigID,
                    name: {
                        type: "0x1::string::String",
                        value: task.key
                    }
                });
            });

            const results = await Promise.all(promises);

            // Rebuild structured payment map
            for (let i = 0; i < results.length; i++) {
                const { groupIndex, paymentIndex } = paymentTasks[i];
                if (!payments[groupIndex]) {
                    payments[groupIndex] = {};
                }
                let total = (results[i].data?.content! as any).fields.value.fields.routes.reduce((sum: number, route: any) => new BigNumber(sum).plus(new BigNumber(route.fields.amount)).toString(), "0")
                let allTransfer = (results[i].data?.content! as any).fields.value.fields.routes.every((route: any) => route.fields.method === "transfer");

                coinAddresses.push((results[i].data?.content! as any).fields.value.fields.coin);

                payments[groupIndex][paymentIndex] = {
                    coin: (results[i].data?.content! as any).fields.value.fields.coin,
                    total: new BigNumber(total),
                    allTransfer,
                    routes: (results[i].data?.content! as any).fields.value.fields.routes.map((route: any) => ({
                        amount: new BigNumber(route.fields.amount),
                        destination: route.fields.destination,
                        method: route.fields.method, //"transfer" or "burn"
                    }))
                }
            }
        }

        //remove old saved coins
        coinAddresses = coinAddresses.filter((coin: string) => {
            return typeof coins[coin] === "undefined";
        });

        if (coinAddresses.length > 0) {
            //load coin metadatas
            const coinMetadataPromises = coinAddresses.map((coin: string) => {
                return client.getCoinMetadata({ coinType: coin });
            });

            const coinMetadataResults = await Promise.all(coinMetadataPromises);

            //save to coins state
            const updatedCoins: any = { ...coins };
            coinMetadataResults.forEach((metadata, index) => {
                const coinAddress = coinAddresses[index];
                updatedCoins[coinAddress] = {
                    symbol: metadata.data?.symbol || "Unknown",
                    decimals: metadata.data?.decimals
                };
            });
            setCoins(updatedCoins);
        }

        for (let i = 0; i < phases.length; i++) {

            let phasePayments: any = {};
            if (payments[i]) {
                phasePayments = payments[i];
            }

            phases[i].payments = Object.values(phasePayments);

            phases[i].start_time *= 1000
            phases[i].end_time = phases[i].end_time === 0 ? 0 : phases[i].end_time * 1000

            const start = new Date(phases[i].start_time);
            let end = phases[i].end_time === 0 ? new Date(32503680000000) : new Date(phases[i].end_time);
            const now = new Date();

            // Mark no-end if duration > 1 year
            phases[i].noend = (end.getTime() - start.getTime() > 31536000000);

            // Determine current phase
            if (now > start && now < end) {
                currentPhase = phases[i];
            }
        }

        if (currentPhase === null) {
            let closest = null
            for (let i = 0; i < phases.length; i++) {
                let phase = phases[i]
                let start = new Date(phase.start_time)

                if (closest === null)
                    closest = phase
                else {
                    let closestStart = new Date(closest.start_time)
                    if (start < closestStart) closest = phase
                }
            }

            currentPhase = closest
        }

        if (phaseTimer.name !== currentPhase.name) {
            if (phaseTimer.timeout) clearTimeout(phaseTimer.timeout)

            const now = new Date()
            const start = new Date(currentPhase.start_time)
            const end = new Date(currentPhase.end_time)

            phaseTimer.name = currentPhase.name

            if (now > start && now < end) {
                if (end.getTime() - now.getTime() < 31536000000) {
                    phaseTimer.timeout = setTimeout(() => {
                        refresh()
                        phaseTimer.timeout = null
                        phaseTimer.name = null
                    }, new Date(currentPhase.end_time).getTime() - new Date().getTime())
                } else {
                    currentPhase.noend = true
                }
            } else if (now < start) {
                phaseTimer.timeout = setTimeout(() => {
                    managePhases(phases)
                    refresh()
                    phaseTimer.timeout = null
                    phaseTimer.name = null
                }, new Date(currentPhase.start_time).getTime() - new Date().getTime())
            } else if (now > end) {
                //past phase
            }
        }

        setPhases(phases)
        if (!phaseSwitch) {
            manageWhitelist(currentPhase)
            setCurrentPhase(currentPhase)
        }

    };

    const manageWhitelist = (currentPhase: any) => {
        if (wallet.connected) {
            if (typeof currentPhase.allowlist !== 'undefined' && currentPhase.allowlist !== null) {
                let allowlist = currentPhase.allowlist.find((a: any) => a === wallet.address);
                if (allowlist) {
                    setWalletWhitelisted(true)
                } else {
                    setWalletWhitelisted(false)
                }
            } else {
                setWalletWhitelisted(true)
            }
        } else {
            setWalletWhitelisted(true)
        }
    }

    const switchPhase = (phase: any) => {
        if (!phase.noend && new Date(phase.end_time) < new Date() || phase.name === currentPhase.name)
            return;

        setCurrentPhase(phase)
        manageWhitelist(phase)
        phaseSwitch = true
    }

    const incrementAmount = () => {
        amountInput.current.value = amount + 1
        setAmount(amount + 1)
    }

    const decrementAmount = () => {
        if (amount > 1) {
            amountInput.current.value = amount - 1
            setAmount(amount - 1)
        }
    }

    const onAmountChange = () => {
        let value = amountInput.current.value
        if (value === '') value = 1
        try {
            setAmount(parseInt(value))
        } catch (e) { }
    }

    const mint = async () => {
        if (!wallet.connected) {
            openWalletConnect();
            return;
        }

        if (amount < 1) {
            alert("Amount must be at least 1")
            return;
        }

        if (currentPhase.max_mints_per_wallet > 0 && amount > currentPhase.max_mints_per_wallet) {
            toast.error("You can only mint " + currentPhase.max_mints_per_wallet + " times per wallet for this phase")
            return
        }

        if (collection!.supply.isEqualTo(-1) && collection!.supply.minus(collection!.mintedSupply).isLessThan(amount)) {
            if (collection!.supply.minus(collection!.mintedSupply).isEqualTo(0)) {
                toast.error("This collection is sold out")
            } else
                toast.error("There are only " + (collection!.supply.minus(collection!.mintedSupply).toString()) + " tokens left")
            return
        }

        //check if current phase is active
        if (new Date(currentPhase.start_time) > new Date()) {
            toast.error("This phase has not started yet")
            return
        }

        //check if current phase has ended
        if (!currentPhase.noend && new Date(currentPhase.end_time) < new Date()) {
            toast.error("This phase has ended")
            return
        }

        let loading = toast.loading("Minting...")

        try {

            let tx = new Transaction()
            tx.setSender(wallet.address!)
            let typeArguments: string[] = []
            let args = [
                tx.object(config.artifacts.collectionObjectID),
                tx.object(config.artifacts.collectionJqCoreConfigID),
                tx.object(config.artifacts.policyID),
                tx.pure.u64(currentPhase.groupIndex),
                tx.pure.u64(amount),
            ]
            let target = ""

            //allowlist
            if (currentPhase.merkle_root !== '' && currentPhase.merkle_root !== null) {
                let hashedWallets = currentPhase.allowlist.map(keccak_256)
                const tree = new MerkleTree(hashedWallets, keccak_256, { sortPairs: true })
                let allowlist = currentPhase.allowlist.find((a: any) => a === wallet.address);

                if (!allowlist) {
                    toast.error("You are not whitelisted for this phase")
                    return;
                }

                let proof = tree.getProof(Buffer.from(keccak_256(wallet.address!))).map(element => Array.from(element.data))
                args.push(tx.pure.option("vector<vector<u8>>", proof))
            } else {
                args.push(tx.pure.option("vector<vector<u8>>", null))
            }

            args.push(tx.object("0x6")) // system clock

            if (currentPhase.payments.length === 0) {
                target = `${config.artifacts.packageID}::jq721::mint_unpaid`;
            } else if (currentPhase.payments.length === 1) {
                target = `${config.artifacts.packageID}::jq721::mint`;
                typeArguments.push(currentPhase.payments[0].coin);

                const coinType = currentPhase.payments[0].coin;

                if (coinType === "0x2::sui::SUI") {
                    args.push(tx.splitCoins(tx.gas, [tx.pure.u64(currentPhase.payments[0].total.multipliedBy(amount).toFixed(0))])[0]);
                } else {
                    const coinAmount = currentPhase.payments[0].total.multipliedBy(amount).toFixed(0);

                    const coins = await client.getCoins({ owner: wallet.address!, coinType });
                    if (coins.data.length === 0) {
                        toast.error(`You don't have any ${coinType} to pay`);
                        return;
                    }

                    const coinId = coins.data[0].coinObjectId;
                    const splitCoin = tx.splitCoins(coinId, [tx.pure.u64(coinAmount)]);
                    args.push(splitCoin);
                }
            } else { // 2 payments
                target = `${config.artifacts.packageID}::jq721::mint_paid2`;
                typeArguments.push(currentPhase.payments[0].coin);
                typeArguments.push(currentPhase.payments[1].coin);

                // --- First Coin
                const coinType1 = currentPhase.payments[0].coin;
                if (coinType1 === "0x2::sui::SUI") {
                    args.push(tx.splitCoins(tx.gas, [tx.pure.u64(currentPhase.payments[0].total.multipliedBy(amount).toFixed(0))])[0]);
                } else {
                    const coinAmount1 = currentPhase.payments[0].total.multipliedBy(amount).toFixed(0);
                    const coins1 = await client.getCoins({ owner: wallet.address!, coinType: coinType1 });
                    if (coins1.data.length === 0) {
                        toast.error(`You don't have any ${coinType1} to pay`);
                        return;
                    }
                    const coinId1 = coins1.data[0].coinObjectId;
                    const splitCoin1 = tx.splitCoins(tx.object(coinId1), [tx.pure.u64(coinAmount1)]);
                    args.push(splitCoin1);
                }

                // --- Second Coin
                const coinType2 = currentPhase.payments[1].coin;
                if (coinType2 === "0x2::sui::SUI") {
                    args.push(tx.splitCoins(tx.gas, [tx.pure.u64(currentPhase.payments[0].total.multipliedBy(amount).toFixed(0))])[0]);
                } else {
                    const coinAmount2 = currentPhase.payments[1].total.multipliedBy(amount).toFixed(0);
                    const coins2 = await client.getCoins({ owner: wallet.address!, coinType: coinType2 });
                    if (coins2.data.length === 0) {
                        toast.error(`You don't have any ${coinType2} to pay`);
                        return;
                    }
                    const coinId2 = coins2.data[0].coinObjectId;
                    const splitCoin2 = tx.splitCoins(tx.object(coinId2), [tx.pure.u64(coinAmount2)]);
                    args.push(splitCoin2);
                }
            }


          

            tx.moveCall({
                target,
                typeArguments,
                arguments: args
            })

            const dryRunBytes = await tx.build({ client });
            const dryRunResult = await client.dryRunTransactionBlock({ transactionBlock: dryRunBytes });
            const gasUsed = dryRunResult.effects.gasUsed!;
            const estimatedGas = (
                BigInt(gasUsed.computationCost) +
                BigInt(gasUsed.storageCost) -
                BigInt(gasUsed.storageRebate)
            );
            const gasBudget = Number(estimatedGas * 12n / 10n);

            tx.setGasBudget(gasBudget);

            let signed = await wallet.signTransaction({
                transaction: tx
            })

            let res = await client.executeTransactionBlock({
                transactionBlock: signed.bytes,
                signature: signed.signature,
                options: {
                    showEffects: true,
                    showEvents: true,
                }
            })

            console.log("Transaction Result:", res)

            if (res.effects!.status.status !== "success") {
                toast.dismiss(loading)
                toast.error("Minting failed")
            } else {
                verifyTransaction(config.rpc, res.digest).then(async (result) => {
                    toast.dismiss(loading)

                    let objects = await client.multiGetObjects({
                        ids: res.effects!.created!.map((obj: any) => obj.reference.objectId),
                        options: {
                            showType: true,
                        }
                    })

                    console.log("Minted Objects:", objects)

                    let nfts = objects.filter((obj: any) => obj.data.type === `${config.artifacts.packageID}::jq721::NFT`).map((obj) => obj.data?.objectId!)

                    let nftObjects = await client.multiGetObjects({
                        ids: nfts,
                        options: {
                            showContent: true,
                        }
                    })

                    console.log("NFT Objects:", nftObjects)
                    let metadatas = nftObjects.map((obj: any) => {
                        return {
                            id: obj.data.objectId,
                            token_id: obj.data.content.fields.token_id,
                            name: obj.data.content.fields.name,
                            image: obj.data.content.fields.image_url,
                        }
                    })

                    setMintedInfo({ mints: metadatas })
                    setShowMintedModal(true)


                }).catch((error) => {
                    toast.error("Mint Success, but verification failed")
                    toast.dismiss(loading)
                })

            }


        } catch (error: any) {
            toast.error("Minting failed")
            console.error("Minting Error:", error)
            toast.dismiss(loading)
        }
    }

    return (
        <S.Home>
            <S.Container>
                <S.Header>
                    <S.Logo src="/logo.png" alt="Logo" />

                    {!wallet.connected ? (
                        <S.WalletConnect onClick={openWalletConnect}>
                            Connect
                        </S.WalletConnect>
                    ) : (
                        <Wallet
                            balance={balance}
                            address={wallet.address || ""}
                        >
                            <DropdownItem onClick={() => navigator.clipboard.writeText(wallet.address || "")}>Copy Address <IconCopy /></DropdownItem>
                            <DropdownItem onClick={() => { disconnectWallet(); openWalletConnect() }}>Change Wallet</DropdownItem>
                            <DropdownItem onClick={disconnectWallet}>Disconnect</DropdownItem>
                        </Wallet>
                    )}
                </S.Header>

                <S.Main>
                    {loading && (
                        <S.Loading><Loading /></S.Loading>
                    )}
                    {(collection && !loading) && (
                        <>
                            <S.CollectionInfo>
                                <S.MainInfo>
                                    <S.MainInfoShadow />
                                    <S.MainInfoContent>
                                        <S.Title>{config.name}</S.Title>
                                        {(config.website || config.socialX || config.discord) && (
                                            <S.Links>
                                                {config.website &&
                                                    <S.Link href={config.website} target="_blank" rel="noreferrer">
                                                        <IconWeb />
                                                    </S.Link>
                                                }
                                                {config.socialX &&
                                                    <S.Link href={config.socialX} target="_blank" rel="noreferrer">
                                                        <IconX />
                                                    </S.Link>
                                                }
                                                {config.discord &&
                                                    <S.Link href={config.discord} target="_blank" rel="noreferrer">
                                                        <IconDiscord />
                                                    </S.Link>
                                                }
                                            </S.Links>
                                        )}
                                    </S.MainInfoContent>
                                </S.MainInfo>

                                <S.ExtraInfo>
                                    <S.Description>
                                        {config.description}
                                    </S.Description>

                                    <S.Address>
                                        <S.AddressLabel>COLLECTION ADDRESS:</S.AddressLabel>
                                        <S.AddressValue>
                                            {shortenPublicKey(config.artifacts.packageID)} <IconCopy />
                                        </S.AddressValue>
                                    </S.Address>
                                </S.ExtraInfo>
                            </S.CollectionInfo>

                            <S.Launch>
                                <S.LaunchContent>
                                    <S.LaunchInfo>
                                        <S.TotalMintedInfo>
                                            <S.TotalMintedTitle>TOTAL MINT</S.TotalMintedTitle>
                                            <S.TotalMintedValue><span>{(!collection.supply.eq(-1) && !collection.supply.eq(0)) ? Math.floor((collection.mintedSupply.div(collection.supply).times(100)).times(100).toNumber()) / 100 : 0}%</span>{formatBigNumber(collection.mintedSupply)}/{formatBigNumber(collection.supply)}</S.TotalMintedValue>
                                        </S.TotalMintedInfo>
                                        {(!collection.supply.eq(-1) && !collection.supply.eq(0)) && (
                                            <Progress value={Math.floor((collection.mintedSupply.div(collection.supply).times(100).toNumber()) * 100) / 100} />
                                        )}

                                        <S.PriceSection>
                                            {currentPhase.payments.length === 0 && (
                                                <S.Price>
                                                    <S.PriceLabel>Price</S.PriceLabel>
                                                    <S.PriceValue>0 SUI</S.PriceValue>
                                                </S.Price>
                                            )}
                                            {(currentPhase.payments.length === 1 && currentPhase.payments[0].allTransfer) && (
                                                <S.Price>
                                                    <S.PriceLabel>Price</S.PriceLabel>
                                                    <S.PriceValue>
                                                        {currentPhase.payments[0].total.div(Math.pow(10, coins[currentPhase.payments[0].coin].decimals).toString()).toString()} {coins[currentPhase.payments[0].coin].symbol}
                                                    </S.PriceValue>
                                                </S.Price>
                                            )}
                                            {(currentPhase.payments.length > 1 || (currentPhase.payments.length === 1 && !currentPhase.payments[0].allTransfer)) && (
                                                <S.PriceMultiple>

                                                    <S.PriceMultipleItem>
                                                        {currentPhase.payments.map((payment: any, index: number) => {
                                                            return payment.routes.map((route: any, routeIndex: number) => {
                                                                const coin = coins[payment.coin];
                                                                return (
                                                                    <span key={`${index}-${routeIndex}`}>
                                                                        {route.amount.div(Math.pow(10, coin.decimals).toString())} <span>{coin.symbol} {route.method === "burn" ? "(Burn)" : ""}</span>
                                                                    </span>
                                                                )
                                                            })
                                                        })}
                                                    </S.PriceMultipleItem>
                                                </S.PriceMultiple>
                                            )}

                                            <S.Amount>
                                                <S.AmountAction onClick={decrementAmount}>
                                                    <img src="/minus.png" alt="Minus" />
                                                </S.AmountAction>
                                                <S.AmountValue type="number" step="1" min={1} defaultValue={1} ref={amountInput} onChange={onAmountChange} />
                                                <S.AmountAction onClick={incrementAmount}>
                                                    <img src="/plus.png" alt="Plus" />
                                                </S.AmountAction>
                                            </S.Amount>
                                        </S.PriceSection>


                                    </S.LaunchInfo>

                                    <S.MintButton
                                        onClick={mint}
                                        disabled={
                                            (!collection.supply.eq(-1) && collection.supply.minus(collection.mintedSupply).isZero())
                                        }
                                    >
                                        {
                                            (!collection.supply.eq(-1) && collection.supply.minus(collection.mintedSupply).isZero())
                                                ? "SOLD OUT"
                                                : (walletWhitelisted ? "MINT NOW" : "NOT WHITELISTED")
                                        }
                                    </S.MintButton>


                                    <S.Phases>
                                        {phases.map((phase, index) => (
                                            <S.Phase
                                                key={index}
                                                $active={currentPhase.name === phase.name}
                                                $switch={!(!phase.noend && new Date(phase.end_time) < new Date())}
                                                onClick={() => switchPhase(phase)}
                                            >
                                                <S.PhaseTop>
                                                    <S.PhaseTitle>
                                                        {phase.name}
                                                        {phase.reserved_supply !== 0 && (
                                                            <S.PhaseReserved>• {phase.reserved_supply} NFT</S.PhaseReserved>
                                                        )}
                                                    </S.PhaseTitle>
                                                    {!phase.noend && (
                                                        <>
                                                            {new Date(phase.start_time) < new Date() && new Date(phase.end_time) > new Date() && (
                                                                <S.PhaseDate>
                                                                    <span>Ends In</span> <Timer date={phase.end_time} />
                                                                </S.PhaseDate>
                                                            )}
                                                        </>
                                                    )}
                                                    {new Date(phase.start_time) > new Date() && (
                                                        <S.PhaseDate>
                                                            <span>Starts In</span> <Timer date={phase.start_time} />
                                                        </S.PhaseDate>
                                                    )}

                                                </S.PhaseTop>
                                                <S.PhaseBottom>
                                                    {phase.max_mints_per_wallet > 0 && <span>{phase.max_mints_per_wallet} Per Wallet •</span>}
                                                    {phase.payments.map((payment: any, paymentIndex: number) => {
                                                        const coin = coins[payment.coin];
                                                        return (
                                                            <span key={paymentIndex}>
                                                                {payment.allTransfer && `${payment.total.div(Math.pow(10, coin.decimals).toString())} ${coin.symbol}`}
                                                                {!payment.allTransfer && payment.routes.map((route: any, routeIndex: number) => (
                                                                    <span key={routeIndex}>
                                                                        {route.amount.div(Math.pow(10, coin.decimals).toString())} {coin.symbol} {route.method === "burn" ? "(Burn)" : ""}
                                                                        {routeIndex < payment.routes.length - 1 && " • "}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        )
                                                    })}
                                                </S.PhaseBottom>

                                                {(!phase.noend && new Date(phase.end_time) < new Date()) && (
                                                    <S.PhaseBadge>
                                                        <img src="/end.png" alt="Badge" />
                                                    </S.PhaseBadge>
                                                )}
                                            </S.Phase>
                                        ))}

                                    </S.Phases>
                                </S.LaunchContent>
                            </S.Launch>

                            <S.ExtraInfoMobile>
                                <S.Description>
                                    {config.description}
                                </S.Description>

                                <S.Address>
                                    <S.AddressLabel>COLLECTION ADDRESS:</S.AddressLabel>
                                    <S.AddressValue>
                                        {shortenPublicKey(config.artifacts.packageID)} <IconCopy />
                                    </S.AddressValue>
                                </S.Address>
                            </S.ExtraInfoMobile>
                        </>
                    )}
                </S.Main>
            </S.Container>

            {showMintedModal && (
                <MintedModal close={() => setShowMintedModal(false)} {...mintedInfo} />
            )}
        </S.Home>
    )
}

const getObjectRef = async (id: string) => {
    const obj = await client.getObject({
        id,
        options: { showContent: true }
    });
    return {
        objectId: obj.data!.objectId,
        version: obj.data!.version,
        digest: obj.data!.digest
    };
};
