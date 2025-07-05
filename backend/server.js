import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import https from 'https';

// Import Mux SDK
import Mux from '@mux/mux-node';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);
const PORT = process.env.PORT || 4000;

// Init Mux client
const { Video } = new Mux({
  accessToken: process.env.MUX_ACCESS_TOKEN,
  secret: process.env.MUX_SECRET_KEY,
});

// Middleware
app.use(cors({
  origin: ['https://pmsstreaming.com', 'http://localhost:3000'], // Autoriser les deux domaines
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- In-memory stores (à remplacer par base de données) ---
const paymentStatus = {};
const liveStreams = {}; // Stockage des lives créés

// --- Health check ---
app.get('/', (req, res) => {
  res.send('✅ Backend is running');
});

// --- Stripe Payment ---
app.post('/payment', async (req, res) => {
  const { amount, id } = req.body;

  if (!amount || !id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Movie purchased via card',
      payment_method: id,
      confirm: true,
    });

    res.status(200).json({ success: true, message: 'Payment successful' });
  } catch (error) {
    console.error('❌ Stripe error:', error.message);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
});

// --- Kelpay initiate payment ---
app.post('/api/kelpay-pay', async (req, res) => {
  const { mobilenumber, amount } = req.body;
  const reference = 'REF' + Date.now();

  if (!mobilenumber || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const response = await axios.post(
      process.env.KELPAY_URL,
      {
        merchantcode: process.env.MERCHANT_CODE,
        mobilenumber,
        reference,
        amount,
        currency: 'USD',
        description: 'Payment via KELPAY',
        callbackurl: `${process.env.CALLBACK_URL}/kelpay-callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.KELPAY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        httpsAgent,
        timeout: 15000,
      }
    );

    const transactionid = response.data.transactionid;
    if (!transactionid) {
      throw new Error('Missing transaction ID from Kelpay response');
    }

    paymentStatus[reference] = {
      ...response.data,
      transactionid,
      status: 'PENDING',
    };

    res.status(200).json({ request: response.data, reference, transactionid });
  } catch (error) {
    if (error.response) {
      console.error('❌ Kelpay response error:', error.response.data);
      res.status(500).json({
        error: 'Kelpay API error',
        details: error.response.data,
      });
    } else {
      console.error('❌ Kelpay setup/network error:', error.message);
      res.status(500).json({ error: 'Kelpay request failed', message: error.message });
    }
  }
});

// --- Kelpay Callback Webhook ---
app.post('/kelpay-callback', (req, res) => {
  const result = req.body;
  console.log('📡 Kelpay callback received:', result);

  if (result?.reference) {
    paymentStatus[result.reference] = {
      ...paymentStatus[result.reference],
      ...result,
      status:
        result.code === '0'
          ? 'CONFIRMED'
          : result.code === '1'
          ? 'FAILED'
          : result.status || 'UNKNOWN',
    };

    console.log(`✅ Updated status for ${result.reference}: ${paymentStatus[result.reference].status}`);
  } else {
    console.warn('⚠️ Callback missing reference:', result);
  }

  res.status(200).send('OK');
});

// --- Check Kelpay Status ---
app.get('/api/kelpay-status/:reference', (req, res) => {
  const reference = req.params.reference;
  const result = paymentStatus[reference];

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(200).json({ status: 'PENDING' });
  }
});

// --- Mux Live Stream Creation ---
app.post('/api/mux/create-live', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Missing live stream title' });
    }

    // Crée un live stream sur Mux
    const liveStream = await Video.LiveStreams.create({
      playback_policy: 'public',
      new_asset_settings: { playback_policy: 'public' },
      reconnect_window: 60,
    });

    // Stockage en mémoire (à remplacer par base de données)
    liveStreams[liveStream.id] = {
      id: liveStream.id,
      title,
      playbackId: liveStream.playback_ids[0].id,
      streamKey: liveStream.stream_key,
      status: 'created',
      createdAt: new Date(),
    };

    res.status(201).json({
      message: 'Live stream created',
      liveStream: liveStreams[liveStream.id],
    });
  } catch (error) {
    console.error('❌ Mux live creation error:', error);
    res.status(500).json({ error: 'Failed to create live stream' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
