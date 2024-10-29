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
      return res.set('Content-Type', 'text/plain').status(200).send(req.body.challenge);
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



/* 1a. Make the user access token with the right scopes
    // Homelander's Account
    // User Homeland3r1's id: 1112905523
    // Client id - qc3erad82kt9qk1g6ipyr8hgm6pc81
    // Client Secret - gjdmpg1qmswtgszrg7uh7428flgdx6
    // Homelander
    https://id.twitch.tv/oauth2/authorize
    ?response_type=code
    &client_id=qc3erad82kt9qk1g6ipyr8hgm6pc81
    &redirect_uri=https://localhost:3000
    &scope=user%3Aread%3Achat+user%3Abot+channel%3Abot

     1b. Use the result URL of the above to grab a code as such:
    https://localhost:3000/?code=ufasnd4vwq7li0fermlgqprdy3c17o&scope=user%3Aread%3Achat+user%3Abot+channel%3Abot

    // Homelander
    curl -X POST 'https://id.twitch.tv/oauth2/token' \
         -H 'Content-Type: application/x-www-form-urlencoded' \
         -d 'client_id=qc3erad82kt9qk1g6ipyr8hgm6pc81&client_secret=gjdmpg1qmswtgszrg7uh7428flgdx6&code=ufasnd4vwq7li0fermlgqprdy3c17o&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    1c. The result is a json with the access token! Don't need to store this. Just need to make sure that all accounts have an access token with the correct scopes for your subscription. 

    {"access_token":"g2uv9fomyed9qkz8ilmt926bksmqrl","expires_in":14725,"refresh_token":"jz5pjsbxbwtbjr0ogb7pqxhm7zxoeezph58cyxan3qyfg91484","scope":["channel:bot","user:bot","user:read:chat"],"token_type":"bearer"}

    1d. Repeat for other
    // Hughie's Account
    // User hughierin's id: 1135845304
    // User hughierin's client_id: lfll6gbhayfwmfvmuw88n4r539kadm
    // User hughierin's client_secret: lpo8hfdceb5fsct6cypioj7qw23mf9


    https://id.twitch.tv/oauth2/authorize
    ?response_type=code
    &client_id=lfll6gbhayfwmfvmuw88n4r539kadm
    &redirect_uri=https://localhost:3000
    &scope=channel%3Abot+user%3Aread%3Achat+user%3Abot

    https://localhost:3000/?code=z8mu526yjk1hdmynjapnfrip0hov5j&scope=channel%3Abot+user%3Aread%3Achat+user%3Abot

    curl -X POST 'https://id.twitch.tv/oauth2/token' \
         -H 'Content-Type: application/x-www-form-urlencoded' \
         -d 'client_id=lfll6gbhayfwmfvmuw88n4r539kadm&client_secret=lpo8hfdceb5fsct6cypioj7qw23mf9&code=z8mu526yjk1hdmynjapnfrip0hov5j&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    {"access_token":"pqg81p9twpphyku4dqrawxx73uq3ms","expires_in":14038,"refresh_token":"9vhup8y2respwu58fhffezqxdfuu8dxil8u79loldqnmd6ulox","scope":["channel:bot","user:bot","user:read:chat"],"token_type":"bearer"}
*/

/* 2. Get the app access token with no specific scope
    Homelander's Account
    User Homeland3r1's id: 1112905523
    Client id - qc3erad82kt9qk1g6ipyr8hgm6pc81
    Client Secret - gjdmpg1qmswtgszrg7uh7428flgdx6

    curl -X POST 'https://id.twitch.tv/oauth2/token' \
         -H 'Content-Type: application/x-www-form-urlencoded' \
         -d 'client_id=qc3erad82kt9qk1g6ipyr8hgm6pc81&client_secret=gjdmpg1qmswtgszrg7uh7428flgdx6&grant_type=client_credentials&redirect_uri=https://localhost:3000'
    
    {"access_token":"4wj0v1z8sbvub0byu3d60juyr5t84m","expires_in":4737420,"token_type":"bearer"}

    Hughie's Account
    User hughierin's id: 1135845304
    User hughierin's client_id: lfll6gbhayfwmfvmuw88n4r539kadm
    User hughierin's client_secret: lpo8hfdceb5fsct6cypioj7qw23mf9

    curl -X POST 'https://id.twitch.tv/oauth2/token' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'client_id=lfll6gbhayfwmfvmuw88n4r539kadm&client_secret=lpo8hfdceb5fsct6cypioj7qw23mf9&grant_type=client_credentials&redirect_uri=https://localhost:3000'

    {"access_token":"e1vdytngf8reqasnx9yiruxxsktj6g","expires_in":5418198,"token_type":"bearer"}
*/

/* 3. Subscribe using the app access token
    curl -X POST 'https://api.twitch.tv/helix/eventsub/subscriptions' \
    -H 'Authorization: Bearer e1vdytngf8reqasnx9yiruxxsktj6g' \
    -H 'Client-Id: lfll6gbhayfwmfvmuw88n4r539kadm' \
    -H 'Content-Type: application/json' \
    -d '{
        "type": "channel.chat.message",
        "version": "1",
        "condition": {
            "broadcaster_user_id": "1135845304",
            "user_id": "1112905523"
        },
        "transport": {
            "method": "webhook",
            "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
            "secret": "ContentMod123"
        }
    }'

    Can also use Twitch Command Line Interface: 
    twitch api post eventsub/subscriptions -b ' {
        "type": "channel.chat.message",
        "version": "1",
        "condition": {
            "broadcaster_user_id": "1112905523",
            "user_id": "1135845304"
        },
        "transport": {
            "method": "webhook",
            "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
            "secret": "ContentMod123"
        }
    }'
*/