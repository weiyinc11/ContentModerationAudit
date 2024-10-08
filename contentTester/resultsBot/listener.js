const express = require("express");
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;
const crypto = require("crypto");
const twitchSigningSecret = process.env.TWITCH_SIGNING_SECRET;
let count = 0;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const verifyTwitchSignature = (req, res, buf, encoding) => {
    const messageId = req.header("Twitch-Eventsub-Message-Id");
    const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
    const messageSignature = req.header("Twitch-Eventsub-Message-Signature");
    const time = Math.floor(new Date().getTime() / 1000);
    console.log(`Message ${messageId} Signature: `, messageSignature);
  
    if (Math.abs(time - timestamp) > 600) {
      // needs to be < 10 minutes
      console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
      throw new Error("Ignore this request.");
    }
  
    if (!twitchSigningSecret) {
      console.log(`Twitch signing secret is empty.`);
      throw new Error("Twitch signing secret is empty.");
    }
  
    const computedSignature =
      "sha256=" +
      crypto
        .createHmac("sha256", twitchSigningSecret)
        .update(messageId + timestamp + buf)
        .digest("hex");
    console.log(`Message ${messageId} Computed Signature: `, computedSignature);
  
    if (messageSignature !== computedSignature) {
      throw new Error("Invalid signature.");
    } else {
      console.log("Verification successful");
    }
  };
  
  app.use(express.json({ verify: verifyTwitchSignature }));

let json_dump = [];

app.post("/webhooks/callback", async (req, res) => {
    const messageType = req.header("Twitch-Eventsub-Message-Type");
    if (messageType === "webhook_callback_verification") {
      console.log("Verifying Webhook");
      return res.status(200).send(req.body.challenge);
    }
  
    const { type } = req.body.subscription;
    const { event } = req.body;
  
    console.log(
      `Receiving ${type} request for ${event.broadcaster_user_name}: `,
      event
    );
    json_dump.push(event);

    console.log(event.message['text'] == 'done');

    if (event.message['text'] == 'done') {
        fs.writeFileSync("../results"+'/result'+count+'.json', JSON.stringify(json_dump));
        count++;
    }
  
    res.status(200).end();
  });



//   twitch event trigger subscribe -F http://localhost:8080/webhooks/callback -s purplemonkeydishwasher

// access token: vc6sumcbsif0wpc28fpm51u7313r7l

// curl -X GET 'https://api.twitch.tv/helix/eventsub/subscriptions' \
// -H 'Authorization: Bearer lj89utsefg9lfmandi2mmoijq6hui4' \
// -H 'Client-Id: jx7xc70s2hqd5qwdc9q3bsoz14yq5v'

// curl -X DELETE 'https://api.twitch.tv/helix/eventsub/subscriptions?id=6fee3be5-8c2a-4d3f-85c1-1daefd322eee' \
// -H 'Authorization: Bearer vc6sumcbsif0wpc28fpm51u7313r7l' \
// -H 'Client-Id: 52q9nyo1zjyi5qt2u0al093ol812dm'


// curl -X POST 'https://api.twitch.tv/helix/moderation/enforcements/status?broadcaster_id=1109317124' \
// -H 'Authorization: Bearer qyfomgadk5iucvf6vtlwtu0s2igio6' \
// -H 'Client-Id: 52q9nyo1zjyi5qt2u0al093ol812dm' \
// -H 'Content-Type: application/json' \
// -d '{
//   "data": [
//     {
//       "msg_id": "53c58cf0-1838-497a-a586-34a76d21e435",
//       "msg_text": "pieceofSHITE"
//     }, 
//     {
//       "msg_id": "b4bebd99-8e6e-4a48-b13c-2ddfdac8a6dc",
//       "msg_text" : "bitches"
//     }
//   ]
// }'