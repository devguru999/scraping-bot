const BotEngine = require('./src/botengine');
// const Logger = require('./src/jsonlogger');
// const CsvWriter = require('./src/csvwriter');
// const CsvRewriter = require('./src/csvrewriter')
const Json2Csv = require('./src/json2csv')

// CsvRewriter('log.csv');
// BotEngine('https://www.1688.com/chanpin/-776F6D656E20626167732032303138.html')
// .then(async (res) => await Logger('log.json', res));
// .then(async (res) => await CsvWriter('log.csv', res));
Json2Csv('log.json')
