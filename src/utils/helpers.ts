import BigNumber from "bignumber.js";
import axios from "axios";

export const shortenPublicKey = (publicKey: string, len: number=5) => {
    if (!publicKey) return publicKey; 
    try {
        return publicKey.slice(0, len) + "..." + publicKey.slice(-len);
    } catch (e) {
        return publicKey;
    }
}

export const formatNumber = (number:number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0, 
        maximumFractionDigits: 20, 
    });

    return formatter.format(number);
}

export const formatBigNumber = (value: BigNumber.Value): string => {
    const big = new BigNumber(value);

    const strValue = big.toFixed(20).replace(/\.?0+$/, '');

    const [intPart, decimalPart] = strValue.split('.');

    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
};

export const verifyTransaction = async (rpc: string, digest: string) => {
    let found = false;

    let maxRetries = 10;
    let retries = 0;

    while (!found && retries < maxRetries) {
        try {
            const res = await axios.post(rpc, {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "sui_getTransactionBlock",
                "params": [
                    digest,
                ]
            });

            if (res.data.error) {
                retries++;
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                continue;
            }

            found = true;
            return res.data.result;

        } catch (error) {
            retries++;
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
    }
    throw new Error(`Transaction with digest ${digest} not found after ${maxRetries} retries.`);
}