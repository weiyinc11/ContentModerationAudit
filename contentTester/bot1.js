const { exec } = require('child_process');
const tmi = require('tmi.js');
const fs = require('fs');
const path = require("path");

// https://id.twitch.tv/oauth2/authorize
// ?response_type=code
// &client_id=3mmjffutkuzt1o3novz9855mfsbpy9
// &redirect_uri=https://localhost:3000
// &scope=chat%3Aedit+chat%3Aread

// https://localhost:3000/?code=gtre6duya1nfd3ah5qnxa72wtrtk2o&scope=chat%3Aedit+chat%3Aread

// curl -X POST 'https://id.twitch.tv/oauth2/token' \
//      -H 'Content-Type: application/x-www-form-urlencoded' \
//      -d 'client_id=3mmjffutkuzt1o3novz9855mfsbpy9&client_secret=9dujz6nk5enf5fcnlydd1hq8n67yn9&code=gtre6duya1nfd3ah5qnxa72wtrtk2o&grant_type=authorization_code&redirect_uri=https://localhost:3000'

// {"access_token":"xo1k97dm83vqzpfenh0zhrti1ow1f4","expires_in":14256,"refresh_token":"6ntqm4bi3wvho362y2oi1reyfq5nd0fdvohxbxcq0qpef41n7g","scope":["chat:edit","chat:read"],"token_type":"bearer"}

// ---------------------------------------------------------------------------------------------------------------------------

// https://id.twitch.tv/oauth2/authorize
// ?response_type=code
// &client_id=4833yyasbekihgj8in8e2hjqco5m16
// &redirect_uri=https://localhost:3000
// &scope=chat%3Aedit+chat%3Aread

// https://localhost:3000/?code=k7ds3q7ts9vna5g4dw8florfftex44&scope=chat%3Aedit+chat%3Aread

// curl -X POST 'https://id.twitch.tv/oauth2/token' \
//      -H 'Content-Type: application/x-www-form-urlencoded' \
//      -d 'client_id=4833yyasbekihgj8in8e2hjqco5m16&client_secret=80vr3zvtuemc2ljs1f34wj1fz368y7&code=k7ds3q7ts9vna5g4dw8florfftex44&grant_type=authorization_code&redirect_uri=https://localhost:3000'

// {"access_token":"jde9l1x6klkqzig4m2pnzhqn4nysc1","expires_in":14832,"refresh_token":"54uq7b3b6wivu7h2e4gdgxeexwb473k70jocnxdt6exexxz9yd","scope":["chat:edit","chat:read"],"token_type":"bearer"}

var access_token = '';
var refresh_token = '54uq7b3b6wivu7h2e4gdgxeexwb473k70jocnxdt6exexxz9yd';
var expires_in = 0;
const client_id = '4833yyasbekihgj8in8e2hjqco5m16';
const client_secret = '80vr3zvtuemc2ljs1f34wj1fz368y7';

function setup(resultp){
    exec(`curl -X POST 'https://id.twitch.tv/oauth2/token' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -d 'client_id=${client_id}&client_secret=${client_secret}&code=oy5c7xwcatfvnr7l4w6xnyi3gx9nyb&grant_type=authorization_code&redirect_uri=http://localhost:3000'`, (error, stdout, stderr) => {
            if (error) {
            console.error(`exec error: ${error}`);
            return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        // var data = `{"access_token":"s1kgjcjn5thp5b1cvcleqv5f6acuh7","expires_in":13208,"refresh_token":"xop9uqsjxmqzsnn5khyxrg4y2wyi16poykrpvje0w4ydsm0aur","scope":["chat:edit","chat:read"],"token_type":"bearer"}`
        var data = String(stdout);
        var each = data.split(',');
        console.log("Access Token: " + each[0].split(':')[1]);

        var i = 0;
        for (i = 0; i < 3; i++) {
            result.push(each[i].split(':')[1].replace(/"/g, ''));
        }

        // setTimeout(renewToken, parseInt(result[1]) * 1000);
        console.log("Running renewToken...");
        setTimeout(renewToken, 5000);

        resultp = {
            "refresh_token": refresh_token,
            "access_token": access_token,
        }
        return resultp;
    });
}

// Function called when the "dice" command is issued
function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
  }
  
  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }
  
  
  function messageInter() {
      let seconds = 15;
      var setMessages = setInterval (
          function message() {
              // console.log(seconds);
              client.say(target, `Comment #${seconds}`)
              seconds--;
              if (seconds === 0) {
                  clearInterval(setMessages);
              }
          }, 1000
      );     
  }

  async function getData() {
    const directory = path.join(__dirname, '/dataToSend')
    const moveTo = path.join(__dirname, '/results')
    let dataSection = [];
    
    try {
        const files = await fs.promises.readdir(directory);

        const filenames = files.filter(file => {
            const filePath = path.join(directory, file);
            return fs.statSync(filePath).isFile();
        });

        for (const fileName of filenames) {
            const data = await fs.promises.readFile(path.join(directory, fileName), 'utf8');
            
            const json_data = JSON.parse(data);
            const end = Math.floor(json_data.length + 1);
            const start = 0;

            let file_data = [];
            for (let i = start; i < end; i++) {
                const rare = json_data[i];
                file_data.push(rare);
            }

            dataSection.push(file_data);
        }
    } catch (err) {
        console.error('Error:', err);
    }
    return dataSection;
}
//   returns a list of lists per json file in dataToSend --> each list per file contains half of the job.


function renewToken(callback) {
    exec(`curl -X POST https://id.twitch.tv/oauth2/token \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${client_id}&client_secret=${client_secret}'`, (error, stdout, stderr) => {
        if (error) {
        console.error(`exec error: ${error}`);
        return;
        }
        console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);

        var resAccess = String(stdout);
        var each = resAccess.split(',');
        // console.log("each: " + each[0]);
        // console.log("split: " + each[0].split(':')[1]);
        refresh_token = each[1].split(':')[1].replace(/"/g, '');
        
        console.log("Access token: " + each[0].split(':')[1].replace(/"/g, ''));
        console.log("Refresh Token: " + each[2].split(':')[1].replace(/"/g, ''));
        console.log("Expires In: " + each[1].split(':')[1].replace(/"/g, ''));

        result = {
            "access_token": each[0].split(':')[1].replace(/"/g, ''),
            "refresh_token" : each[2].split(':')[1].replace(/"/g, ''),
            "expiresIn" : each[1].split(':')[1].replace(/"/g, '')
        };

        callback(result);
    });
}

let msg_sent = [new Date(), 0];
async function processFileData(fileData, client, target, startIndex) {
    return new Promise((resolve) => {
        let index = startIndex;
        let count = 5;

        let randomWaitMsgTime = 4000
        const intervalId = setInterval(() => {
            if (count > 0 && index < Math.floor(fileData.length)) {
                if (count == 1){
                    try {
                        msg_sent = [new Date(), fileData[index].text]
                        client.say(target, fileData[index].text);
                        count--;
                    } catch {
                        count--;
                    }
                } else {
                    try {
                        msg_sent = [new Date(), fileData[index].text]
                        client.say(target, fileData[index].text);
                        index++;
                        count--;
                    } catch {
                        index++;
                        count--;
                    }
                }
            } else {
                clearInterval(intervalId);
                resolve(index + 1);
            }
        }, randomWaitMsgTime);
    });
}

async function run(client, target) {
    const data = await getData();

    for (let i = 0; i < data.length; i++) {
        let index = 0;
        while (index < Math.floor(data[i].length)) {
            index = await processFileData(data[i], client, target, index);
            if (index < data[i].length) {
                console.log('Pausing for 10 seconds...');
                await new Promise(resolve => setTimeout(resolve, 10000)); // Pause for 10 seconds
            } else {
                client.say(target, 'done');
            }
        }
    }
}

// setup(result);
// -------------------------------------------------------------------------------------------------------------------
let msg_result = [];
function autoRenew(){
    renewToken(function(res) {
        access_token = res.access_token;
        refresh_token = res.refresh_token;
        expires_in = parseInt(res.expiresIn);

        // Define configuration options
        const opts = {
            identity: {
            username: 'homeland3r1',
            password: String(access_token)
            },
            channels: [
            'hughierin',
            ]
        };
        
        // Create a client with our options
        const client = new tmi.client(opts);
        
        // Register our event handlers (defined below)
        client.on('message', onMessageHandler);
        client.on('connected', onConnectedHandler);
        
        // Connect to Twitch:
        client.connect();
        
        setInterval(() => {
            console.log("Renewing Token...");
            autoRenew();
        }, expires_in * 1000);
        
        // Called every time a message comes in
        function onMessageHandler (target, tags, msg, self) {
            if (self) { 
                // const now = new Date()
                // if (msg_sent[1] == msg){
                //     msg_result.push({'user': tags['username'], 'message': msg, 'processTime': (now.getTime() - msg_sent[0].getTime()), 'sent_at': msg_sent[0]})
                //     console.log(`${msg} was processed for ${(now.getTime() - msg_sent[0].getTime())} milliseconds`)
                //     console.log(tags['username'], " : ", msg)
                // } else {
                //     // result.append()
                //     console.log(`Moderated message: ${msg} sent at ${msg_sent[0]}`)
                // }
                return
            } else {
                if (msg.includes("!")){
                    if (msg === '!dice') {
                        const num = rollDice();
                        client.say(target, `You rolled a ${num}`);
                        console.log(`* Executed ${msg} command`);
                    } else if (msg === '!audit') {
                        run(client, target);
                        console.log(`* Executed ${msg} command`);
                    }
                    else {
                        const temp = 0;
                    }
                }
            }
        }
    });
}


autoRenew();
