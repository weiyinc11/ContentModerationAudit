const code = "";
const redirectUri = "https://localhost:3000";
const tokenData = await exchangeCode(process.env.U1_TWITCH_CLIENT_ID, process.env.U1_TWITCH_CLIENT_SECRET, code, redirectUri);

console.log(tokenData);

// Attempts to handle token data manually

// BROADCASTER / MODERATOR ROLE IN ALL SUBSCRIPTIONS
// -----------------------------------
// User hughierin's id: 1135845304
// User hughierin's client_id: 36ay5kaqu0m4s5xo3vogcp1cl1u0lv
// User hughierin's client_secret: uzh7yd8mh5y3dggnh051w8o6t3ct0z

// CHATTER/USER ROLE IN ALL SUBSCRIPTIONS
// -----------------------------------
// User Homeland3r1's id: 1112905523
// client_id: s9biimnfxwri7742sedh7f3qguivy1
// client_secret: 7t7atort1giutcvg00u3xgm10ah1or

// User billybutcher708's id: 1126926753
// client_id: u4vussk43p29rkf1unxp1bgv7629dz
// client_secret: r2vk14oqyd23t84akmcpysnn8ma6i1

// 1. Setting up the user access tokens to ensure the scope of all relevant users

    /* Get a url redirect to get a code for all your users */
    // Hughie - streamer
    // https://id.twitch.tv/oauth2/authorize
    // ?response_type=code
    // &client_id=36ay5kaqu0m4s5xo3vogcp1cl1u0lv
    // &redirect_uri=https://localhost:3000
    // &scope=channel%3Abot+user%3Aread%3Achat+moderation%3Aread+moderator%3Amanage%3Aautomod

    // ----------------------------------------------------------------------------------------------------
    // https://id.twitch.tv/oauth2/authorize
    // ?response_type=code
    // &client_id=u4vussk43p29rkf1unxp1bgv7629dz
    // &redirect_uri=https://localhost:3000
    // &scope=moderator%3Amanage%3Aautomod+user%3Aread%3Achat+user%3Abot
    // ----------------------------------------------------------------------------------------------------

    // Homelander
    // https://id.twitch.tv/oauth2/authorize
    // ?response_type=code
    // &client_id=s9biimnfxwri7742sedh7f3qguivy1
    // &redirect_uri=https://localhost:3000
    // &scope=user%3Aread%3Achat+user%3Abot

    /* Result of the redirect */
    // Hughie
    // https://localhost:3000/?code=tfi3c7tzvlub1krucq3egiobw122q6&scope=channel%3Abot+user%3Aread%3Achat+moderation%3Aread+moderator%3Amanage%3Aautomod

    // Billy
    // https://localhost:3000/?code=2j0o5roumn7rtm004bcdgif4e1kjpj&scope=moderator%3Amanage%3Aautomod+user%3Aread%3Achat+user%3Abot

    // Homelander
    // https://localhost:3000/?code=y2ldabe9a23v9m4r2p35i89ahpwvz4&scope=user%3Aread%3Achat+user%3Abot

    /* Use the code provided from the redirect to cURL and get access and refresh tokens */
    // Hughie
    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=36ay5kaqu0m4s5xo3vogcp1cl1u0lv&client_secret=uzh7yd8mh5y3dggnh051w8o6t3ct0z&code=tfi3c7tzvlub1krucq3egiobw122q6&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    // Homelander
    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=s9biimnfxwri7742sedh7f3qguivy1&client_secret=7t7atort1giutcvg00u3xgm10ah1or&code=y2ldabe9a23v9m4r2p35i89ahpwvz4&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    // Billy
    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=u4vussk43p29rkf1unxp1bgv7629dz&client_secret=r2vk14oqyd23t84akmcpysnn8ma6i1&code=2j0o5roumn7rtm004bcdgif4e1kjpj&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    /* Resultant access and refresh tokens */
    // Hughie
    // {"access_token":"str0dvniwyllnx9rf7fjs7r7prye07","expires_in":13932,"refresh_token":"etx8rd29leyyibj1njaydf4hu192n7jwjnb4pbb57wtv7xy9ag","scope":["channel:bot","moderation:read","moderator:manage:automod","user:read:chat"],"token_type":"bearer"}

    // Homelander
    // {"access_token":"ei5y5afg0f3o1mqjm1exghsch0yjkv","expires_in":15225,"refresh_token":"86ia9se7iwyi30qgqvtdic42n4inq9dgv25k85784r0k3hygvq","scope":["user:bot","user:read:chat"],"token_type":"bearer"}

    // Billy
    // {"access_token":"0wswmv4gaao47nzjresal89adllw72","expires_in":13697,"refresh_token":"jxjvua7qejbykfe0hvvwiq7ssqibgwuwndfnxlecu9ntwxveau","scope":["moderator:manage:automod","user:bot","user:read:chat"],"token_type":"bearer"}

// 2. Set up the app access token for the respective subscriptions
    /* 
        using client_id and secret to get app access tokens via cURL
    */

    // Hughie
    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=36ay5kaqu0m4s5xo3vogcp1cl1u0lv&client_secret=uzh7yd8mh5y3dggnh051w8o6t3ct0z&grant_type=client_credentials&redirect_uri=https://localhost:3000'
    // {"access_token":"ez713753uzqthpm3pcnq7au0z7ir48","expires_in":4752513,"token_type":"bearer"}

    // Homelander
    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=9xhuy6dokxj3m1bd46pu8b355kc7p1&client_secret=bc0ei2e3n1ct4t9r7wmqmnkd8qy6n8&grant_type=client_credentials&redirect_uri=https://localhost:3000'
    // {"access_token":"hncwbq5lxwv10t59lo113ksz9wrq8a","expires_in":4760213,"token_type":"bearer"}

    // Billy
    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=u4vussk43p29rkf1unxp1bgv7629dz&client_secret=r2vk14oqyd23t84akmcpysnn8ma6i1&grant_type=client_credentials&redirect_uri=https://localhost:3000'
    // {"access_token":"8q7e52t8hibzirdb1o1y7w6wrvmwj0","expires_in":5150836,"token_type":"bearer"}


//3. Subscribe using the following requirements
    /*
        For the automod.message.hold subscription, we will need: 

        Requires a user access token that includes the moderator:manage:automod scope. The ID in the moderator_user_id condition parameter must match the user ID in the access token. If app access token used, then additionally requires the moderator:manage:automod scope for the moderator.
        twitch api post eventsub/subscriptions -b 
        '{
            "type": "automod.message.hold",
            "version": "1",
            "condition": {
                "broadcaster_user_id": "1109317124",
                "moderator_user_id": "1103563061"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
                "secret": "ContentMod123"
            }
        }'
    */


    /*
        For the channel.chat.message subscription, we will need: 

        Requires user:read:chat scope from the chatting user. If app access token used, then additionally requires user:bot scope from chatting user, and either channel:bot scope from broadcaster or moderator status.

        {
            "type": "channel.chat.message",
            "version": "1",
            "condition": {
                "broadcaster_user_id": "1109317124",
                "user_id": "1103563061"
            },
            "transport": {
                "method": "webhook",
                "callback": "https://example.com/webhooks/callback",
                "secret": "ContentMod123"
            }
        }
    */

// twitch api post eventsub/subscriptions -b '{
//     "type": "automod.message.hold",
//     "version": "1",
//     "condition": {
//         "broadcaster_user_id": "1109317124",
//         "moderator_user_id": "1103563061"
//     },
//     "transport": {
//         "method": "webhook",
//         "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
//         "secret": "ContentMod123"
//     }
// }'

// twitch api post eventsub/subscriptions -b '{
//     "type": "automod.message.update",
//     "version": "1",
//     "condition": {
//         "broadcaster_user_id": "1109317124",
//         "moderator_user_id": "1103563061"
//     },
//     "transport": {
//         "method": "webhook",
//         "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
//         "secret": "ContentMod123"
//     }
// }'


// twitch api post eventsub/subscriptions -b ' {
//     "type": "channel.chat.message",
//     "version": "1",
//     "condition": {
//         "broadcaster_user_id": "1135845304",
//         "user_id": "1126926753"
//     },
//     "transport": {
//         "method": "webhook",
//         "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
//         "secret": "ContentMod123"
//     }
// }'

// twitch api post eventsub/subscriptions -b ' {
//     "type": "channel.chat.user_message_hold",
//     "version": "1",
//     "condition": {
//         "broadcaster_user_id": "1124970435",
//         "user_id": "1103563061"
//     },
//     "transport": {
//         "method": "webhook",
//         "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
//         "secret": "ContentMod123"
//     }
// }'

// curl -X POST 'https://api.twitch.tv/helix/eventsub/subscriptions' \
// -H 'Authorization: Bearer ez713753uzqthpm3pcnq7au0z7ir48' \
// -H 'Client-Id: 36ay5kaqu0m4s5xo3vogcp1cl1u0lv' \
// -H 'Content-Type: application/json' \
// -d '{
//     "type": "channel.chat.message",
//     "version": "1",
//     "condition": {
//         "broadcaster_user_id": "1135845304",
//         "user_id": "1112905523"
//     },
//     "transport": {
//         "method": "webhook",
//         "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
//         "secret": "ContentMod123"
//     }
// }'