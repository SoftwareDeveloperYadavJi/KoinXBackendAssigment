import express from 'express';
import dotenv from 'dotenv';
import connectDB from './DB/index.js';
import coinRouter from './routes/coin.router.js';
import fetchCryptoData from './services/fetchCryptoData.js';
import storeCryptoData from './services/storeCryptoData.js';
import cron from 'node-cron';

dotenv.config();

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Cron job to run every 2 hours (0 */2 * * *)
cron.schedule('0 */2 * * *', async () => {
  console.log('Fetching crypto data...');
  const cryptoData = await fetchCryptoData();

  if (cryptoData) {
    console.log('Storing crypto data...');
    await storeCryptoData(cryptoData);
  }
  console.log('Job completed.');
});




// for testing 
// cron.schedule('* * * * *', async () => {
//   console.log('Fetching crypto data...');
//   const cryptoData = await fetchCryptoData();

//   if (cryptoData) {
//     console.log('Storing crypto data...');
//     await storeCryptoData(cryptoData);
//   }
//   console.log('Job completed.');
// });



app.get("/healthchek", (req, res) => res.send("Healthy"));

app.use('/', coinRouter);



app.listen(3000, async () => {
    try {
        await connectDB();
        console.log('Server started on port 3000');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }    
});