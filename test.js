const fs =require("fs");

const fd_a = fs.openSync("a_file.bin", 'r+');

let buffer = new Buffer.from( new Uint8Array([1]) );
fs.writeSync(fd_a, buffer, 0, 1, 0);

buffer = new Buffer.from( new Uint8Array([2]) );
fs.writeSync(fd_a, buffer, 0, 1, 1);

buffer = new Buffer.from( new Uint8Array([3]) );
fs.writeSync(fd_a, buffer, 0, 1, 2);

buffer = new Buffer.from( new Uint8Array([4]) );
fs.writeSync(fd_a, buffer, 0, 1, 3);