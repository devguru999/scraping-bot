const fs = require('fs')
const csvWriter = require('csv-write-stream')

module.exports = (file, data) => {
    if (!fs.existsSync('./log')) {
        fs.mkdirSync('./log');
    }

    const writer = csvWriter();
    writer.pipe(fs.createWriteStream('./log/' + file));
    data.forEach(obj => {
        writer.write(obj);        
    });
    writer.end();
}