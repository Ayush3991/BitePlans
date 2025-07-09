const admin = require('firebase-admin');

// Load account credentials from JSON file
const serviceAccount = require('../firebase-service-account.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Use service account for server-side authentication
});

module.exports = admin;
