const fs = require('fs')

//===================CONSTANTS==========================
const GRAF_LENGTH = 300 //Розмір графа
const CROSSING_OPERATOR = 3 //Оператор схрещування
const MUTATION = 2 //Мутація
const LOCAL_IMPROVE = 10 //Оператор локального покращення
const FIRST_PARENTS = 30 //Перші батьки
const ROUNDS = 1000 //Кількість кругів алгоритму

//===================FUNCTIONS==========================
//Building an oriented graf = [ [1,1,..], [1,1,..], .. ]
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
                    graf[i].push(Math.round(Math.random()*145+5))
                }
            }
        }
        fs.writeFileSync('last_graf.txt', JSON.stringify(graf))
    }
    return graf
}
//Simple greedy search
function find_optimal_way(graf){
    let full_cost = 0
    let full_way = [0]
    for(let i=0, n=0; i<graf.length-1; i++){
        let current_best = {
            value: 200,
            index: null
        }
        for(let j=0; j<graf[i].length; j++){
            if(graf[n][j]<current_best.value&&!full_way.includes(j)){
                current_best.value = graf[n][j]
                current_best.index = j
            }
        }
        full_cost+=current_best.value
        full_way.push(current_best.index)
        n=current_best.index
    }
    console.log('Optimal Way', full_way)
    console.log('Optimal Cost', full_cost)
    return [full_way, full_cost]
}

function generate_random_way(length){
    let way = [0]
    for(let i = 0; i<length-1; i++){
        let new_num = Math.ceil(Math.random()*(length-1))
        while(way.includes(new_num)){
            new_num = Math.ceil(Math.random()*(length-1))
        }
        way.push(new_num)
    }
    return way
}
function calculate_way(way, graf){
    let full_cost = 0
    for(let i=1; i<way.length; i++){
        full_cost+=graf[way[i-1]][way[i]]
    }
    return full_cost
}
function get_best_and_random(arr, graf){
    let temp_arr = arr.map(one=>calculate_way(one, graf))
    let index = temp_arr.indexOf(Math.min(...temp_arr))
    let random_index
    do{
        random_index = Math.round(Math.random()*(arr.length-1))
    }while (random_index===index)

    return [arr[index], arr[random_index]]
}
function arr_crossing([arr1, arr2]){
    let final_arr = []

    let switchOperator = false
    for(let i=0; i<arr1.length; i++){
        if(i%(GRAF_LENGTH/CROSSING_OPERATOR)===0){
            switchOperator=!switchOperator
        }

        if(!switchOperator&&!final_arr.includes(arr1[i])){
            final_arr.push(arr1[i])
        }else {
            if(!final_arr.includes(arr2[i])){
                final_arr.push(arr2[i])
            }
        }
    }
    while(final_arr.length!==arr1.length){
        for(let one of arr1){
            if(!final_arr.includes(one)){
                final_arr.push(one)
            }
        }
    }
    return final_arr
}
function mutation(arr){
    let percent = Math.round(Math.random()*100)
    if(percent>20){
        return arr
    }

    let n1 = Math.floor(Math.random()*arr.length)
    let n2
    do{
        n2  = Math.floor(Math.random()*arr.length)
    } while (n2 === n1)

    let temp_arr = arr.slice(0)

    let temp = temp_arr[n1]
    temp_arr[n1] = temp_arr[n2]
    temp_arr[n2] = temp

    return temp_arr
}
function local_better(arr){
    let calced_way_arr = calculate_way(arr, graf)
    let temp_arr_calc = []
    for(let i=1; i<arr.length; i++){
        temp_arr_calc.push(graf[arr[i-1]][arr[i]])
    }
    while (temp_arr_calc.length>0){
        let temp_arr = arr.slice(0)
        let index = temp_arr_calc.indexOf(Math.max(...temp_arr_calc))
        let min_way_graf = Math.min.apply(null, graf[index].filter(e => e!==null))

        let min_way_graf_index = graf[index].indexOf(min_way_graf)
        let temp_arr_min_graf_index = temp_arr.indexOf(min_way_graf_index)
        let temp = temp_arr[index+1]
        temp_arr[index+1] = min_way_graf_index
        temp_arr[temp_arr_min_graf_index] = temp

        if(calculate_way(temp_arr, graf)<=calced_way_arr){
            return temp_arr
        }
        temp_arr_calc = temp_arr_calc.slice(index, 1)
    }
    return arr
}

let graf = buildGraf(GRAF_LENGTH, true)
//console.log(graf)
//console.log('=============================')

function main(){
    let [optimal_way, optimal_cost] = find_optimal_way(graf)

    //First steps
    let arr = []
    for(let i=0; i<FIRST_PARENTS; i++){
        arr.push(generate_random_way(GRAF_LENGTH))
    }
    //console.log('S1:', calculate_way(arr[0], graf))
    //console.log('S2:', calculate_way(arr[1], graf))
    //console.log('S3:', calculate_way(arr[2], graf))
    //console.log('S3:', calculate_way(arr[3], graf))

    for(let rounds = 0; rounds<ROUNDS; rounds++){
        let child_arr = arr_crossing(get_best_and_random(arr, graf))

        for(let i=0; i<MUTATION; i++){
            child_arr = mutation(child_arr)
        }

        for(let i=0; i<LOCAL_IMPROVE; i++){
            child_arr = local_better(child_arr)
        }

        arr.push(child_arr)
        let temp_calc_arr = arr.map(one=>calculate_way(one, graf))
        arr.splice(temp_calc_arr.indexOf(Math.max(...temp_calc_arr)), 1)
    }
    let temp_calc_arr = arr.map(one=>calculate_way(one, graf))
    let final_arr = arr[temp_calc_arr.indexOf(Math.min(...temp_calc_arr))]
    console.log('Decision: ', final_arr,'\nCost: ', calculate_way(final_arr, graf))

}
main()