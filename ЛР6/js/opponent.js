class Node {
    constructor(points, finPoints, step, parent = null, current_rand= null) {

        this.parent = parent
        this.finPoints = finPoints
        this.points = points
        this.step = step

        this.arr = []
        if(current_rand){
            for(let i=0; i<11; i++){
                if(current_rand-3===i){
                    this.arr.push({
                        add: null,
                        subtract: null,
                        x2: null,
                        x3: null,
                        x4: null,
                        d2: null,
                        d3: null,
                        d4: null
                    })
                }
                else{
                    this.arr.push(null)
                }
            }
        }
        else {
            for(let i=0; i<11; i++){
                this.arr.push({
                    add: null,
                    subtract: null,
                    x2: null,
                    x3: null,
                    x4: null,
                    d2: null,
                    d3: null,
                    d4: null
                })
            }
        }

    }
}

class Tree{
    constructor(points, finPoints, step, parent = null, current_rand = null, last_step=3) {
        this.root = new Node(points, finPoints, step, parent, current_rand)
        this.last_step = last_step
    }

    init(node){
        for(let i=0; i<11; i++){
            if(node.arr[i]===null){
                continue
            }

            let points = node.points+i+3
            node.arr[i].add = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)

            points = node.points-(i+3)
            if(points>=0){
                node.arr[i].subtract = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)
            }
            else{
                node.arr[i].subtract = null
            }

            points = node.points + i*2
            node.arr[i].x2 = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)

            points = node.points + i*3
            node.arr[i].x3 = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)

            points = node.points + i*4
            node.arr[i].x4 = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)

            points = node.points + Math.round(i/2)
            node.arr[i].d2 = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)

            points = node.points + Math.round(i/3)
            node.arr[i].d3 = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)

            points = node.points + Math.round(i/4)
            node.arr[i].d4 = new Node (points, points%13===0?node.finPoints+points/13:node.finPoints, node.step+1, node)
        }
    }

    full_init(node){

        this.init(node)

        if(node.step === this.last_step){
            return
        }

        for(let one of node.arr){
            if(one === null){
                continue
            }
            for(let two in one){
                if(one[two]!==null){
                    this.full_init( one[two] )
                }
            }
        }
    }

    count(node){
        if(node === null){
            return 0
        }
        let counter = node.finPoints

        for(let one of node.arr){
            if(one !== null){
                for(let two in one){
                    if(one[two] !== null){
                        counter += this.count(one[two])
                    }
                }
            }
        }
        return counter
    }

    moveFull(node, callback) {
        if (node != null) {
            callback(node)
            return this.moveFull(node.left, callback) || this.moveFull(node.top, callback) || this.moveFull(node.right, callback) || this.moveFull(node.bottom, callback);
        }
    }
}

function find_the_best_way(points, finP, current_rand, last_step=3){
    let tree = new Tree(points, finP, 1, null, current_rand, last_step)
    tree.full_init(tree.root)

    let obj = {}

    for(let one in tree.root.arr[current_rand-3]){
        obj[one] = tree.count(tree.root.arr[current_rand-3][one])
    }

    let fin = 'add'
    let fin_value = 0
    console.log(obj)
    for(let one in obj){
        if(obj[one]>fin_value){
            fin = one
            fin_value = obj[one]
        }
    }
    console.log(fin)

    return fin
}

function count_next_step(prev, rand){
    let obj = {
        add: prev + rand,
        subtract: (prev - rand)>=0?prev-rand:null,
        x2: prev + rand*2,
        x3: prev + rand*3,
        x4: prev + rand*4,
        d2: prev + Math.round(rand/2),
        d3: prev + Math.round(rand/3),
        d4: prev + Math.round(rand/4),
    }

    let fin = null
    let finV = 0

    for(let one in obj){
        if(obj[one]%13===0&&finV<obj[one]/13){
            fin = one
            finV = obj[one]/13
        }
    }
    return fin

}