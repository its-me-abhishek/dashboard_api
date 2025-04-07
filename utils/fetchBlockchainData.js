import axios from 'axios';

// Fetch blockchain state using Bitcoin JSON-RPC
async function fetchBlockchainData(BITCOIN_RPC_URL) {
    const rpcPayload = {
        jsonrpc: "2.0",
        id: 1,
        method: "getblockchaininfo",
    };

    try {
        const response = await axios.post(BITCOIN_RPC_URL, rpcPayload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data.result;
    } catch (error) {
        console.error("Error fetching blockchain data:", error.message);
        return null;
    }
}

export default fetchBlockchainData;