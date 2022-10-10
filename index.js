const fs = require('fs')

fileSize = 1024*1024
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
//random_write_file(fileSize)
function random_gig(){
    const fd = fs.openSync("a_file.bin", 'w');
    let arr = []
    for(let i=0; i<fileSize; i++){
        arr.push(Math.floor(Math.random() * 256))
    }
    let buffer = new Buffer.from( new Uint8Array(arr) );
    fs.writeSync(fd, buffer, 0);
    fs.closeSync(fd)
}
random_gig();

//Подготовка файлов
fs.writeFileSync('b_file.bin', '')
fs.writeFileSync('c_file.bin', '')
const fd_a = fs.openSync("a_file.bin", 'r+');
const fd_b = fs.openSync("b_file.bin", 'r+');
const fd_c = fs.openSync("c_file.bin", 'r+');

//Показать файл
function showFile(fd){
    let arr =[]
    for(let i=0; i<fileSize; i++){
        fs.readSync(fd, buffer, 0, 1, i);
        //console.log(new Uint8Array(buffer)[0])
        arr.push(new Uint8Array(buffer)[0])
    }
    console.log(arr)
}
showFile(fd_a)

console.log('Начало сортировки')
let time1 = new Date()

//Предварительная быстрая сортировка
let fastSortNum = Math.pow(2, Math.floor(Math.log(fileSize/2)/Math.log(2)))
let fastArrayLength = fastSortNum<=Math.pow(1024, 2)?fastSortNum:Math.pow(1024, 2)
//let fastArrayLength = 1024
//console.log(fastArrayLength)
//console.log(Math.log(fastArrayLength)/Math.log(2))
for(let i=0; i<=fileSize; i+=fastArrayLength){
    let fastBuffer = Buffer.alloc(fastArrayLength)
    fs.readSync(fd_a, fastBuffer, 0, fastArrayLength, i)
    if(i+fastArrayLength>fileSize){
        fastBuffer = Buffer.alloc(fileSize%fastArrayLength)
        fs.readSync(fd_a, fastBuffer, 0, fileSize%fastArrayLength, i)
        let arr = new Uint8Array(fastBuffer)
        //console.log(arr)
        arr.sort(compareNumeric)
        fs.writeSync(fd_a, arr, 0, fileSize%fastArrayLength, i)
        break
    }
    let arr = new Uint8Array(fastBuffer)
    //console.log(arr)
    arr.sort(compareNumeric)
    fs.writeSync(fd_a, arr, 0, fastArrayLength, i)
}
//showFile(fd_a)

//Сортировка
for(let n=Math.log(fastArrayLength)/Math.log(2)+1; n<Math.ceil(Math.log(fileSize)/Math.log(2))+1; n++){
    let finish = false
    let n_check_b=0, n_check_c=0
    let switcher=0, countSwitcher=0
    for(let i=0; i<fileSize; i+=Math.pow(2,n-1)){
        let read_buffer
        if(i+Math.pow(2,n-1)>fileSize){
            read_buffer = Buffer.alloc(fileSize-i)
            fs.readSync(fd_a, read_buffer, 0, fileSize-i, i);
            finish = true
        }else{
            read_buffer = Buffer.alloc(Math.pow(2,n-1))
            fs.readSync(fd_a, read_buffer, 0, Math.pow(2,n-1), i);
        }

        let arr_a = new Uint8Array(read_buffer)
        let arr_b=[], arr_c=[]
        for(let one of arr_a){
            if(countSwitcher===Math.pow(2, n)/2){
                countSwitcher=0
                switcher=!switcher
            }
            if(switcher){
                arr_b.push(one)
            }else{
                arr_c.push(one)
            }
            countSwitcher++
        }
        // console.log('ARR_B: ', arr_b)
        // console.log('ARR_C: ', arr_c)
        // console.log('-------')
        if(arr_b.length>0){
            fs.writeSync(fd_b, new Buffer.from( new Uint8Array(arr_b) ), 0, arr_b.length, n_check_b);
            n_check_b+=arr_b.length
        }
        if(arr_c.length>0){
            fs.writeSync(fd_c, new Buffer.from( new Uint8Array(arr_c) ), 0, arr_c.length, n_check_c);
            n_check_c+=arr_c.length
        }
        if(finish)break
    }

    let b_length = n_check_b, c_length = n_check_c
    n_check_b=0; n_check_c=0
    for(let i=0, b_i=0, c_i=0; i<fileSize; ){
        let write_buffer_b = Buffer.alloc(Math.pow(2, n-1))
        let write_buffer_c = Buffer.alloc(Math.pow(2, n-1))

        let array_b = [], array_c = []

        if(b_i+Math.pow(2, n-1)<=b_length){
            fs.readSync(fd_b, write_buffer_b, 0, Math.pow(2, n-1), b_i);
        }else{
            if(b_length-b_i!==0){
                write_buffer_b = Buffer.alloc(b_length-b_i)
                fs.readSync(fd_b, write_buffer_b, 0, b_length-b_i, b_i)
            }
        }
        if(c_i+Math.pow(2, n-1)<=c_length){
            fs.readSync(fd_c, write_buffer_c, 0, Math.pow(2, n-1), c_i);
        }else{
            if(c_length-c_i!==0){
                write_buffer_c = Buffer.alloc(c_length-c_i)
                fs.readSync(fd_c, write_buffer_c, 0, c_length-c_i, c_i)
            }
        }
        if(b_length-b_i!==0){
            array_b = new Uint8Array(write_buffer_b)
            b_i+=array_b.length
        }
        if(c_length-c_i!==0){
            array_c = new Uint8Array(write_buffer_c)
            c_i+=array_c.length
        }

        let arr = [...array_b, ...array_c]
        arr.sort(compareNumeric)

        //console.log('Sorted Array: ', arr)

        fs.writeSync(fd_a, new Buffer.from(new Uint8Array(arr)), 0, arr.length, i);
        i+=arr.length
    }

    //console.log('AAA')
    //showFile(fd_a)
    fs.writeFileSync('b_file.bin', '')
    fs.writeFileSync('c_file.bin', '')
}


let time2 = new Date()
console.log('Сортировка пройдена')
showFile(fd_a)
console.log('Время: ', time2-time1)

//Закрытие потоков
fs.close(fd_a)
fs.close(fd_b)
fs.close(fd_c)
fs.unlinkSync('b_file.bin')
fs.unlinkSync('c_file.bin')


function compareNumeric(a, b) {
    if (a > b) return 1;
    if (a === b) return 0;
    if (a < b) return -1;
}