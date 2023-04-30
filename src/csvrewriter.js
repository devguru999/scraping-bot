const fs = require('fs')
const iconv = require('iconv-lite')

const csvReader = require('csv-reader')
const csvWriter = require('csv-write-stream')

module.exports = (file) => {
    if (!fs.existsSync('./log')) {
        fs.mkdirSync('./log');
    }

    let inputStream = fs.createReadStream('./log/' + file, 'utf8');
    let writeStream = fs.createWriteStream('./log/' + file + '.csv');

    inputStream.pipe(new csvReader({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', (row) => {
        console.log(iconv.encode(row, 'GBK'));
    })
    // .pipe(writeStream)
    .on('end', (data) => {
        console.log(data);
    });
    
    // let strData = utf8.encode(JSON.stringify(data));
    // strData = JSON.parse(strData)

    // const writer = csvWriter();
    // writer.pipe(fs.createWriteStream('./log/' + file));
    // strData.forEach(obj => {
    //     writer.write(obj);        
    // });
    // writer.end();
}