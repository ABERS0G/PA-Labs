const fs = require('fs')

let filesize = 1024*1024*256

function fullShowFile(name){
    const fd = fs.openSync(name, 'r');

    let prev = -1
    let str = 'FullShowFile for' + name + ': ['

    for(let i=0; i<filesize; ){
        let read_buffer
        if(i+1024*1024*64>filesize){
            read_buffer = Buffer.alloc(filesize-i-1)
            fs.readSync(fd, read_buffer, 0, filesize-i-1 ,i);
            i+=filesize-i-1
        }
        else{
            read_buffer = Buffer.alloc(1024*1024*64)
            fs.readSync(fd, read_buffer, 0, 1024*1024*64 ,i);
            i+=1024*1024*64
        }
        let arr = new Uint8Array(read_buffer)

        for(let one of arr){
            if(one!==prev){
                str+=one+', '
                prev=one
            }
        }
    }
    console.log(str)
}

module.exports = {fullShowFile}