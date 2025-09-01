import { useWallet } from "@suiet/wallet-kit";
import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion'

import * as S from "./style"
import IconArrowRight from "../../styles/icons/arrorRight";

const WalletConnectContext = React.createContext({
    isModalOpen: false,
    openWalletConnect: () => { },
    closeWalletConnect: () => { },
    disconnectWallet: () => { },
})

const WalletConnectProvider = ({ children }: any) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [walletType, setWalletType] = React.useState("")
    const wallet = useWallet()

    const openWalletConnect = () => setIsModalOpen(true)
    const closeWalletConnect = () => setIsModalOpen(false)

    const connectWallet = (name: any) => {
        wallet.select(name).then(() => {
            setWalletType(name)
            closeWalletConnect()
            localStorage.setItem("lastConnectedWallet", name)
        }).catch((err: any) => {
            console.log(err)
            localStorage.removeItem("lastConnectedWallet")
        })
    }

    useEffect(() => {
        const lastConnectedWallet = localStorage.getItem("lastConnectedWallet")
        if (lastConnectedWallet) {
            connectWallet(lastConnectedWallet)
        }
    }, [])

    const disconnectWallet = () => {
        wallet.disconnect().catch()
        localStorage.removeItem("lastConnectedWallet")
    }

    return (
        <WalletConnectContext.Provider value={{ isModalOpen, openWalletConnect, closeWalletConnect, disconnectWallet }}>
            {children}
            <WalletConnectModal connectWallet={connectWallet} />
        </WalletConnectContext.Provider>
    )
}

const wallets = [
    ["Suiet", "Suiet", "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xNzA4XzI4Mjk3KSIvPjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfMTcwOF8yODI5NykiIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0yMi44IDIwYy0xLjQgMC0yLjctMS40LTMuMy0yLjMtLjcuOS0yIDIuMy0zLjQgMi4zcy0yLjctMS40LTMuNC0yLjNjLS42LjktMS45IDIuMy0zLjMgMi4zLS4zIDAtLjUtLjItLjUtLjVzLjItLjUuNS0uNWMxLjEgMCAyLjYtMS45IDIuOS0yLjVsLjUtLjJjLjIgMCAuMyAwIC40LjIuNC42IDEuOCAyLjUgMi45IDIuNSAxLjEgMCAyLjUtMS45IDIuOS0yLjVsLjQtLjJjLjIgMCAuNCAwIC41LjIuNC42IDEuOCAyLjUgMi45IDIuNS4yIDAgLjUuMi41LjVzLS4yLjUtLjUuNXoiLz48cGF0aCBkPSJNMjIuOCAyMy4zYy0xLjQgMC0yLjctMS4zLTMuMy0yLjMtLjcgMS0yIDIuMy0zLjQgMi4zUzEzLjQgMjIgMTIuNyAyMWMtLjYgMS0xLjkgMi4zLTMuMyAyLjMtLjMgMC0uNS0uMy0uNS0uNSAwLS4zLjItLjYuNS0uNiAxLjEgMCAyLjYtMS44IDIuOS0yLjRsLjUtLjIuNC4yYy40LjYgMS44IDIuNCAyLjkgMi40IDEuMSAwIDIuNS0xLjggMi45LTIuNGwuNC0uMi41LjJjLjQuNiAxLjggMi40IDIuOSAyLjQuMiAwIC41LjMuNS42IDAgLjItLjIuNS0uNS41ek05LjggMTYuN2MtLjMgMC0uNS0uMi0uNS0uNEw5LjEgMTVjMC0zLjkgMy4yLTcgNy03IDMuOSAwIDcgMy4xIDcgN2wtLjEgMS4yYzAgLjMtLjMuNS0uNi41LS40LS4xLS41LS4zLS40LS43di0xYzAtMy4zLTIuNi02LTUuOS02LTMuMiAwLTUuOSAyLjctNS45IDZsLjEgMWMuMS40LS4xLjctLjQuN2gtLjF6Ii8+PC9nPjxkZWZzPjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZF8xNzA4XzI4Mjk3IiB4PSI0LjkiIHk9IjYiIHdpZHRoPSIyMi40MzciIGhlaWdodD0iMjMuMzE5IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+PGZlT2Zmc2V0IGR5PSIyIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIvPjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjE3NTY5NCAwIDAgMCAwIDAuNTc0MTQyIDAgMCAwIDAgMC45MTY2NjcgMCAwIDAgMSAwIi8+PGZlQmxlbmQgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzE3MDhfMjgyOTciLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTcwOF8yODI5NyIgcmVzdWx0PSJzaGFwZSIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8xNzA4XzI4Mjk3IiB5MT0iNCIgeDI9IjI4Ljg4OSIgeTI9IjMyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzNFQTJGOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzY3QzhGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==",]
    , ["Phantom", "Phantom", "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPgo=",]
    , ["Martian Sui Wallet", "Martian Sui Wallet", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAQAAACXxM65AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfmCggLKh2D9S1hAAAVMUlEQVR42u1dZ3xUxd5+djc9dBDE0COCYKPGgFS9iIIYQUAFUcQLPwXBAnj96ZVrAV/fC3aKIioqIoqI6BWx0EEEpAkkF6QEAqFEQiAFks0+98Nuds/unr5nM5uQZ74ku1P+8+ycOTPzL2ODNYhCbSShOVqgES5HHVRHDKItqrs84UQxzuEMTuIoDuEwsnAGTisqtoVY3o66aI2OaI/WSEItxMIumiuL4MJF5CEb6diGrUhHDlyhVGeeaBvqoTP6oDuSUS3kHyyykY8D2IAV2ITToLkqzBEUjasxEP3RBvGiOShHXEA6/oOvsAcl5dFcNFIxF8fhAi/JlI0P0AOx4SXZgU54H6eFd1Z0OoOPkQJHuGhujGk4LryTkZJO4FU0s57kGAzC1kt2upBPLuzAEGsnkSS8gXPCOxaJ6TxmorFVNKdibdVYVkwubEC30Je3DtyDQ8I7E+npCO5HlBaRaojFY3gVDa16NCotaqI3nPhdbbOuRnQCnsY/UUN0LyoE4nAT4rEJxUoZlIlOwPOYjDjRPagwiEYKErBRiWolomMwCZPDvf+pZHCgI+zYgFL5L+Vgx6OYckmdY1gDBzqgAJtBua/kMBDTUVO01BUS0eiMw9gd/IUc0R0wG41ES1xhEYcO2IyswI+DiW6Ad9BZtLQVGrWQjJ9w3v/DQKIdeAYPVPJj/PCjKWxY5a+RCSS6L6YhQbScFR42tMVeZEg/8ie6Pt5Ca9FSVgrEoimWS6cPf6LHYWTVtGERkpCHtb5/pTrrq/H3SqPDFg8bRuE63792yRcPIFm0dJUKTTHSx6+P6La4V7RklQ6DcW3Znz6i70MT0XJVOiRhRNk7r4zoZhgoWqpKiTvLpuMyovuipWiZKiVaoJ/7DzfRiUirWm+EBTbciepAGdFt0VG0RJUW7dyLPDfRvVBXtDxWITHSlEK10BtwEx2PnqKlkaI2JuAJk8qdWLyA160ztLAGvVDN/UcrHBWusPemVlxCJ/N4p6nSA5lHci1vFN4PSTpRtpq+GyXChfGkbtxKN35jY8Olm3lLH+BgOoT3xpOcGOYmeqpwUQiCdt7NQ/ThNUYbKh/DtySl/+JTjBfeJ0+aAQBxWCZcEIIxHMscSpHLAYZqGMo8v/JFfIN1hfcLBLEcCcAV+EO4IKzOl5nPQGxlC901tOIfQeVLuYhNhfcNRDqaAO2RLVqQBpzLYsphDuN01VCNn1Ieq3idaJqJU0gB+iNfrBhXchlLFWgq5EO66hjPi1TCTvYQTXQRBgGjUSxSiI7cSDUcZCfNOroxS7WOQxxIm0iinZjgwO24RdRK3oY+eA/tVPPURhP8iAKVHEmY6Tv2lUUt9MJZ7ArNUTAU2LHNgTSkimndgaGYiRaa+VrAhjXyBm0A4vAiBmvWkYjuKMU2a5xgzWC3A4PQQUTLURiNGaivI6cN1yETuxS+HYFndflCx6Er4rAFF0V0FsgAPhIxa0VxfMCqVx0H2Fm2nlQeNlBLCWezjphZehEwX0TD9/CsAYJIciWTgmpJ4iqDtZTyczYQQrQdJn2bQ0M7w8aqvfA8Ev0+icdzJo4drxDkwuBAGm4o/2Z3IR+t3aoH3bgG5/Cbd1zY8AgmaXnoBOA4/h/P4Ej5dxfYI2iOBu3syu8U9oNKyOFd3vK38YShssX8lqm0i5mhiUXCiAbBmnxSY6sRiAx2IAhey12GymXxSdYS1k/hRIM2pnIFnQYoW8XGbMgfDJRwcjlTxe4MiUWC5mgfsvADLuJa3Q4zzdAEf0Oa7vpzMB3/wD6RXQSAPRFgZJCDFzEC23XmvogMZCq78/mB2IL78TL+Et1FAIKnDl9K5se8oDkNlPIdJjCB7yie9/lQxPfZTHi/yqaOiCEarMYnNFcSi3kZQfAyfqWR8zjHMUF4nyKSaNDOPvxdhbw1bO7N24JrVXJuZm/Rr79IJhoEW3IRS2TJ28kb/HK2U1jilXChARXYJUs0WJMvyBw4HWTPoJy9/LTmbpzlFNYU3odyJTqRrU3uxKJ5XwCFJzlINufdPOWX7wDvZZSpNm3sxkYVkehY/ou7eK3p8l0kKq48Pqww49o4WjL614dgoXQd93MJG1Y0oh18nIUkP9SpxZZLLbiITpKFnKgySqM4mUUkS/hZCIu5eM4nSX4SrvPq8BBt5xjPeXM+7wmhnjqcwXOcpvFjxXMac/lqSGcZw1hAknRyFqtXHKIH87T3cd4e0gqgNufqmH6u40zWCKGVFtzplbeYU0N4CsuV6FsDTuTeZozJmmwcyRx+zWTVXMlcxhw+aHrdHMtZfvIWcrLJF2q5Ep3KjIAF1zkOMVnXQJ4kSW5gR8U8nTwvzRMcaLKVYUHGaGf5d6u3O1YTfQ23yG41WpqoawCPemtIZx+ZrtvYV/KzHjVoFOlOV3OPjMQnTf9s5UJ0U/6ssCX+yPC5Qz8e8ashi/cGWDxHcTiP+eU5wn4GW0nkAgWJD1prSGYl0fX4JZVQxEcM1dVXZs93ho9JZvtYTuCZoDyH2NdAKzZOULHZ2xHCLiCMRFfjbLqojEym6q6rJ/+UrSOfLzLR09pLngVZIP6U2aorJS2bvZ9NeB2EmehovqCpaP1F576rR9Dr1IeLnMlarMVZKiMxQ+dDn8Q11MKnrB1JRNs4huc1hXbxTcaGRDNJOvkRP9HQMuqhOo4zNSUmnXxVh8zlRvTtzNYhNJnPUSHSTB7mEA6XrEfMUj2ahbpkLuBjVhgpWEF0W+7WJTJJZrJbSDT/l38jCPblvpCo7qH5U/lwimmRQHR1lbWGHNYrHv1o07xX8jN1517TVDfnr4Zk3qfDGD7sRA9VeS3JY77ssc2t3K9RbkfAuqWrjHuQHqprKPq7KGNFqOY3oRN9R8DGQhvFfDbI2fI2mXWzP35ju6C2U7hNcyz2CSgTxecVVGXKOMLHQz1oCp1oGztyqcFRncuhfnUMYKZGiY28Rrb1G7hZo+Qh3u5XYphBg+GLXMz2oZ98WLPqqMkJmlT54wC7eH+oOzWfCSWa3VT/pjkefWcg3TSfHH8c5Fhrzqet2rDY2InfG3okNzKZoJ33BpxXBGMd26q2fY2GXxd5hGm0EWyp+aNIUcylbGfVKZ6VZx11+E/Jgb82lrAxRwe4JQdjDVtrtqxNdTYfYBK/NiDdST5tpf2ptad3DvaVPSaVxznO09zo6KFZH9WH+ZaO3asbLm5kb2ttqa0/+G/OeSzS0ZlCvsQr+IbqZnq9Tpq1qXZyOhtwqi7JCjjbusOk8BENJnCs5rybxycZS7AOFyrmUXsFylO9SbGuz1ibYDwnafqCHeHoiqIzBG3sqbr3OsGHvLE4mvAnS2gGlRd7P3lHaDQf9qjHlJ6hm8Jjsxc+A5qm/EhhdX3QswbwjcRgw8bfTNDspnprUF2/+9Vl50AelJXrAuexSVi4CCvRYDVOlllT7JDZFt8UsP3eyfamW00J2Jjv501BeXpKzAvKkMNJrBYumsNt5OhgWsBBkVL0jDt43JtnL7uG1GpXyXHTcfaXzXM9V/vJlcG08MZgCr81aXuu9Ki4SvmFitHWCOaSJPexe8ht9uQBkmQuhyvmac7FHq8BF1fKnKNUOKLBRpzPEs0IR1GcwEIeNaRcVU538BgLOF51lNbjOyxmCT+2fjEnQ7Qx11NTyMI4FOAcpqhGFnBiNupiD36wpM1vkYjWmKMYfAIAcjAZFxGFZ5EffhIM+viaRB00Qh5q44RqrkQkIR9RlsTUiEZzJCFBw3urJq5ADOqUC9HlMHWkcD1JF5er7vMSOZOlzOMYC15KDj7Ccyzlm6pmO625nC6SazzeuOGdOsJMdBQHS2w0NivadsTyRc+q+0wI5oruZOMoz4v1AqcoGlh2kZzKZPDOcMd9DC/R1fiPAGui/ewvQ6OD4yXmMCcU3Cj0psESd4t8jpM5HLJxQICJzmk+GV5nuXAS3UR2b5jNB4OMYu8L+DmyQtA7pwVYH/0VZAofxYdk/BkvcG5F9GGxsSvXUx5nOdEvamgfGcOsLFOWocE0k+QRj4mCO8VzssLBkotrwuecHx6i4zhKVT1VxFe8FvodmS6bJ9OwZWiwBWoZ9ni39DX4f6pHpZl8yBrLpPIguiHfVjBA9KGE77EewWRuUOm0Mar7qegt17EZwXqcq6luy+dbvCLyibaxC1erWpWWoZSL2IlLVPMYofpmDbXrYnbhIh2u+qSLq60/LLWW6ESONWBqVcDlmhpDvVT30jQR28fZMvF8lZDFcdae5VlJ9FW6AkGUoZQzeBkHyDo2GKX6Fk2ad7M7E/iGrhHtxgUuMKBIKzeiYzlE00DLH196XCc7aKpVtajupxlkcIsnPGFdLjYk4x7ea9Wr0RqiW3C2bg2zG79KXNraKC4EfVQPUJwz+2ma7qyXaFiuNGTZQeZztobzXbkRHcch3KHr9efD4QCthzbVSluYNE0rp/Vs41eim6EgmyT5h2lHfguJTuCbBl4xbuTx/qB6zFBt412awdzWBNAMgiMMRUUlyWMmNZgWEh3N1w0K7eRLsuOjDddpUj1YMoHYOVTTqGEVr5KVeaqhAHDk8tBd8UOfOupzmSGhv1R0v9Ee1Sf5kOeUzcGHNc3P5GkGwdqGXooZVhyjWvEybGXADGybYuf1UX2GY+hgFB+R8THUS7Nb5u06Jc5WUO8KIBrspmApETwitTSC2hNIHh/nJM01jjrNIHh7QOwapdZGWbNHXGRJgMF1eFpHEL9i/Bs/auTZizFYr5rDgQTEa1y+uBpjNGM3/oDpKNGUeDrmw6q4z5ZsWOx+R/fy+FSnSbfaBHKG4xjNGI736FDksFZzNLtTDX6mKm8pZ3n8dCNm6gDBWE5V9Z3dobP7alQf4zDPyzCKwyUmN1Ksl1nQKaVWMhZLPnzpCWYYYUSDNThPceNyxuC1eXJz9T7eJpkvbewv48e1zgDNIJim+GSssjbcprWndw34jcJDONXw3iqQ6i0yEcC6Bpg0btJwwghOUZwme9C03eqLn6w+j06Wfeh/ZH0TdbXxmv66+AOvls3Tlj96W9llar3bgL8EyfunjGFkhBEtF8jyuGlruk5MJ1nCT2RurChLjbmATpJ7vH5eRlOPAAcPi1bO4SYa7Om3qnby6RBWooN4SjPQWi2+zn0GonQEJhufkWzJ/+L94VDQhkc5myYZIytCuryxFVcqTBrS1JGf8fIQWqnrnYDOc0J4TGnC5VrxoOdtnh2SEe5VXMpSLtD4qeryc5byGwPLx+DUiydJXuCzpkPHCSEadHAcz5N8KQQnsu6eNUUp56jo72rwPc+6YXMIrzA7p/EiXw2ftVL4LJVi+Bx/Nm37E83hEs1JMV9W8JSK5yuSbdJhDjN9RN+Io0KKBimMaDDe9LxZk/8KOJwv5BMyc2cUJwWYw5zllHDSFZlEm03JXChj5pIbpJexcaSMrqSYCyIvHnrkEW1jL8XAEMcDAkL0V3Rw3sSekRXhP9KIjuejquqp/zLFmzdVNWLNMT4SOdevRxrRjfmuZuSuTZ5FXCtNs4FCzikPJ6CKRrSdPbhBl9HCMtZnfX6nI6eLG9hT3H1vAUQLvysLAKpjLF5DG9h05L0KDdAXg3TktaExboULu3Ve+BRWRMJdWW3wPl5BQ525XTiN07ovnm6IVzAXbUR3EYDgqSOOIzSj3fnjU9ZkLQ0lVCDSeb/oV6PYObol39PUNPpjLZsSBJtpasv9UcAP2OrSJDqBD2qa7AZiv+TS6hSF0MfK2MMR4q4pE0O0jTdwoc4grD7kcrBfLUNVNOHyKORCgzpF64gW8jJsiwW4R/ednG6UYDqW+H3yFV4z6M4cj/5oJ6LDAOy61lQW4yC+xgWDZRbh7QAXeifexBeG6jiL5/Bl+XfXAyFzdBynGJo6NkluMpSmZAN2f6c4MtyOyKpz9Ltimo7jU7qjhB5jb8V6btEZJDyTQ0TuEj92oDdSRTxITmzBadyIRM2cFzBFZYo4BCd6aUbDyMCjWAarrOhMYKMduaLad2IeHsVRzXwLMU9FRGIuPteoYSse1DSvDDNygTEoFvZAEbxZI7L5ZoXZWZqSZYKw+fCTDj16mJMTE4D+yBcrRkeVYISneZuuOm5XcA11cmE4YxboTYUYBLRHtmhBWvI72SNSJ5/XuU5wcIqMDd0FvhmuiyCNpVNIARpip3BB2JAfyugJvzdAUz1+H1A6j89Eys3g6WgMxGGZcEEI1uArAQdMmQZvkL3Rzw/9OEdafyuh2bQcCQAwTbggBMFYjpd4WhVzguEanvI+FXt5aySpZ6e7lx53i113+JKdd3lVrt+YuN27Nr8l6eKqEGKbhiE5cZ+b6FbIEi6MN6VwA8ljBu6Kk6ZUHuCHkbDOkKZsXOMmOh7LhQsjSc34ASeafPCjeH3kWSr9gmruSI5FWIm+YjdOUhzGWBDmtqtO7BQtfjBWIx8eh72VyBEtjRRFhg9RIxi5+BkoIzodW0TLU2mxHbuBMqILsVS3Br8KRkAsxXkAXl/fFdgvWqZKiYNY7v6jjOhMLBYtU6XEUhxw/+FTzn6BLNFSVTqcwMKy5ZOP6N0GNZ1V0MZi7Cj700e0C3Pxp2jJKhUO412f4l5q15GB96rWHpaBmOde2Lnhb0AzXyMqSRX0YxPmSf91+H1ZgFO4zaAJURXkcBYT8bv0A0dAhkOoga4irJcqFYhZmOM/DQcS7cIfuB5Xipa0gmM1JiLP/yNHUKYCpKMX6oqWtQLjIB5FRuCHDpmM2cjCzW4tVxUMIxdPYkXwxw7ZzPtQiB6IES1zBUQhXsCHcofp8kQTO1CKruVzwVMlQjGmY4Z8OD2HQpFSbEUMOldRbQAleAcvo0j+S4diMSd+RQlSqiYQnSjCDLykfL+ZQ6VoCTYhH52qNjA6kIcX8G+l0awHDgzFQeF65EhPmRhuxSR7I1bDJbwzkZpcWK9nL+3QQXQWfoQDbRFr4aNWWZCP9/E49lhXYQzuxlaUCh8/kZRc2I6heoefnhENAKXYi+9RhCtRvdxHTWTiBGZhIjaoXmtrGg50wFycFj6WRKfTmIcU3YPUJGLQBXNw7JJ9PWbjfXQxvrswd/IchatxF+5A20tqjV2EdHyHJdirGbNeBuaP+G2oi87og+64EtUqtaqAyMcBrMMKbEYOTDoLhkqQHXXQGh3QAa2RhFqIDffMVW4oRTHO4hgysA1bkYG/QlNcWzUSHaiNJDRFCzTG5aiD6hV21V2Mc8hFNo4iE4eQhbOW3AiP/wG6DlacWachvgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMC0wOFQxMTo0MjoyOSswMDowMBew0pkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTAtMDhUMTE6NDI6MjkrMDA6MDBm7WolAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC"]
    , ["Backpack", "Backpack", "/backpack.png"]
    , ["Slush", "Slush", "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjNENBMkZGIi8+CjxwYXRoIGQ9Ik0xMi4zNDczIDM0LjcyNTRDMTMuNTU1MyAzOS4yMzM2IDE4LjA2NzMgNDMuMzE0OCAyNy40MDI1IDQwLjgxMzRDMzYuMzA5NyAzOC40MjY3IDQxLjg5MjEgMzEuMDk5MyA0MC40NDQ2IDI1LjY5NzJDMzkuOTQ0NyAyMy44MzE3IDM4LjQzOTEgMjIuNTY4OSAzNi4xMTc4IDIyLjc3NDRMMTUuMzYxNSAyNC41MDM4QzE0LjA1NDQgMjQuNjA0MSAxMy40NTUgMjQuMzg5OCAxMy4xMDkyIDIzLjU2NjFDMTIuNzczOCAyMi43ODEyIDEyLjk2NDkgMjEuOTM4NSAxNC41NDM3IDIxLjE0MDZMMzAuMzM5NiAxMy4wMzQyQzMxLjU1MDMgMTIuNDE4MiAzMi4zNTY3IDEyLjE2MDUgMzMuMDkzNiAxMi40MjEzQzMzLjU1NTUgMTIuNTg5MSAzMy44NTk2IDEzLjI1NzQgMzMuNTgwMyAxNC4wODJMMzIuNTU2MSAxNy4xMDU2QzMxLjI5OTIgMjAuODE2NCAzMy45ODk5IDIxLjY3ODQgMzUuNTA2OCAyMS4yNzE5QzM3LjgwMTcgMjAuNjU3IDM4LjM0MTYgMTguNDcxMiAzNy42MDIzIDE1LjcxMTlDMzUuNzI3OCA4LjcxNjI5IDI4LjMwNTkgNy42MjI1NCAyMS41NzY4IDkuNDI1NTlDMTQuNzMxMSAxMS4yNTk5IDguNzk2ODEgMTYuODA3MiAxMC42MDg4IDIzLjU2OTZDMTEuMDM1OCAyNS4xNjMgMTIuNTAyNSAyNi40MzYyIDE0LjIwMTQgMjYuMzk3NUwxNi43OTUgMjYuMzkxMkMxNy4zMjg0IDI2LjM3ODggMTcuMTM2MyAyNi40MjI3IDE4LjE2NTMgMjYuMzM3NEMxOS4xOTQ0IDI2LjI1MjIgMjEuOTQyNSAyNS45MTQgMjEuOTQyNSAyNS45MTRMMzUuNDI3NSAyNC4zODhMMzUuNzc1IDI0LjMzNzVDMzYuNTYzNyAyNC4yMDMgMzcuMTU5NyAyNC40MDc5IDM3LjY2MzYgMjUuMjc2QzM4LjQxNzcgMjYuNTc1IDM3LjI2NzIgMjcuNTU0NiAzNS44ODk5IDI4LjcyNzJDMzUuODUzIDI4Ljc1ODYgMzUuODE2IDI4Ljc5MDEgMzUuNzc4OSAyOC44MjE4TDIzLjkyNSAzOS4wMzc3QzIxLjg5MzMgNDAuNzkwMSAyMC40NjYgNDAuMTMxMSAxOS45NjYyIDM4LjI2NTZMMTguMTk1OCAzMS42NTg3QzE3Ljc1ODUgMzAuMDI2NCAxNi4xNjQ2IDI4Ljc0NTYgMTQuMjk3NiAyOS4yNDU5QzExLjk2MzggMjkuODcxMiAxMS43NzQ2IDMyLjU4NzggMTIuMzQ3MyAzNC43MjU0WiIgZmlsbD0iIzA2MEQxNCIvPgo8L3N2Zz4K",]
]

const WalletConnectModal = ({ connectWallet }: any) => {
    const { isModalOpen, closeWalletConnect } = useContext(WalletConnectContext)

    return (
        <AnimatePresence>
            {isModalOpen && (

                <S.Modal>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        style={{ display: "flex", width: "100%" }}
                    >
                        <S.Overlay onClick={closeWalletConnect}></S.Overlay>
                        <S.Dialog>
                            <S.DialogHeader>
                                <S.DialogTitle>CONNECT YOUR WALLET</S.DialogTitle>
                                <S.CloseButton onClick={closeWalletConnect}>&times;</S.CloseButton>
                            </S.DialogHeader>
                            <S.DialogBody>
                                {wallets.map(([name, label, icon]) => (
                                    <S.Wallet key={name} onClick={() => connectWallet(name)}>
                                        <S.WalletInfo>
                                            <S.WalletIcon src={icon} />
                                            <S.WalletName>{label}</S.WalletName>
                                        </S.WalletInfo>
                                        <IconArrowRight />
                                    </S.Wallet>
                                ))}
                            </S.DialogBody>
                        </S.Dialog>
                    </motion.div>
                </S.Modal>

            )}
        </AnimatePresence>
    )
}

const useWalletConnect = () => {
    const { isModalOpen, openWalletConnect, closeWalletConnect, disconnectWallet, } = useContext(WalletConnectContext)
    return { isModalOpen, openWalletConnect, closeWalletConnect, disconnectWallet, }
}


export { WalletConnectProvider, useWalletConnect }