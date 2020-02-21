const fs = require('fs');
const pdf = require('pdf-parse');
const fileName = process.argv.toString().split('--')[1];

let dataBuffer = fs.readFileSync(`${fileName}.pdf`);

pdf(dataBuffer).then(function(data) {
    let write = data.text
        .split('12345678')[1]
        .split('LOWER')[0]
        .split('Number')[0]

    for (let i = 0; i < write.length; i++) {
        if(write[i]=='\n'){
            watchForString = true;
        }
        // iterate over county name until the first number and add placeholder
        if(watchForString && Number(write[i]) && !Number(write[i-1])){
            write = write.substring(0, i) + '...placeholder...' + write.substring(i, write.length);
            watchForString = false;
        }
        // 3 digits behind every comma is the beginning of the new number
        if(write[i] === ','){
            write = write.substring(0, i+4) + '...placeholder...' + write.substring(i+4, write.length);
        }
    }
    // remove commas and replace placeholder values with comma
    write = write.split(',').join('')
    .split('...placeholder...').join(',');
    fs.writeFileSync(`${fileName}.csv`, write);
});