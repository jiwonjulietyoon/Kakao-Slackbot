const functions = require('firebase-functions');
const request = require("request");

exports.notifyNewQuestion = functions.firestore
    .document('/questions/{questionID}')
    .onCreate((snap, context) => {
        const newValue = snap.data();
        const question = newValue.question;
        return request.post(
            "[Slack Webhook URL]",
            {json: {text: `<@Bot_ID> ${question}`}}
        );
    });
