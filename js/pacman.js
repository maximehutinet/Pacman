/**
 * @author José Neto Gonçalves
 * @author Maxime Hutinet
 * @author David Laroche
 */


/** Utils *************************************************************************************************/
/**
 * Sleep function
 * @param seconds
 */
function sleep(seconds){
    var waitUntil = new Date().getTime() + seconds*1000;
    while(new Date().getTime() < waitUntil) true;
}
/**
 * Function used to get random color
 * @returns {number}
 */
function getRandomColor() {
    let value = Math.floor(Math.random() * Math.floor(colors.length));
    return colors[value];
}

/**
 * Function for debug in order to check the object inside the map
 * @param map
 */
function displayMap(matrix){
  console.log("-------------");
    for(let i = 0; i < matrix.length; i++){
        console.log("\n");
        for(let j = 0; j < matrix[0].length; j++){
          try{
            console.log(matrix[i][j].name + " ");
          }
          catch(err){
            console.log("X");
          }
        }
    }
    console.log("-------------");
}

/**
 * function used to display scene childs
 */
function display_scene_childs(){
    scene.traverse(function(child) {
        console.log (child);
    });
}

/**
 * Remove Pacman icon from web interface
 */
function remove_life(){
  let count = $(".life").length;

  if(count > 0){
    $(".life").first().remove();
  }
}

/**
 * Display a modal on the web interface
 */
function display_modal(message){
  $(".modal-body").html(
    '<p>' + message + '</p>' +
    '<a class="btn btn-warning" href="/">Restart</a>'
  );
  $("#modal-game").modal('show');

}

/** Movement Logic ****************************************************************************************/
/**
 * Detects if the next position is allowed
 * @param nextPosition
 * @returns {boolean}
 */
function isAllowed(nextPosition) {
    if(isDead){
        return false;
    }
    if(nextPosition === undefined){
        return true;
    }
    return !(nextPosition.name === "wall");
}

/**
 * Detects if the next position is a Ball
 * @param nextPosition
 * @returns {boolean}
 */
function isBall(nextPosition) {
    if(nextPosition === undefined){
        return false;
    }
    return nextPosition.name === "ball";
}

/**
 * Detects if the next position is a Ghost
 * @param nextPosition
 * @returns {boolean}
 */
function isGhost(nextPosition) {
    if(nextPosition === undefined){
        return false;
    }
    return nextPosition.name.startsWith("ghost");
}

/**
 * Detects if the next position is PacMan
 * @param nextPosition
 * @returns {boolean}
 */
function isPacman(nextPosition) {
    if(nextPosition === undefined){
        return false;
    }
    return nextPosition.name === "pacman_model";
}

/**
 * Detects if pacman hits a ghost and reduce life -1
 * @param object
 */
function collide(object) {
    object.children[2].children[0].material.color.setHex( RED );
    life -= 1;
    pacman_death();
    isDead = true;
    if(life > 0){
      setTimeout(restart, 2000);
      object.children[2].children[0].material.color.setHex( YELLOW );
    }
    else{
      display_modal("Game Over");
    }
}

/**
 * Return a list of possible moves based on the position of the object
 * @param object
 * @returns {[]}
 */
function getPossibleMoves(object){
    let currentPosition = object.position;
    let possibleMoves = [];
    let row;
    let col;

    let dir = {
        up: [currentPosition.z - 1, currentPosition.x],
        down: [currentPosition.z + 1, currentPosition.x],
        left: [currentPosition.z, currentPosition.x - 1],
        right: [currentPosition.z, currentPosition.x + 1]
    };

    Object.keys(dir).forEach(function(key) {
        row = dir[key][0];
        col = dir[key][1];
        if(isAllowed(mapGhost[row][col])){
            possibleMoves.push(key);
        }
    });
    return possibleMoves
}

/**
 * Function used to rotate model
 * @param object
 * @param direction
 */
function figure_rotation(object, direction){
  switch(direction) {
      case "up":
          try{
            for(let i = 2; i < object.children.length; i++){
              object.children[i].rotation.y = 0;
            }
          }
          catch(err){}
          break;
      case "down":
          try{
            for(let i = 2; i < object.children.length; i++){
              object.children[i].rotation.y = Math.PI;
            }
          }
          catch(err){}
          break;
      case "left":
          try{
            for(let i = 2; i < object.children.length; i++){
              object.children[i].rotation.y = 90 * Math.PI / 180;
            }
          }
          catch(err){}
          break;
      case "right":
          try{
            for(let i = 2; i < object.children.length; i++){
              object.children[i].rotation.y = -90 * Math.PI / 180;
            }
          }
          catch(err){}
          break;
  }
}



/**
 * Function used to move elements
 * @param object
 * @param direction
 */
function move(object, direction){
    let currentPosition = object.position;
    let nextPosition;
    let col;
    let row;
    let dir;


    switch(direction){
        case "up":
            row = currentPosition.z - 1;
            col = currentPosition.x;
            dir = new THREE.Vector3( 0, 0, -1 );
            break;
        case "down":
            row = currentPosition.z + 1;
            col = currentPosition.x;
            dir = new THREE.Vector3( 0, 0, 1 );
            break;
        case "left":
            row = currentPosition.z;
            col = currentPosition.x - 1;
            dir = new THREE.Vector3( -1, 0, 0 );
            break;
        case "right":
            row = currentPosition.z;
            col = currentPosition.x + 1;
            dir = new THREE.Vector3( 1, 0, 0 );
            break;

    }

    // If the current object is pacman
    if(isPacman(object)){
        nextPosition = map[row][col];
        nextPositionGhost = mapGhost[row][col];

        if(isAllowed(nextPosition)){
            if(isBall(nextPosition)){
                scene.remove(nextPosition);

                // Set the current position with the object
                map[row][col] = object;
                mapGhost[row][col] = object;

                // Replace the previous position by none in both map
                map[currentPosition.z][currentPosition.x] = undefined;
                mapGhost[currentPosition.z][currentPosition.x] = undefined;

                pacman_eat();
                score += 100;
                update_score(score);

                if(wonGame()){
                  display_modal("You just won the game !");
                }
            }
            else if(isGhost(nextPositionGhost)){
                collide(pacman)
            }

            object.translateOnAxis(dir, 1);
            figure_rotation(object, direction);
        }
    }
    // If the current object is a ghost
    else if(isGhost(object)){
        nextPosition = mapGhost[row][col];

        if(isAllowed(nextPosition)){
            mapGhost[currentPosition.z][currentPosition.x] = undefined;
            mapGhost[row][col] = object;
            object.translateOnAxis(dir, 1);
            figure_rotation(object, direction);

            if(isPacman(nextPosition)){
                collide(pacman)
            }
        }
    }
}

/**
 * Function used to move ghost on the map
 * @param object
 * @param time
 */
function moveGhost(object){
    let possibleMoves = getPossibleMoves(object);
    let currentPosition = object.position;
    let pacmanPosition = pacman.position;

    let xDiff = currentPosition.x - pacmanPosition.x;
    let yDiff = currentPosition.z - pacmanPosition.z;

    if(xDiff >= 0 && possibleMoves.includes("left")){
        move(object, "left");
    }
    else if (xDiff < 0 && possibleMoves.includes("right")) {
        move(object, "right");
    }
    else if (yDiff >= 0 && possibleMoves.includes("down")) {
        move(object, "down");
    }
    else if (yDiff < 0 && possibleMoves.includes("up")) {
        move(object, "up");
    }

}
/** Scoring Function ***************************************************************************************/
function update_score(score){
    $('#score_value').html(score);
}

/**
 * Check if the user won the game
 * @returns {boolean}
 */
function wonGame(){
  return score === goal;
}

/** Base Function *****************************************************************************************/
/**
 *
 */
function initManager(){
    manager = new THREE.LoadingManager();
    const loadingScreen = document.getElementById( 'loading-screen' );

    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
        console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };

    manager.onLoad = function ( ) {
        console.log( 'Loading complete!');
        loadingScreen.classList.add( 'fade-out' );
    };

    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };

    manager.onError = function ( url ) {
        console.log( 'There was an error loading ' + url );
    };
}

/**
 *
 */
function init() {
    const WIDTH = 1024;
    const HEIGHT = 768;
    // Render
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( WIDTH, HEIGHT );
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.enabled = true;
    document.getElementById('pacman_draw').appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Lights
    ambientlight = new THREE.AmbientLight( 0xffffff, 1 );

    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.name = 'Dir. Light';
    dirLight.intensity = 1;
    dirLight.position.set( 0, 10, 10 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.left = - 15;
    dirLight.shadow.camera.top	= 15;
    dirLight.shadow.camera.bottom = - 15;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    // spotlightHelper = new THREE.SpotLightHelper( spotLight );
    // dirlightHelper = new THREE.SpotLightHelper( dirLight );
    // dirlightShadowHelper = new THREE.CameraHelper( dirLight.shadow.camera );
    //
    // scene.add( spotlightHelper );
    // scene.add( dirlightHelper );
    // scene.add( dirlightShadowHelper );

    scene.add( ambientlight );
    scene.add( dirLight );

    // Camera
    camera = new THREE.PerspectiveCamera( 20, WIDTH / HEIGHT, 1, 1000 );
    camera.lookAt(30,0,5);
    camera.position.set( 30, 30, 40 );
    // camera.position.z = 15;
    // camera.position.y = 5;
    // camera.position.x = 4;

    // Camera Controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableKeys = false;

    controls.update();

}

function restart(){
  remove_life();
  isDead = false;
}

// Animate the scene
function animate() {
    requestAnimationFrame( animate );

    //lightHelper.update();
    // only required if controls.enableDamping = true, or if controls.autoRotate = true
    controls.update();
    renderer.render( scene, camera );
}

/** Main Function *****************************************************************************************/
// Global variables
let scene, camera, renderer, light, directionalLight, objectMap, controls, matStdFloor, manager, map, mapGhost;

// Characters
let ghost;
let pacman;

// Variable used to force pacman not to move when dead
let isDead = false;

// Colors
const YELLOW = 0xffff00;
const BLUE = 0x4298f5;
const RED = 0xf54242;
const GREEN = 0x00ff00;
let colors = [
    YELLOW,
    BLUE,
    GREEN
];

// Gameplay vars
let score = 0;
let goal = 0;
let life = 5;


init();
initManager();

// Init Levels
let level = new Levels;
level.Level_1();                      // Load level 1
let LEVEL = level.level_map[0];       // Load level

maps = buildMap(LEVEL, scene);
map = maps[0];
mapGhost = maps[1];

init_sound();
animate();
