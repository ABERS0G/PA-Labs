let active = false
let switcher = 'player'

let rounds = 0

document.querySelector('.restart-button').onclick = ()=>{
    document.querySelector('.dice').style.display = 'none'
    document.querySelector('#opponentPoints').innerHTML = '0'
    document.querySelector('#playerPoints').innerHTML = '0'
    document.querySelector('#OP_Full').innerHTML = '0'
    document.querySelector('#PP_Full').innerHTML = '0'

    active = false
    rounds = 0
}

document.querySelector('#playButton').onclick = ()=>{

    if(active){
        return false
    }
    active = true

    document.querySelector('.dice').style.display = 'flex'

    let first_num = throw_dice(1)
    let second_num = throw_dice(2)
    second_num++
    let full_num = first_num + second_num

    setTimeout(()=>{
        document.querySelector('.menu').addEventListener('click', menu_click)
    }, 5000)

    let menu_click = (e)=>{
        let tg = e.target.innerHTML
        console.log(tg)

        let PointObj = document.querySelector('#playerPoints')
        let point = +PointObj.innerHTML

        switch (tg) {
            case 'ADD': PointObj.innerHTML = '' + (point + full_num); break;
            case 'SUBTRACT': {
                if(full_num>point){
                    alert('Unable')
                    return
                }
                PointObj.innerHTML = '' + (point - full_num);
                break;
            }
            case 'x2': PointObj.innerHTML = point + full_num*2 + ''; break;
            case 'x3': PointObj.innerHTML = point + full_num*3 + ''; break;
            case 'x4': PointObj.innerHTML = point + full_num*4 + ''; break;
            case '/2': PointObj.innerHTML = Math.round(point + full_num/2) + ''; break;
            case '/3': PointObj.innerHTML = Math.round(point + full_num/3) + ''; break;
            case '/4': PointObj.innerHTML = Math.round(point + full_num/4) + ''; break;
        }
        let poi = +document.querySelector('#playerPoints').innerHTML
        if(poi%13===0){
            document.querySelector('#PP_Full').innerHTML = +document.querySelector('#PP_Full').innerHTML + poi/13 + ''
        }

        if(+document.querySelector('#PP_Full').innerHTML >= 10){
            alert('YOU win!)')
            active = true
            return;
        }

        if(rounds===4){
            document.querySelector('#turn').innerHTML = switcher!=='player'?'Your turn':"Opponent's turn"
            rounds = 0
            opponentStep()
        }
        else {
            active = false
            rounds++
        }
        document.querySelector('.menu').removeEventListener('click', menu_click)
    }
}

async function opponentStep(){
    let points = +document.querySelector('#opponentPoints').innerHTML
    let pointsF = +document.querySelector('#OP_Full').innerHTML

    await sleep(1000)

    for(let i=0; i<5; i++){
        let first_num = throw_dice(1)
        let second_num = throw_dice(2)
        second_num++
        let dice_num = first_num + second_num

        let step
        switch (i) {
            case 0: step=3; break;
            case 1: step=3; break;
            case 2: step=3; break;
            case 3: step=2; break;
            case 4: step=1; break;
        }

        await sleep(6000)

        let button_name = count_next_step(points, dice_num, step)
        if(!button_name){
            button_name = find_the_best_way(points, pointsF, dice_num)
        }

        switch (button_name){
            case "add": {
                points+=dice_num
                points%13===0?pointsF+=points/13:null
                break
            }
            case "subtract": {
                points-=dice_num
                points%13===0?pointsF+=points/13:null
                break
            }
            case "x2": {
                points+=dice_num*2
                points%13===0?pointsF+=points/13:null
                break
            }
            case "x3": {
                points+=dice_num*3
                points%13===0?pointsF+=points/13:null
                break
            }
            case "x4": {
                points+=dice_num*4
                points%13===0?pointsF+=points/13:null
                break
            }
            case "d2": {
                points+=Math.round(dice_num/2)
                points%13===0?pointsF+=points/13:null
                break
            }
            case "d3": {
                points+=Math.round(dice_num/3)
                points%13===0?pointsF+=points/13:null
                break
            }
            case "d4": {
                points+=Math.round(dice_num/4)
                points%13===0?pointsF+=points/13:null
                break
            }
        }

        document.querySelector('#'+'b-'+button_name).classList.add('hover')
        document.querySelector('#opponentPoints').innerHTML = points + ''
        document.querySelector('#OP_Full').innerHTML = pointsF + ''

        await sleep(1000)
        document.querySelector('#'+'b-'+button_name).classList.remove('hover')

        if(pointsF >= 10){
            alert('Opponent win!(')
            active = true
            return
        }
    }

    document.querySelector('#turn').innerHTML = 'Your turn'
    active = false

}

// active=false
