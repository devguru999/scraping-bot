const fs = require('fs')
const utf8 = require('utf8')

const csvWriter = require('csv-write-stream')

module.exports = (file, data) => {
    if (!fs.existsSync('./log')) {
        fs.mkdirSync('./log');
    }

    let strData = utf8.encode(JSON.stringify(data));
    strData = JSON.parse(strData)

    const writer = csvWriter();
    writer.pipe(fs.createWriteStream('./log/' + file));
    strData.forEach(obj => {
        writer.write(obj);        
    });
    writer.end();
}