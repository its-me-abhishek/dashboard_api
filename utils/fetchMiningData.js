import axios from 'axios';

// Fetch mining-related data from Mempool API
async function fetchMiningData(MEMPOOL_API_URL) {
    try {
        const response = await axios.get(`${MEMPOOL_API_URL}/difficulty-adjustment`);
        return response.data;
    } catch (error) {
        console.error("Error fetching mining data:", MEMPOOL_API_URL, error.message);
        return null;
    }
}

export default fetchMiningData;