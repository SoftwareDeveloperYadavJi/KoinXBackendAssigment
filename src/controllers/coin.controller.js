

export const stats =  async (req, res) => {
  const { coin } = req.query;

  // Validate the query parameter
  if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin parameter' });
  }

  try {
    // Fetch the latest data for the requested coin
    const latestData = await Crypto.findOne({ coin }).sort({ date: -1 });

    // If no data is found, return an error
    if (!latestData) {
      return res.status(404).json({ error: 'No data found for the requested coin' });
    }

    // Return the latest data
    return res.json({
      price: latestData.price,
      marketCap: latestData.market_cap,
      "24hChange": latestData.change_24h
    });
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


const calculateStandardDeviation = (prices) => {
  const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;
  const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length;
  return Math.sqrt(variance);
};

 export const deviation = async (req, res) => {
  const { coin } = req.query;

  // Validate the query parameter
  if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin parameter' });
  }

  try {
    // Fetch the last 100 records for the specified coin
    const records = await Crypto.find({ coin }).sort({ date: -1 }).limit(100);

    // If no data is found, return an error
    if (records.length === 0) {
      return res.status(404).json({ error: 'No data found for the requested coin' });
    }

    // Extract the prices from the records
    const prices = records.map(record => record.price);

    // Calculate the standard deviation of the prices
    const deviation = calculateStandardDeviation(prices);

    // Return the standard deviation in the response
    return res.json({ deviation: deviation.toFixed(2) });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};