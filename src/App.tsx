import { useEffect } from "react"
import config from "./config.json"
import Home from "./home"
import Background from "./styles/background"
import { AllDefaultWallets, defineSlushWallet, WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { Toaster } from "react-hot-toast";
import { WalletConnectProvider } from "./hooks/walletConnect";
import { color } from "./styles/color";

const slushWebWalletConfig = defineSlushWallet({
    appName: config.name,
    network: config.network as any
});

export default () => {
    return (
        <WalletProvider defaultWallets={[
            ...AllDefaultWallets,
            slushWebWalletConfig
        ]}>
            <WalletConnectProvider>
                <Background />
                <Home />

                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        style: {
                            border: "1px solid " + color.neutral4,
                            color: color.neutral0,
                            background: color.neutral5,
                        },
                    }}
                />
            </WalletConnectProvider>
        </WalletProvider>
    )

}