import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import fetchBitcoinPrices from "./utils/fetchBitcoinPrices.js";
import fetchEnergyPricesForAllCountries from './utils/fetchEnergyData.js';
import fetchMiningData from './utils/fetchMiningData.js';
import fetchBlockchainData from './utils/fetchBlockchainData.js';

dotenv.config();

const wss = new WebSocketServer({ port: 5000 });

const BITCOIN_RPC_URL = process.env.BITCOIN_RPC_URL;
const MEMPOOL_API_URL = process.env.MEMPOOL_API_URL;
const BITCOIN_PRICE_URL = process.env.BITCOIN_PRICE_URL;
const BITCOIN_PRICE_URL_SUFFIX = process.env.BITCOIN_PRICE_URL_SUFFIX;
const ENERGY_API_URL = process.env.ENERGY_API_URL;

// Send combined data to all connected WebSocket clients
async function sendDataToClients() {
  const blockchainData = await fetchBlockchainData(BITCOIN_RPC_URL);
  const miningData = await fetchMiningData(MEMPOOL_API_URL);
  const bitcoinPrice = await fetchBitcoinPrices(BITCOIN_PRICE_URL, BITCOIN_PRICE_URL_SUFFIX);
  const energyPrices = await fetchEnergyPricesForAllCountries(ENERGY_API_URL);

  if (blockchainData && miningData && bitcoinPrice && energyPrices) {
    const data = {
      type: "blockchain_update",
      data: {
        blocks: blockchainData.blocks,
        bestblockhash: blockchainData.bestblockhash,
        difficulty: blockchainData.difficulty,
        verificationprogress: blockchainData.verificationprogress,
        chain: blockchainData.chain,
        mediantime: blockchainData.mediantime,
        mining_difficulty_change: miningData.difficultyChange,
        estimated_hashrate: miningData.estimatedHashrate,
        price: bitcoinPrice,
        energy_prices: energyPrices,
        time: new Date().toLocaleString(),
      },
    };

    console.log("Broadcasting update:", data);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

// Fetch and send every 10 seconds
setInterval(sendDataToClients, 10000);

// WebSocket connection handler
wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.send(JSON.stringify({ type: "connection", status: "connected" }));
});

console.log("WebSocket server running on ws://localhost:5000");