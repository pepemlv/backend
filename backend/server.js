import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);
const PORT = process.env.PORT || 4000;

// ✅ CORS: allow your domain + handle preflight
app.use(cors({
  origin: 'https://pmsstreaming.com',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors()); // ✅ Allow preflight for all routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory store for Kelpay payment statuses
const paymentStatus = {};

// --- Health Check Route ---
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

// --- Stripe Payment Route ---
app.post('/payment', async (req, res) => {
  const { amount, id } = req.body;

  if (!amount || !id) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Movie purchased via card',
      payment_method: id,
      confirm: true,
    });

    res.status(200).json({ success: true, message: 'Payment successful' });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ success: false, message: 'Payment failed' });
  }
});

// --- Kelpay: Initiate Mobile Money Payment ---
app.post('/api/kelpay-pay', async (req, res) => {
  const { mobilenumber, amount } = req.body;
  const reference = 'REF' + Date.now();

  if (!mobilenumber || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await axios.post(
      process.env.KELPAY_URL,
      {
        merchantcode: process.env.MERCHANT_CODE,
        mobilenumber,
        reference,
        amount,
        currency: "USD",
        description: "Payment via KELPAY",
        callbackurl: `${process.env.CALLBACK_URL}/kelpay-callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.KELPAY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const transactionid = response.data.transactionid;
    paymentStatus[reference] = { ...response.data, transactionid };

    res.status(200).json({ request: response.data, reference, transactionid });
  } catch (error) {
    console.error("Kelpay error:", error.message);
    res.status(500).json({ error: "Kelpay request failed" });
  }
});

// --- Kelpay Webhook Callback ---
app.post('/kelpay-callback', (req, res) => {
  const result = req.body;
  console.log("Kelpay callback received:", result);

  if (result?.reference) {
    paymentStatus[result.reference] = result;
  }

  res.status(200).send("OK");
});

// --- Check Kelpay Payment Status ---
app.get('/api/kelpay-status/:reference', (req, res) => {
  const reference = req.params.reference;
  const result = paymentStatus[reference];

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(200).json({ status: 'PENDING' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
