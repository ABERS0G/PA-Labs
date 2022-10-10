const fs = require('fs')

function make_my_array(arr){
    const fd = fs.openSync("a_file.bin", 'w');
    let buffer = new Buffer.from( new Uint8Array(arr) );
    fs.writeSync(fd, buffer, 0);
    fs.closeSync(fd)
}

make_my_array([25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1])