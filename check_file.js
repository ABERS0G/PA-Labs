const fs = require('fs')
let filesize = 1024*1024*512

console.log('start')

const fd = fs.openSync("a_file.bin", 'r');

let last
let check = true
for(let i=0, n=0; i<filesize; ){
    console.log('itteration', ++n)

    let read_buffer
    if(i+1024*1024*128>filesize){
        console.log('Вызов')
        read_buffer = Buffer.alloc(filesize-i-1)
        fs.readSync(fd, read_buffer, 0, filesize-i-1 ,i);
        i+=filesize-i-1
    }
    else{
        read_buffer = Buffer.alloc(1024*1024*128)
        fs.readSync(fd, read_buffer, 0, 1024*1024*128 ,i);
        i+=1024*1024*128
    }
    let arr = new Uint8Array(read_buffer)

    /*let str = 'Contains: ['
    for(let h=0; h<256; h++){
        if(arr.includes(h)){
            str+=h+', '
        }
    }
    console.log(str)*/

    if(last){
        if(last>arr[0]){
            console.log('last_false')
            console.log(last, arr[0], arr[1], arr[arr.length-1])
            check=false
        }
    }
    for(let j=1; i<arr.length; j++){
        if(arr[j]<arr[j-1]){
            console.log('inner_false')
            check=false
        }
    }
    last=arr[arr.length-1]
}

console.log(check)