Documentation for Implementing tmi.js for Chatbot and results data extraction bot
===============
### Accounts in Use and their respective Registered Bot accounts
1. <b>MollyKim</b> <br/> Userid: #1103563061 <br/> Client ID: qhlqnbbq0whady0ic1otaoy6ko4o0f <br/> Client Secret: 7z07tvax1j5ofxggofwn2gzyubgxms
2. <b>Homeland3r1</b> <br/> Userid: #1112905523 <br/> Client ID: 4833yyasbekihgj8in8e2hjqco5m16 <br/> Client Secret: 80vr3zvtuemc2ljs1f34wj1fz368y7
3. <b>Hughierin</b>

## Step 1 : Implicit Flow User Access Tokens
https://id.twitch.tv/oauth2/authorize
?response_type=code
&client_id=<CLIENT_ID>
&redirect_uri=https://localhost:3000
&scope=chat%3Aedit+chat%3Aread

Result of the above:
https://localhost:3000/?code=k7ds3q7ts9vna5g4dw8florfftex44&scope=chat%3Aedit+chat%3Aread

curl -X POST 'https://id.twitch.tv/oauth2/token' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>&code=<USER_CIDE_FROMABOVE>&grant_type=authorization_code&redirect_uri=https://localhost:3000'

Result of the above:
{"access_token":"jde9l1x6klkqzig4m2pnzhqn4nysc1","expires_in":14832,"refresh_token":"54uq7b3b6wivu7h2e4gdgxeexwb473k70jocnxdt6exexxz9yd","scope":["chat:edit","chat:read"],"token_type":"bearer"}

Using the refresh token from the above to implement the chat bot system so thath the user access does not time out. 

## Step 2 : File Responsibilities
1. Bot1.js will be used to implement a data parsing system - this includes the declaration of the different user bots that are repsonsible for the activation account and chat bot account. 

This can be found here: ![Bot1 User Declaration Codes](readMeimages/bot1User.png)

2. Bot2.js will be used to extract messages from the target channel. This includes the declaration of a different chat bot user connecting via tmi.js to the same Twitch target channel. This allows us to extract messages from the target channel without extracting those messages that were moderated by AutoMod. This is because the bot1.js monitors the activation user's messages in order to start the chat bot's data parsing. However, bot2.js is essential to grab the messages that are not from the chatbot in bot1.js itself. 

This can be found here in bot2.js file ![Bot2 User Declaration Codes](readMeimages/bot2User.png)

3. Folders 'dataToSend' and 'results' will house the json datasets that need to be sent and the extracted json to csv file.<br/> 
<b>Note: jsons in 'dataToSend' must include a text column that declares the messages to be sent.</b>

## Step 3 : Running the experiment
Start by including split terminals to run 'node bot1.js' and 'node bot2.js' simultaneously. 

Documentation for Implementing Twitch EventSub and API for Results Bot
===============

### Accounts in Use and their respective Registered Bot accounts
1. <b>MollyKim</b> <br/> Userid: #1103563061 <br/> Client ID: ia2ncdr6eb1r99094rnibc8hl541yv <br/> Client Secret: 6xuttx9rwgt7zpp7px1q4tabwla0r2
2. <b>Frenchie420</b> <br/> Userid: #513530928 <br/> Client ID: khgvhvvvie74g28sgdp979vs858638 <br/> Client Secret: sro8azd9138ldtr4dqr7tdmc4g8q33

## Step 1 : Generate User Access Tokens with the correct scope based on the EventSub you'd like to subscribe to
1. Using the <a href="https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow">Implicit Grant flow</a>, we can define the scope for each account. <a href="https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/#channelchatmessage">To view the required scopes.</a>
> https://id.twitch.tv/oauth2/authorize?
> response_type=code&client_id='YOUR CLIENT ID'&
> redirect_uri=https://localhost:3000
> &scope='YOUR REQUIRED SCOPE'

The above includes the following scopes for the 'channel.chat.message' subscription:
#### Chatting User Scopes: MollyKim123 
<ul>
    <li>user:bot</li>
    <li>user:read:chat</li>
    <li>user:write:chat</li>
    <li>moderation:read</li>
    <li>moderator:manage:automod</li>
</ul>

> https://id.twitch.tv/oauth2/authorize?
> response_type=code&client_id=ia2ncdr6eb1r99094rnibc8hl541yv&
> redirect_uri=https://localhost:3000
> &scope=user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat
>
> <b>Result</b>: https://localhost:3000/?code=fxsgwf2iquwvslzyn9ww5h9peqfao5&scope=user%3Abot+user%3Aread%3Achat+user%3Awrite%3Achat 

#### Broadcaster / Mod Status: Frenchie420
<ul>
    <li>channel:bot</li>
</ul>

> https://id.twitch.tv/oauth2/authorize?
> response_type=code&client_id=khgvhvvvie74g28sgdp979vs858638&
> redirect_uri=https://localhost:3000
> &scope=channel%3Abot+moderation%3Aread+moderator%3Amanage%3Aautomod
>
> <b>Result</b>: https://localhost:3000/?code=1efy6mjsv23ohb16im1qvp5sdjiae6&scope=channel%3Abot+moderation%3Aread+moderator%3Amanage%3Aautomod

1b. 
#### Chatting User Scopes: MollyKim123 
curl -X POST 'https://id.twitch.tv/oauth2/token' \
         -H 'Content-Type: application/x-www-form-urlencoded' \
         -d 'client_id=ia2ncdr6eb1r99094rnibc8hl541yv&client_secret=6xuttx9rwgt7zpp7px1q4tabwla0r2&code=fxsgwf2iquwvslzyn9ww5h9peqfao5&grant_type=authorization_code&redirect_uri=https://localhost:3000'

> <b>Result</b>: {"access_token":"ywjxrg4l7av4xry9t9u200f6ksivzi","expires_in":15383,"refresh_token":"fearur8tn5hg2udb5t2g22ojblm4gjddboffpz14cpxy9x4dls","scope":["user:bot","user:read:chat","user:write:chat"],"token_type":"bearer"}

#### Broadcaster / Mod Status: Frenchie420
curl -X POST 'https://id.twitch.tv/oauth2/token' \
         -H 'Content-Type: application/x-www-form-urlencoded' \
         -d 'client_id=khgvhvvvie74g28sgdp979vs858638&client_secret=sro8azd9138ldtr4dqr7tdmc4g8q33&code=1efy6mjsv23ohb16im1qvp5sdjiae6&grant_type=authorization_code&redirect_uri=https://localhost:3000'

> <b>Result</b>: {"access_token":"2pzfzq3t8w0qk4qjf9e7kt7j9lyeyd","expires_in":14746,"refresh_token":"ul0rvn2dzrvazuhs6e6lbprwzhnru9tlsttc6sn7ghvpcyqj8c","scope":["channel:bot","moderation:read","moderator:manage:automod"],"token_type":"bearer"}


## Step 2 : Use the Results from above to get the user access tokens 

> curl -X POST 'https://id.twitch.tv/oauth2/token' \
>    -H 'Content-Type: application/x-www-form-urlencoded' \
>    -d 'client_id='YOUR CLIENT ID'&
>    client_secret='YOUR CLIENT SECRET'&
>    grant_type=client_credentials&redirect_uri=https://localhost:3000'

#### Chatting User Scopes: MollyKim123 

> curl -X POST 'https://id.twitch.tv/oauth2/token' \
>    -H 'Content-Type: application/x-www-form-urlencoded' \
>    -d 'client_id=ia2ncdr6eb1r99094rnibc8hl541yv&
>    client_secret=6xuttx9rwgt7zpp7px1q4tabwla0r2&
>    grant_type=client_credentials&redirect_uri=https://localhost:3000'
>
> <b>Result</b>: {"access_token":"pjbwr3g9nc3gajghi40mfd1q1g31vq","expires_in":5230313,"token_type":"bearer"}

#### Broadcaster / Mod Status: Frenchie420

> curl -X POST 'https://id.twitch.tv/oauth2/token' \
>    -H 'Content-Type: application/x-www-form-urlencoded' \
>    -d 'client_id=khgvhvvvie74g28sgdp979vs858638&
>    client_secret=sro8azd9138ldtr4dqr7tdmc4g8q33&
>    grant_type=client_credentials&redirect_uri=https://localhost:3000'
>
> <b>Result</b>: {"access_token":"vko8mohy4d6sldexb4b1j1ybc34k7h","expires_in":4803131,"token_type":"bearer"}

## Step 3 : Use the Access Token and Account Credentials to create a subscription to the EventSub you'd like

curl -X POST 'https://api.twitch.tv/helix/eventsub/subscriptions' \
-H 'Authorization: Bearer pjbwr3g9nc3gajghi40mfd1q1g31vq' \
-H 'Client-Id: ia2ncdr6eb1r99094rnibc8hl541yv' \
-H 'Content-Type: application/json' \
-d '{
    "type": "channel.chat.message",
    "version": "1",
    "condition": {
        "broadcaster_user_id": "1103563061",
        "user_id": "513530928"
    },
    "transport": {
        "method": "webhook",
        "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
        "secret": "ContentMod123"
    }
}'

twitch api post eventsub/subscriptions -b '{
    "type": "automod.message.hold",
    "version": "1",
    "condition": {
        "broadcaster_user_id": "513530928",
        "moderator_user_id": "1103563061"
    },
    "transport": {
        "method": "webhook",
        "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
        "secret": "ContentMod123"
    }
}'


curl -X POST 'https://api.twitch.tv/helix/eventsub/subscriptions' \
-H 'Authorization: Bearer m6yaggtaba4enjzzsabxa9s873pv3e' \
-H 'Client-Id: ia2ncdr6eb1r99094rnibc8hl541yv' \
-H 'Content-Type: application/json' \
-d '{
    "type": "automod.message.hold",
    "version": "1",
    "condition": {
        "broadcaster_user_id": "513530928",
        "moderator_user_id": "1103563061"
    },
    "transport": {
        "method": "webhook",
        "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
        "secret": "ContentMod123"
    }
}'