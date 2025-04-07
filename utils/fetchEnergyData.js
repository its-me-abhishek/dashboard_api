import axios from 'axios';

// Default configuration
const ENERGY_ZONES = [
    "AT", "BE", "CH", "CZ", "DE-LU", "DK1", "DK2",
    "FR", "HU", "NL", "PL", "SE4", "SI"
];

async function fetchEnergyPrices(baseUrl) {
    const energyPrices = {};

    await Promise.all(
        ENERGY_ZONES.map(async (zone) => {
            try {
                const response = await axios.get(`${baseUrl}?bzn=${zone}`, {
                    headers: { Accept: "application/json" },
                    timeout: 5000 // 5 second timeout
                });

                if (response.data?.price !== undefined) {
                    energyPrices[zone] = response.data.price;
                } else {
                    console.warn(`Invalid response format for zone ${zone}`);
                    energyPrices[zone] = null;
                }
            } catch (error) {
                console.error(`Error fetching energy price for ${zone}:`, baseUrl, error.message);
                energyPrices[zone] = null;
            }
        })
    );

    return energyPrices;
}

export default fetchEnergyPrices;