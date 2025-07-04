// backend/firebase-admin.cjs
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://techtracknative-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

module.exports = { db };
