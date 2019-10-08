const functions = require('firebase-functions');
const request = require("request");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.notifyNewQuestion = functions.firestore
    .document('/questions/{questionID}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        const question = newValue.question;
        return request.post(
            "https://hooks.slack.com/services/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",
            {json: {text: `<@UMJKG46TG> ${question}`}}
        );
    });
