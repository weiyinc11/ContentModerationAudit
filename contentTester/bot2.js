const { exec } = require('child_process');
const tmi = require('tmi.js');
const fs = require('fs');
const path = require("path");
const os = require('os');
const json2csv = require('json2csv').parse;
var process = require('process');

const args = process.argv.slice(2);

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
var refresh_token = args[0].split("=")[1];
var expires_in = 0;
const client_id = args[1].split("=")[1];
const client_secret = args[2].split("=")[1];
var result = [];

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }


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

async function getNextFile(){
    const files = await fs.promises.readdir(path.join(__dirname, 'dataToSend'));

    const filenames = files.filter(file => {
        const filePath = path.join(path.join(__dirname, 'dataToSend'), file);
        return fs.statSync(filePath).isFile();
    });

    nextFile = filenames[0]
    console.log(nextFile)
    
    if (fs.existsSync(path.join(__dirname, 'dataSendCurrNum.json'))){
        fs.writeFileSync(path.join(__dirname, 'dataSendCurrNum.json'), JSON.stringify([{"current_json":nextFile,"fileNum":done_count}]), (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
            }
        });
    }
    return nextFile
}

const write = async (fileName, fields, data) => {

    const now = new Date() 
    const yyyy = now.getFullYear();
    let mm = now.getMonth() + 1;
    let dd = now.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const folderName = mm + '-' + dd + '-' + yyyy;
    // output file in the same folder
    var my_dir = `${__dirname}/results/${folderName}`; 
    // const filename = path.join(my_dir,  `${fileName}`);
    let rows;
    // If file doesn't exist, we will create new file and add rows with headers.    
    if (!fs.existsSync(fileName)) {
        console.log("Creating file to write to...");
        rows = json2csv(data, { header: true });
        fs.writeFileSync(fileName, rows, (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
            }
        });
        fs.appendFileSync(fileName, "\r\n");
    } else {
        // Rows without headers.
        rows = json2csv(data, { header: false });
         // Append file function can create new file too.
        fs.appendFileSync(fileName, rows);
        // Always add new line if file already exists.
        fs.appendFileSync(fileName, "\r\n");
    }
    console.log("CSV file written successfully! ");
}


// setup(result);
// -------------------------------------------------------------------------------------------------------------------
let msg_result = [];
let done_count = -1;
function autoRenew(){
    renewToken(function(res) {
        access_token = res.access_token;
        refresh_token = res.refresh_token;
        expires_in = parseInt(res.expiresIn);

        // Define configuration options
        const opts = {
            identity: {
            username: args[3].split("=")[1],
            password: String(access_token)
            },
            channels: [
                args[4].split("=")[1],
            ]
        };
        
        // Create a client with our options
        const client = new tmi.client(opts);
        
        // Register our event handlers (defined below)
        client.on('message', onMessageHandler);
        client.on('connected', onConnectedHandler);
        
        // Connect to Twitch:
        client.connect();

        // setTimeout(() => {client.say(args[4].split("=")[1], "!audit")}, 5000);
        
        setInterval(() => {
            console.log("Renewing Token...");
            autoRenew();
        }, expires_in * 1000);

        function onMessageHandler (target, tags, msg, self) {
            if (self) { 
                return
            } else {
                if (msg == "done"){
                    if(fs.existsSync(path.join(__dirname, 'lastSent.json'))){
                        fs.unlink(path.join(__dirname, 'lastSent.json'), (err) => {
                            if (err) {
                                console.error(`Error removing lastSent file: ${err}`)
                            }
                        })
                    }
                    // remove the lastSent.json file
                    
                    curr = path.join(__dirname, 'dataSendCurrNum.json');
                    let data = JSON.parse(fs.readFileSync(curr, 'utf-8'))
                    done_count = data[0]['fileNum']
                    fileNameCurr = data[0]['current_json']
                    // get the currFileName

                    fs.unlink(path.join(__dirname, `dataToSend/${fileNameCurr}`), (err) => {
                        if (err) {
                            console.error(`Error removing file: ${err}`)
                        }
                    })
                    // remove the currFile from Datatosend
                    done_count = done_count + 1;

                    // increment done count

                    let nextFileName = getNextFile();

                } else {
                    t = path.join(__dirname, 'dataSendCurrNum.json');
                    let data = JSON.parse(fs.readFileSync(t, 'utf-8'))
                    done_count = data[0]['fileNum']
                    fileNameCurr = data[0]['current_json']
                    console.log(`File written to: ${fileNameCurr}`)
                    console.log(`File num: ${done_count}`)

                    const now = new Date() 
                    const yyyy = now.getFullYear();
                    let mm = now.getMonth() + 1;
                    let dd = now.getDate();
                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;
                    const folderName = mm + '-' + dd + '-' + yyyy;
                    

                    console.log(__dirname)
                    var my_dir = `${__dirname}/results/${folderName}`; 
                    if (!fs.existsSync(my_dir)){
                        fs.mkdirSync(my_dir);
                    }

                    curr = path.join(__dirname, 'dataSendCurrNum.json');
                    var fileCurrData = JSON.parse(fs.readFileSync(curr, 'utf-8'))
                    done_count = fileCurrData[0]['fileNum']
                    currFileName = fileCurrData[0]['current_json']

                    console.log("Creating file to store progress...");
                    fs.writeFileSync(path.join(__dirname, 'lastSent.json'), JSON.stringify([{"dataToSendFile": currFileName, "msg": msg}]), (err) => {
                        if (err) {
                            console.error('Error writing CSV file:', err);
                        }
                    });
                    
                    // write(path.join(my_dir, `${fileNameCurr.split('.')[0]}_${done_count}.csv`), ['user', 'message', 'processTime', 'sent_at'], [{'user': tags['username'], 'message': msg, 'processTime': (now.getTime() - msg_sent[0].getTime()), 'sent_at': msg_sent[0]}])
                }
            }
            console.log(`Length of dir: ${fs.readdirSync(path.join(__dirname, 'dataToSend')).length}`)
            if(parseInt(fs.readdirSync(path.join(__dirname, 'dataToSend')).length) == parseInt(0)){
                fs.writeFileSync(path.join(__dirname, 'dataSendCurrNum.json'), JSON.stringify([{"current_json": "experiment complete","fileNum": 0}]), (err) => {
                    if (err) {
                        console.error('Error closing experiment:', err);
                    }
                })
                client.say(target, `Experiment Complete`);
                client.disconnect();
                process.exit(0);
            }
        }
    });
}


autoRenew();
