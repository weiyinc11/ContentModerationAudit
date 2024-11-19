const fs = require('fs');
const path = require("path");
const os = require('os');

fs.writeFileSync('dataSendCurrNum.json', JSON.stringify([{'current_json': 'dataSend_1', 'fileNum': 1}]), {flag: 'w'});

t = path.join(__dirname, 'dataSendCurrNum.json');
let data = JSON.parse(fs.readFileSync(t, 'utf-8'))
done_count = data[0]['fileNum']

console.log(done_count)