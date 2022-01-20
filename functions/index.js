//Express js setup
const express = require("express");
const app = express();
const router = require("./routes/routes.js");

//Firebase setup
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

//Routage API (import depuis routes.js)
app.use(router(db));

//Export de sur firestore
exports.api = functions.region("europe-west3").https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
