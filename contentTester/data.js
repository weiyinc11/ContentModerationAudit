async function read_csv(csv_file){
    const fs = require('fs');
    const path = require("path");

    const directory = path.join(__dirname, 'dataToSend');
    console.log(directory);
    fs.readFile(csv_file, (err, inputD) => {
        if (err) throw err;
            console.log(inputD.toString());
            csvToJson(inputD.toString()).then(
                (data) => {
                    fs.writeFile(directory + '/' + csv_file.replace('.csv', '.json'), data, (err) => {
                        if (err)
                            console.log(err);
                        else {
                            console.log("Check your file");
                        }
                    })
                }
            )
    })
}

async function csvToJson(csv_string){
    const rows = csv_string.split('\n');
    const header = rows[0].split(',');

    const jsonString = []; 
    for (let i=1; i < rows.length; i++){
        const values = rows[i].split(',');
        const object = {};
        for (let j=0; j < header.length; j++){
            object[header[j].trim()] = values[j].trim();
        }
        jsonString.push(object)
    }

    return JSON.stringify(jsonString);
}

// Import the csv file into the same folder as this data.js file. 
read_csv('/content_moderation_twitch_examples.csv');