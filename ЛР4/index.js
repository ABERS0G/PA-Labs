const fs = require('fs')

function buildGraf(num, load=false){
    let graf = []
    if(load){
        graf = JSON.parse(fs.readFileSync('last_graf.txt').toString())
    }else{
        for(let i=0; i<num; i++){
            graf.push([])
            for(let j=0; j<num; j++){
                if(i===j){
                    graf[i].push(null)
                }else{
                    graf[i].push(Math.floor(Math.random()*46+5))
                }
            }
        }
        fs.writeFileSync('last_graf.txt', JSON.stringify(graf))
    }

    return graf
}
function build_d_graf(graf){
    let d_graf = []

    for(let one of graf){
        d_graf.push(one.slice(0))
    }

    for(let i=0; i<graf.length; i++){
        for(let j=0; j<graf.length; j++){
            if(d_graf[i][j]){
                d_graf[i][j] = 1/d_graf[i][j]
            }
        }
    }

    return d_graf
}
function build_feromon_graf(num, load=false){
    let graf = []

    if(load){
        graf = JSON.parse(fs.readFileSync('last_feromon_graf.txt').toString())
    }else{
        for(let i=0; i<num; i++){
            graf.push([])
            for(let j=0; j<num; j++){
                if(i===j){
                    graf[i].push(null)
                }else{
                    graf[i].push(Math.floor(Math.random()*3+1)/10)
                }
            }
        }
        fs.writeFileSync('last_feromon_graf.txt', JSON.stringify(graf))
    }

    return graf
}

function find_Lmin(graf){
    let l = 0
    let visited = [0]

    for(let i=0; i<graf.length; i++){
        let current = {
            weight: 100,
            num: visited[visited.length-1]
        }
        let prev_mum = visited[visited.length-1]

        for(let j=0; j<graf.length; j++){
            if(graf[prev_mum][j]&&!visited.includes(j)&&graf[prev_mum][j]<current.weight){
                current.weight = graf[prev_mum][j]
                current.num = j
            }
        }

        if(visited.length===graf.length){
            visited.push(0)
            l+=graf[current.num][0]
        }else{
            visited.push(current.num)
            l+=current.weight
        }
    }

    return [visited, l]
}
//Функция, которая выводит результаты по основному массиву феромона
function show_way(){
    let current_feromon = 0
    let str = '[ 0 '
    let arr = []
    for(let i=0; i<feromon_graf.length; i++){
        let index = feromon_graf[current_feromon].indexOf(Math.max.apply(null, feromon_graf[current_feromon]))
        str+= index + ' '
        arr.push(index)
        current_feromon = index
    }
    let sum = 0
    let next = 0
    for(let one of arr){
        sum+=graf[next][one]
        next = one
    }
    console.log(str, ']')
    console.log('Final l: ', sum)
}

//Константы из задачи
const alfa_const = 2
const beta_const = 3
const ro_const = 0.4
const M_const = 10
const graf_length = 150

//Строим граф
let graf = buildGraf(graf_length)
let d_graf = build_d_graf(graf)
//Строим граф феромонов
let feromon_graf = build_feromon_graf(graf_length)
//Находим Lmin жадным алгоритмом
let [arr, Lmin] = find_Lmin(graf)

console.log('Lmin: ', Lmin)

//Второй массив феромона, который аккамулирует новые значения и потом перезаписывает основной в конце итерации
let feromon_graf_temp = []
for(let one of feromon_graf){
    feromon_graf_temp.push(one.slice(0))
}

//Главная функция алгоритма
function main_func(){
    let l = 0
    let visited = [Math.floor(Math.random()*graf_length)]

    for(let i=0; i<graf.length; i++){
        let current = {
            weight: 100,
            num: visited[visited.length-1],
            p: 0
        }
        let this_num = visited[visited.length-1]

        let i_sum = 0
        for(let c=0; c<graf.length; c++){
            i_sum+=Math.pow(d_graf[this_num][c], beta_const)*Math.pow(feromon_graf[this_num][c], alfa_const)
        }

        for(let j=0; j<graf.length; j++){
            if(graf[this_num][j]&&!visited.includes(j)){
                let next_p = Math.pow(d_graf[this_num][j], beta_const)*Math.pow(feromon_graf[this_num][j], alfa_const)/i_sum
                if(next_p>current.p){
                    current.weight = graf[this_num][j]
                    current.num = j
                    current.p = next_p
                }
            }
        }

        if(visited.length===graf.length){
            visited.push(visited[0])
            l+=graf[current.num][visited[0]]
        }else{
            visited.push(current.num)
            l+=current.weight
        }
    }

    let feromon_current = visited[0]
    for(let c=0; c<graf.length; c++){
        for(let c2 = 0; c2<graf.length; c2++){
            if(feromon_graf_temp[feromon_current][c2]&&c2===visited[c+1]){
                feromon_graf_temp[feromon_current][c2] +=Lmin/l
            }

        }
        feromon_current = visited[c+1]
    }

    return [visited, l]
}

function iteration(){
    //Первая часть работы с феромоном (перемножаем все на коофициэнт)
    //Сейчас видоизменяется дополнительный массив с феромонами, который не участвует в вычислениях
    for(let i=0; i<feromon_graf_temp.length; i++){
        for(let j=0; j<feromon_graf_temp; j++){
            feromon_graf_temp[i][j] = (1-ro_const)*feromon_graf_temp[i][j]
        }
    }
    //Главная функция для М муравьёв
    for(let circle = 0; circle<M_const; circle++){
        main_func()
    }
    //Перезаписываем основное значение феромона (таким образом, чтобы не было ссылок)
    feromon_graf = []
    for(let one of feromon_graf_temp){
        feromon_graf.push(one.slice(0))
    }
}

//Цикл итераций
for(let one = 0; one<1000; one++){
    iteration()
}

show_way()

// for(let one of feromon_graf){
//     let str = ''
//     for(let two of one){
//         if(two){
//             str+=Math.floor(two*100)/100+' '
//         }else{
//             str+=two+' '
//         }
//     }
//     console.log(str)
// }