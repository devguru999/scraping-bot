const fs = require('fs')
const jsonFile = require('jsonfile')
const iconv = require('iconv-lite')
const csvWriter = require('csv-write-stream')

module.exports = (file) => {
    if (!fs.existsSync('./log')) {
        fs.mkdirSync('./log');
    }

    jsonFile.readFile('./log/' + file)
    .then(data => {
        console.log(data);
        const writer = csvWriter();
        writer.pipe(fs.createWriteStream('./log/' + file.slice(0, -5) + '.csv', 'utf8'));
        data.map(obj => {
            let strData = JSON.stringify(obj);
            iconv.encode(strData, 'UTF8')
            writer.write(JSON.parse(strData)); 
        })
        writer.end();
    });
}