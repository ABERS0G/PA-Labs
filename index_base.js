const fs = require('fs')

let fileSize = 1024
let buffer = Buffer.alloc(1);

//Запись в файл рандомных чисел
function random_write_file(num){
    let rounds = num/1048576
    let ostatok = num%1048576
    const fd = fs.openSync("a_file.bin", 'w');
    for(let i=0; i<Math.floor(rounds); i++){
        let arr = []
        for(let j=0; j<1048576; j++){
            arr.push(Math.floor(Math.random() * 256))
        }
        let buffer = new Buffer.from( new Uint8Array(arr) );
        fs.writeSync(fd, buffer, 0);
    }
    let arr = []
    for(let i=0; i<ostatok; i++){
        arr.push(Math.floor(Math.random() * 256))
    }
    let buffer = new Buffer.from( new Uint8Array(arr) );
    fs.writeSync(fd, buffer, 0);
    fs.closeSync(fd)
}
random_write_file(fileSize)

fs.writeFileSync('b_file.bin', '')
fs.writeFileSync('c_file.bin', '')
const fd_a = fs.openSync("a_file.bin", 'r+');
const fd_b = fs.openSync("b_file.bin", 'r+');
const fd_c = fs.openSync("c_file.bin", 'r+');

//Показать файл
function showFile(fd){
    let new_buffer=new Buffer.alloc(fileSize)
    fs.readSync(fd, new_buffer, 0, fileSize, 0);
    let arr = new Uint8Array(new_buffer)
    console.log(arr)
}

showFile(fd_a)

console.log('Начало сортировки')
let time1 = new Date()

for(let n=1; n<Math.ceil(Math.log(fileSize)/Math.log(2))+1; n++){
    let n_check_b=0, n_check_c=0
    let switcher=0, countSwitcher=0
    for(let i=0; i<fileSize; i++){
        fs.readSync(fd_a, buffer, 0, 1, i);
        if(countSwitcher===Math.pow(2, n)/2){
            countSwitcher=0
            switcher=!switcher
        }
        if(switcher){
            fs.writeSync(fd_b, buffer, 0, 1, n_check_b);
            n_check_b++
        }else{
            fs.writeSync(fd_c, buffer, 0, 1, n_check_c);
            n_check_c++
        }
        countSwitcher++
    }

    n_check_b=0; n_check_c=0
    for(let i=0, b_i=0, c_i=0; i<fileSize; ){
        let bData, cData
        if(n_check_b+n_check_c===Math.pow(2, n)){
            n_check_b=0
            n_check_c=0
        }
        if(n_check_b<Math.pow(2, n)/2){
            let check = fs.readSync(fd_b, buffer, 0, 1, b_i);
            if(check!==0){
                bData = new Uint8Array(buffer)[0]
            }
        }
        if(n_check_c<Math.pow(2, n)/2){
            let check = fs.readSync(fd_c, buffer, 0, 1, c_i);
            if(check!==0){
                cData = new Uint8Array(buffer)[0]
            }
        }
        if(!Number.isInteger(cData)){
            let new_buffer = new Buffer.from( new Uint8Array([bData]) );
            fs.writeSync(fd_a, new_buffer, 0, 1, i);
            b_i++; n_check_b++; i++
            continue
        }
        if(!Number.isInteger(bData)){
            let new_buffer = new Buffer.from( new Uint8Array([cData]) );
            fs.writeSync(fd_a, new_buffer, 0, 1, i);
            c_i++; n_check_c++; i++
            continue
        }
        if(bData<cData){
            let new_buffer = new Buffer.from( new Uint8Array([bData]) );
            fs.writeSync(fd_a, new_buffer, 0, 1, i);
            b_i++; n_check_b++; i++
        }else{
            let new_buffer = new Buffer.from( new Uint8Array([cData]) );
            fs.writeSync(fd_a, new_buffer, 0, 1, i);
            c_i++; n_check_c++; i++
        }
    }
    fs.writeFileSync('b_file.bin', '')
    fs.writeFileSync('c_file.bin', '')
}
let time2 = new Date()
console.log('Сортировка пройдена')
showFile(fd_a)
console.log('Время: ', time2-time1)

fs.close(fd_a)
fs.close(fd_b)
fs.close(fd_c)
fs.unlinkSync('b_file.bin')
fs.unlinkSync('c_file.bin')