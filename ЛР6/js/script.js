const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xffffff, 0);
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector('.dice').appendChild( renderer.domElement );

const directionalLight = new THREE.DirectionalLight( 0xffffff);
directionalLight.position.set(0, 0, 10)
scene.add( directionalLight );

const textureLoader = new THREE.TextureLoader();
let textureCube = [
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-one.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-two.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-three.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-four.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-five.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-six.png")
    }),
]
let textureCube2 = [
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-two.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-three.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-four.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-five.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-six.png")
    }),
    new THREE.MeshStandardMaterial({
        map: textureLoader.load("./imgs/dice/dice-six-faces-seven.png")
    }),
]

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube = new THREE.Mesh( geometry, textureCube );
const cube2 = new THREE.Mesh( geometry, textureCube2 );
cube.position.x = -1
cube2.position.x = 1
scene.add( cube );
scene.add( cube2 );

camera.position.z = 10;

function show() {
    requestAnimationFrame( show );
    renderer.render( scene, camera );
}
show();

function throw_dice(one_dice){
    const num = Math.round(Math.random()*5+1)

    let xf = gradus_to_radian(1080)
    let yf = gradus_to_radian(1080)

    switch (num){
        case 3: xf += gradus_to_radian(90); break;
        case 4: xf += gradus_to_radian(270); break;
        case 2: yf += gradus_to_radian(90); break;
        case 1: yf += gradus_to_radian(270); break;
        case 5: break;
        case 6: xf += gradus_to_radian(180); break;
    }

    animation({
        duration: 5000,
        timing: circOut,
        draw(progress){
            if(one_dice===1){
                cube.rotation.x = xf * progress
                cube.rotation.y = yf * progress

                if(progress<=0.1){
                    camera.position.z = 10 - 50 * progress
                }
                if(progress>=0.95){
                    camera.position.z = 10 - 100 * (1-progress)
                }
            }
            else {
                cube2.rotation.x = xf * progress
                cube2.rotation.y = yf * progress
            }
        }
    })

    return num
}

function gradus_to_radian(grad){
    const PI = 3.1415926535897932384626433832795
    return grad*PI/180
}
