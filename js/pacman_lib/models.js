/**
 * @author José Neto Gonçalves
 * @author Maxime Hutinet
 * @author David Laroche
 */

/**
 * levels objects
 */
class Levels{
    constructor() {
        this.name = "";
        this.level_map = [];
    }

    Level_1(){
        this.name = "Level 1";
        this.level_map = new Array([
            "# # # # # # # # # #",
            "# . # # # # . . . #",
            "# . . . . . . # # #",
            "# . . . # # G # # #",
            "# # # . # # . . . #",
            "# # # . # # . # . #",
            "# . . . # # . # . #",
            "# . # . . . . . . #",
            "# . . . . # # P # #",
            "# # # # # # # # # #",
        ])
    }

    Level_2(){
        this.name = "Level 2";
        this.level_map = new Array([
            "# # # # # # # # # #",
            "# . # # # # . . . #",
            "# . . . . . . # # #",
            "# . . . # # G # # #",
            "# # # . # # . . . #",
            "# # # . # # . # . #",
            "# . . . # # . # . #",
            "# . # . . . . . . #",
            "# . . . . # # P # #",
            "# # # # # # # # # #",
        ])
    }
}

function gltf_loader(model_type, baseMap, ghostMap, row, col){
    const loader = new THREE.GLTFLoader(manager);

    if (model_type === "pacman") {
        let model_path = '../models/pacman.glb';
        loader.load( model_path,
            // Here 'gltf' will be loaded
            function ( data ) {
                let model = data.scene;
                model.name = "pacman_model";
                model.scale.set(0.4,0.4,0.4);
                model.position.set( col/2, 0.1, row);
                baseMap[row][col/2] = model;
                ghostMap[row][col/2] = model;
                model.children[2].castShadow = true;
                model.children[2].receiveShadow = true;
                scene.add( model );
            },
            function( xhr ){
                //console.log( ( Math.round( xhr.loaded / xhr.total, 2 ) * 100 ) + '% loaded -> PacMan' );
            },
            function( error ){
                console.log( 'error:' + error.message );
            }
        );
    } else if (model_type === "ghost"){
        let model_path = '../models/ghost1.glb';
        loader.load( model_path,
            // Here 'gltf' will be loaded
            function ( data ) {
                let model = data.scene;
                model.name = "ghost1_model";
                model.scale.set(0.4,0.4,0.4);
                model.position.set( col/2, 0.1, row );
                ghostMap[row][col/2] = model;
                model.children[2].castShadow = true;
                model.children[2].receiveShadow = true;
                scene.add( model );
            },
            function( xhr ){
                //console.log( ( Math.round( xhr.loaded / xhr.total, 2 ) * 100 ) + '% loaded -> Ghost' );
            },
            function( error ){
                console.log( 'error:' + error.message );
            }
        );
    }
    else if (model_type === "wall"){
        let model_path = '../models/wall.glb';
        loader.load(model_path,
            function (data) {
                let model = data.scene;
                model.name = "wall";
                model.scale.set(0.8,0.6,0.8);
                model.position.set( col/2, 0.25, row );
                ghostMap[row][col/2] = model;
                baseMap[row][col/2] = model;
                model.children[2].castShadow = true;
                model.children[2].receiveShadow = true;
                scene.add( model );
            },
            function(xhr){
                //console.log( ( Math.round( xhr.loaded / xhr.total, 2 ) * 100 ) + '% loaded -> Wall' );
            },
            function( error ){
                console.log( 'error:' + error.message );
            }
        );
    }
}

/**
 * Create a wall object
 * @param color
 * @returns {ca}
 */
function createWall(color){
    let geometry = new THREE.BoxGeometry( 1, 0.5, 1 );
    let material = new THREE.MeshPhongMaterial( { color: color } );
    return new THREE.Mesh( geometry, material );
}

/**
 * Create a ball object
 * @param radius
 * @param color
 * @returns {ca}
 */
function createBall(radius, color){
    let geometry = new THREE.SphereGeometry( radius, 32, 32 );
    let material = new THREE.MeshPhongMaterial( {color: color, specular: 0x222222, shininess: 0} );
    return new THREE.Mesh( geometry, material );
}

/**
 * Create a ghost object
 * @returns {ca}
 */
function createGhost(){
    let geometry = new THREE.ConeGeometry( 0.3, 0.5, 32 );
    let material = new THREE.MeshPhongMaterial( {color: getRandomColor()} );
    return new THREE.Mesh( geometry, material );
}

/**
 * Build the map based on a matrix
 * @param matrix
 * @returns {any[][][]}
 */
function buildMap(matrix){
    let baseMap = Array(matrix.length).fill().map(()=>Array((matrix[0].length + 1)/2).fill());
    let ghostMap = Array(matrix.length).fill().map(()=>Array((matrix[0].length + 1)/2).fill());
    let ghostCounter = 0;

    for(let row = 0; row < matrix.length; row ++) {
        for(let col = 0; col < matrix[row].length; col += 2){
            switch(matrix[row][col]) {
                // Walls
                case "#":
                    gltf_loader("wall", baseMap, ghostMap, row, col);
                    break;

                // Balls
                case ".":
                    let ball = createBall(0.1, RED);
                    ball.name = "ball";
                    ball.position.set( col/2, 0.25, row );
                    baseMap[row][col/2] = ball;
                    ghostMap[row][col/2] = undefined;
                    ball.castShadow = true;
                    ball.receiveShadow = true;
                    scene.add( ball );
                    goal += 100; // Increase the score to reach
                    break;

                // Ghosts
                case "G":
                    gltf_loader("ghost", baseMap, ghostMap, row, col);
                    ghostCounter++;
                    break;

                // Pacman
                case "P":
                    gltf_loader("pacman", baseMap, ghostMap, row, col);
                    break;
                default:
                    break;

            }
        }
    }

    // Add floor
    let geoFloor = new THREE.BoxBufferGeometry( 10, 0.1, 10 );
    let matGround = new THREE.MeshStandardMaterial( { color: 0xB69E69, roughness: 2, metalness: 0.2 } );
    let mshGround = new THREE.Mesh( geoFloor, matGround );
    mshGround.position.set(4.5,0,4.5);
    mshGround.castShadow = true;
    mshGround.receiveShadow = true;
    scene.add( mshGround );

    return [baseMap, ghostMap];
}
