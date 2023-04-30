const BotEngine = require('./src/botengine');
// const Logger = require('./src/jsonlogger');
const CsvWriter = require('./src/csvwriter');

BotEngine('https://www.1688.com/chanpin/-776F6D656E20626167732032303138.html')
// .then((res) => Logger('log.json', res));
.then(async (res) => await CsvWriter('log.csv', res));
