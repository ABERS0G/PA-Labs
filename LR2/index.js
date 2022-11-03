const generator=require('generate-maze')
const {SearchTree} = require('./tree.js')

const MAZE_SIZE = 20
let finish = {
    x: MAZE_SIZE-1,
    y: MAZE_SIZE-1,
}

const seed = Math.floor(Math.random()*Math.pow(10, 10)+Math.pow(10,9))
const maze = generator(MAZE_SIZE, MAZE_SIZE, true, seed)
showMaze()
let tree = new SearchTree(maze)
console.log(tree)

document.querySelector('#ids').onclick = ids
document.querySelector('#reset').onclick = showMaze
document.querySelector('#a').onclick = aip

//FUNCTIONS
function showMaze(){
    let html = `<div id="mazeContainer" style="display:grid; grid-template-columns: repeat(${MAZE_SIZE}, 1fr); background-color:whitesmoke; margin: auto; width: min-content">`

    for(let row of maze){
        for(let cell of row){
            html+=`<div style="width: 20px; height: 20px; ${cell.top?'border-top: 1px solid black;':'border-top: 1px solid whitesmoke;'}${cell.left?'border-left: 1px solid black;':'border-left: 1px solid whitesmoke;'}${cell.right?'border-right: 1px solid black;':'border-right: 1px solid whitesmoke;'}${cell.bottom?'border-bottom: 1px solid black;':'border-bottom: 1px solid whitesmoke;'}"></div>`
        }
    }

    document.querySelector('#workArea').innerHTML=html
}
function ids(){
    let n = 0
    let kut = 0
    let stan = 1
    let stan_pam = 1
    tree.moveFull(tree.root, (node)=>{
        n++
        if(node.left===null&&node.top===null&&node.right===null&&node.bottom===null){
            if(node.x===finish.x&&node.y===finish.y){

                return true
            }
            else{
                tree.init(node)
                stan++
                if(node.left!==null){
                    stan_pam++
                }
                if(node.top!==null){
                    stan_pam++
                }
                if(node.right!==null){
                    stan_pam++
                }
                if(node.bottom!==null){
                    stan_pam++
                }
                stan_pam--

                if(node.left===null&&node.top===null&&node.right===null&&node.bottom===null){
                    kut++
                }
                return false
            }
        }
    })
    console.log('n ',n)
    console.log('kut ',kut)
    console.log('stan ',stan)
    console.log('stan_pam ',stan_pam)
    drawWay()
}
function drawWay(node){
    let arr = document.querySelector('#mazeContainer').children
    let currentNode = node?node:tree.aim

    while(currentNode){
        arr[currentNode.y*MAZE_SIZE+currentNode.x].style.backgroundColor = 'red'

        currentNode = currentNode.parent
    }
}
function aip(){
    let arr = [tree.root]
    let finalNode
    let it = 0
    let stan = 0
    let kut = 0

    while(true){
        finalNode = arr[0]
        let finalIndex = 0

        for(let i=0; i<arr.length; i++){
            if(checkDistance(arr[i])<checkDistance(finalNode)){
                finalNode = arr[i]
                finalIndex = i
            }
        }
        if(finalNode.x === MAZE_SIZE-1 && finalNode.y === MAZE_SIZE-1)break
        else{
            stan++
            tree.init(finalNode)

            if(finalNode.left&&finalNode.top&&finalNode.right&&finalNode.bottom){
                kut++
            }

            if(finalNode.left)arr.push(finalNode.left)
            if(finalNode.top)arr.push(finalNode.top)
            if(finalNode.right)arr.push(finalNode.right)
            if(finalNode.bottom)arr.push(finalNode.bottom)

            arr.splice(finalIndex, 1)
        }
        it++
    }
    console.log(it)
    console.log(stan)
    console.log(kut)
    console.log(arr.length)
    drawWay(finalNode)
}
function checkDistance(node){
    return node.wayL + Math.abs(MAZE_SIZE-1-node.x)+Math.abs(MAZE_SIZE-1-node.y)
}