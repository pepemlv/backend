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

// CORS : autoriser uniquement ton domaine en production
app.use(cors({
  origin: 'https://pmsstreaming.com',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory store pour suivre le statut Kelpay
const paymentStatus = {};

// --- STRIPE ---
app.post('/payment', async (req, res) => {
  const { amount, id } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Movie purchased via card',
      payment_method: id,
      confirm: true,
    });
    res.json({ success: true, message: 'Payment successful' });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.json({ success: false, message: 'Payment failed' });
  }
});

// --- KELPAY : initier paiement Mobile Money ---
app.post('/api/kelpay-pay', async (req, res) => {
  const { mobilenumber, amount } = req.body;
  const reference = 'REF' + Date.now();

  try {
    const response = await axios.post(
      "https://pay.keccel.com/kelpay/v1/payment.asp",
      {
        merchantcode: process.env.MERCHANT_CODE,
        mobilenumber,
        reference,
        amount,
        currency: "USD",
        description: "Payment via KELPAY",
        callbackurl: process.env.CALLBACK_URL, // https://pmsstreaming.com/kelpay-callback
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
    res.json({ request: response.data, reference, transactionid });
  } catch (error) {
    console.error("Kelpay error:", error.message);
    res.status(500).json({ error: "Kelpay request failed" });
  }
});

// --- KELPAY callback (webhook) ---
app.post('/kelpay-callback', (req, res) => {
  const result = req.body;
  console.log("KELPAY callback received:", result);
  paymentStatus[result.reference] = result;
  res.status(200).send("OK");
});

// --- Vérifier le statut d'un paiement Mobile Money ---
app.get('/api/kelpay-status/:reference', (req, res) => {
  const reference = req.params.reference;
  const result = paymentStatus[reference];
  if (result) {
    res.json(result);
  } else {
    res.json({ status: 'PENDING' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
