const fs = require('fs')

module.exports = (file, data) => {
    if (!fs.existsSync('./log')) {
        fs.mkdirSync('./log');
    }
    fs.writeFileSync('./log/' + file, JSON.stringify(data, null, 2));
}