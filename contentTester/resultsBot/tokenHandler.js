const code = "";
const redirectUri = "https://localhost:3000";
const tokenData = await exchangeCode(process.env.U1_TWITCH_CLIENT_ID, process.env.U1_TWITCH_CLIENT_SECRET, code, redirectUri);

console.log(tokenData);

// Attempts to handle token data manually

// BROADCASTER / MODERATOR ROLE IN ALL SUBSCRIPTIONS
// -----------------------------------
// User bb3e08d1900c43886e73e600's id: 1109317124
// User bb3e08d1900c43886e73e600's client_id: 52q9nyo1zjyi5qt2u0al093ol812dm
// User bb3e08d1900c43886e73e600's client_secret: rhyj4a2mjri86va8731c19bxzb1s7n


// CHATTER/USER ROLE IN ALL SUBSCRIPTIONS
// -----------------------------------
// User BritishMan420's id: 1108425938

// CHATTER/USER ROLE IN ALL SUBSCRIPTIONS
// -----------------------------------
// User Littleelly000's id: 1124970435
// client_id: 6zz51egn1r2amiygntijz8w57bfc6o
// client_secret: brmreyqr9glhjddjqvsebpmk0hmjna


// BROADCASTOR / MODERATOR ROLE IN ALL SUBSCRIPTIONS
// -----------------------------------
// User Mollykim123's id: 1103563061
// User Mollykim123's client id: jx7xc70s2hqd5qwdc9q3bsoz14yq5v
// User Mollykim123's client secret: hpn7zfnopih559o8rgjps0sm3u7nkj



// 1. Setting up the user access tokens to ensure the scope of all relevant users

    /* Get a url redirect to get a code for all your users */
    // https://id.twitch.tv/oauth2/authorize
    // ?response_type=code
    // &client_id=52q9nyo1zjyi5qt2u0al093ol812dm
    // &redirect_uri=https://localhost:3000
    // &scope=moderator%3Amanage%3Aautomod+channel%3Abot+user%3Aread%3Achat+moderation%3Aread

    // https://id.twitch.tv/oauth2/authorize
    // ?response_type=code
    // &client_id=jx7xc70s2hqd5qwdc9q3bsoz14yq5v
    // &redirect_uri=https://localhost:3000
    // &scope=moderator%3Amanage%3Aautomod+user%3Aread%3Achat+user%3Abot

    // https://id.twitch.tv/oauth2/authorize
    // ?response_type=code
    // &client_id=6zz51egn1r2amiygntijz8w57bfc6o
    // &redirect_uri=https://localhost:3000
    // &scope=user%3Aread%3Achat+user%3Abot

    /* Result of the redirect */
    // https://localhost:3000/?code=o4cntbjdnofi3n8f2oluwf0fc2h0fm&scope=moderator%3Amanage%3Aautomod+channel%3Abot+user%3Aread%3Achat+moderation%3Aread

    // https://localhost:3000/?code=i35q0eq0f44pjdlka7d3vh30f332hx&scope=moderator%3Amanage%3Aautomod+user%3Aread%3Achat+user%3Abot

    // https://localhost:3000/?code=z6f1ccjrv4n4dskc9esypah4umgaol&scope=user%3Aread%3Achat+user%3Abot

    /* Use the code provided from the redirect to cURL and get access and refresh tokens */
    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=52q9nyo1zjyi5qt2u0al093ol812dm&client_secret=rhyj4a2mjri86va8731c19bxzb1s7n&code=o4cntbjdnofi3n8f2oluwf0fc2h0fm&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=jx7xc70s2hqd5qwdc9q3bsoz14yq5v&client_secret=hpn7zfnopih559o8rgjps0sm3u7nkj&code=i35q0eq0f44pjdlka7d3vh30f332hx&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=6zz51egn1r2amiygntijz8w57bfc6o&client_secret=brmreyqr9glhjddjqvsebpmk0hmjna&code=z6f1ccjrv4n4dskc9esypah4umgaol&grant_type=authorization_code&redirect_uri=https://localhost:3000'

    /* Resultant access and refresh tokens */
    // {"access_token":"qyfomgadk5iucvf6vtlwtu0s2igio6","expires_in":15285,"refresh_token":"kqvrqetskxfcij11y0p94xaq1btv3wqovg4y1nsx2z1fkbjzup","scope":["channel:bot","moderation:read","moderator:manage:automod","user:read:chat"],"token_type":"bearer"}

    // {"access_token":"32qeuor9vfvtwt6wmzbyoyy5i0hnyf","expires_in":15585,"refresh_token":"wrk5s5teqyv1kerjwisk7tp66uuvzmqs0nf3ire0qfdcxgvxlb","scope":["moderator:manage:automod","user:bot","user:read:chat"],"token_type":"bearer"}

    // {"access_token":"koiqpzg6micuq4k9hqld6wqwbjsti0","expires_in":13464,"refresh_token":"d1j80hhwv1v1oxxvmy2k4wwdz3b46u88u47d400mdxzx281dfk","scope":["user:bot","user:read:chat"],"token_type":"bearer"}


// 2. Set up the app access token for the respective subscriptions
    /* 
        using client_id and secret to get app access tokens via cURL
    */

    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=52q9nyo1zjyi5qt2u0al093ol812dm&client_secret=rhyj4a2mjri86va8731c19bxzb1s7n&grant_type=client_credentials&redirect_uri=https://localhost:3000'

    // {"access_token":"88qyp2gggnpphhwhs10puzm7c66gxi","expires_in":5317097,"token_type":"bearer"}

    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=lz7n868l3cquav1d9a38r0hsw8af8p&client_secret=4l6g84e7r0dlyv32qmhale9iqrqby2&grant_type=client_credentials&redirect_uri=https://localhost:3000'

    // {"access_token":"nclhn7lv47y211ptilfoh3y5nvk3op","expires_in":5191965,"token_type":"bearer"}
    // 2024/08/08 13:48:00 Successfully generated App Access Token.
    // 2024/08/08 13:48:00 App Access Token: trp2yxiasidjjo9axfmgz4u6fgzfmv
    // 2024/08/08 13:48:00 Expires At: 2024-10-11 08:53:49.551756 +0000 UTC
    // 2024/08/08 13:48:00 Scopes: []

    // curl -X POST 'https://id.twitch.tv/oauth2/token' \
    //      -H 'Content-Type: application/x-www-form-urlencoded' \
    //      -d 'client_id=6zz51egn1r2amiygntijz8w57bfc6o&client_secret=brmreyqr9glhjddjqvsebpmk0hmjna&grant_type=client_credentials&redirect_uri=https://localhost:3000'

    // {"access_token":"f7ski8e765o960ee4moi53tz0aoj5t","expires_in":5204816,"token_type":"bearer"}

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
//         "broadcaster_user_id": "1109317124",
//         "user_id": "1103563061"
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
// -H 'Authorization: Bearer f7ski8e765o960ee4moi53tz0aoj5t' \
// -H 'Client-Id: 6zz51egn1r2amiygntijz8w57bfc6o' \
// -H 'Content-Type: application/json' \
// -d '{
//     "type": "channel.chat.user_message_hold",
//     "version": "1",
//     "condition": {
//         "broadcaster_user_id": "1109317124",
//         "user_id": "1124970435"
//     },
//     "transport": {
//         "method": "webhook",
//         "callback": "https://touching-willingly-shiner.ngrok-free.app/webhooks/callback",
//         "secret": "ContentMod123"
//     }
// }'