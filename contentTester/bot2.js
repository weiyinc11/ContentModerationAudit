const { exec } = require('child_process');
const tmi = require('tmi.js');
const fs = require('fs');
const path = require("path");

// https://id.twitch.tv/oauth2/authorize
// ?response_type=code
// &client_id=qhlqnbbq0whady0ic1otaoy6ko4o0f
// &redirect_uri=http://localhost:3000
// &scope=chat%3Aedit+chat%3Aread

// http://localhost:3000/?code=0avuoesk07ycpxskuh6nduvxie99rn&scope=chat%3Aedit+chat%3Aread

// curl -X POST 'https://id.twitch.tv/oauth2/token' \
//      -H 'Content-Type: application/x-www-form-urlencoded' \
//      -d 'client_id=qhlqnbbq0whady0ic1otaoy6ko4o0f&client_secret=7z07tvax1j5ofxggofwn2gzyubgxms&code=0avuoesk07ycpxskuh6nduvxie99rn&grant_type=authorization_code&redirect_uri=http://localhost:3000'

// {"access_token":"5oi503xpgdx5twexd6pkz3x787uke9","expires_in":14948,"refresh_token":"6u0zopcxxjvgcbvxp2mkxn8wrdmocjpu98mr5k5zx5zalg081r","scope":["chat:edit","chat:read"],"token_type":"bearer"}

var access_token = '';
var refresh_token = '6u0zopcxxjvgcbvxp2mkxn8wrdmocjpu98mr5k5zx5zalg081r';
var expires_in = 0;
const client_id = 'qhlqnbbq0whady0ic1otaoy6ko4o0f';
const client_secret = '7z07tvax1j5ofxggofwn2gzyubgxms';
var result = [];

function setup(resultp){
    exec(`curl -X POST 'https://id.twitch.tv/oauth2/token' \
        -H 'Content-Type: application/x-www-form-urlencoded' \
        -d 'client_id=${client_id}&client_secret=${client_secret}&code=0avuoesk07ycpxskuh6nduvxie99rn&grant_type=authorization_code&redirect_uri=http://localhost:3000'`, (error, stdout, stderr) => {
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
            const end = Math.floor(json_data.length / 2);
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

        let randomWaitMsgTime = 1000
        const intervalId = setInterval(() => {
            if (count > 0 && index < fileData.length) {
                msg_sent = [new Date(), fileData[index].text]
                randomWaitMsgTime = len(fileData[index].text) * 500 / 2
                client.say(target, fileData[index].text);
                index++;
                count--;
            } else if (count == 1){
                count--;
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
        let fileIndex = Math.floor(data[i].length); 

        while (fileIndex < data[i].length) {
            fileIndex = await processFileData(data[i], client, target, fileIndex);
            if (fileIndex < data[i].length) {
                console.log('Pausing for 10 seconds...');
                await new Promise(resolve => setTimeout(resolve, 10000)); // Pause for 10 seconds
            } else {
                client.say(target, 'done');
            }
        }
    }
}

function jsonToCsv(jsonData) {
    let csv = '';
    
    // Extract headers
    const headers = Object.keys(jsonData[0]);
    csv += headers.join(',') + '\n';
    
    // Extract values
    jsonData.forEach(obj => {
        const values = headers.map(header => obj[header]);
        csv += values.join(',') + '\n';
    });
    
    return csv;
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
            username: 'mollykim123',
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
        
        done_count = 1
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
                if (msg == "done"){

                    const headers = Object.keys(msg_result[0]);
                    const csvRows = [headers.join(',')];

                    msg_result.forEach(obj => {
                        const row = headers.map(header => {
                            const value = obj[header];
                            return `"${value.toString().replace(/"/g, '""')}"`;
                        }).join(',');
                        csvRows.push(row);
                    });
                
                    const csvData = csvRows.join('\n');
                    
                    const now = new Date() 
                    const yyyy = now.getFullYear();
                    let mm = now.getMonth() + 1;
                    let dd = now.getDate();
                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;
                    const folderName = mm + '-' + dd + '-' + yyyy;


                    console.log(__dirname)
                    var my_dir = `${__dirname}/results/${folderName}`; 
                    var my_dirMod = `${__dirname}/results/${folderName}/modData`; 
                    if (!fs.existsSync(my_dir)){
                        fs.mkdirSync(my_dir);
                    }

                    if (!fs.existsSync(my_dirMod)){
                        fs.mkdirSync(my_dirMod);
                    }

                    fs.writeFile(`${__dirname}/results/${folderName}/data${done_count}.csv`, csvData, (err) => {
                        if (err) {
                          console.error('Error writing CSV file:', err);
                        } else {
                          console.log('CSV file written successfully!');
                          done_count = done_count + 1;
                        }
                    });

                } else {
                    const now = new Date()
                    msg_result.push({'user': tags['username'], 'message': msg, 'processTime': (now.getTime() - msg_sent[0].getTime()), 'sent_at': msg_sent[0]})
                    console.log(`${msg} was processed for ${(now.getTime() - msg_sent[0].getTime())} milliseconds`)
                    console.log(tags['username'], " : ", msg)
                    // console.log(msg_result)
                }
            }
        }
    });
}


autoRenew();
