
function animation({timing, draw, duration}) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // вычисление текущего состояния анимации
        let progress = timing(timeFraction);

        draw(progress); // отрисовать её

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}
function makeEaseOut(timing) {
    return function(timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}
function quad(timeFraction) {
    return Math.pow(timeFraction, 2)
}
let circOut = makeEaseOut(quad)

async function main(){
    await sleep(1000)
    document.querySelector('.intro').style.opacity = '1'
    await sleep(1000)

    document.querySelector('.play-table').style.opacity = '1'
    await sleep(1000)

    animation({
        duration: 800,
        timing: quad,
        draw(progress){
            document.querySelector('.middle13').style.width = progress * 100 + '%'
        }
    })
    await sleep(800)
    document.querySelector('.intro').style.opacity='0.5'

    await sleep(400)
    document.querySelector('.play-table *').style.zIndex = '1'
}
main()

function sleep (ms){
    return new Promise((res, rej)=>{
        setTimeout(res, ms)
    })
}