/**
 * @author José Neto Gonçalves
 * @author Maxime Hutinet
 * @author David Laroche
 */

const audioFile = '../models/audios/loop_piano.wav';

function init_sound(){
    // create an AudioListener and add it to the camera
    let listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    let sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    let audioLoader = new THREE.AudioLoader();
    audioLoader.load( audioFile, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 0.0 );
        sound.play();
    });
}

const pacman_eat_audio = '../models/audios/pacman_eatfruit.wav';

function pacman_eat(){
    let listener_pacman_eat = new THREE.AudioListener();
    camera.add( listener_pacman_eat );
    let sound = new THREE.Audio( listener_pacman_eat );
    let audioLoader = new THREE.AudioLoader();
    audioLoader.load( pacman_eat_audio, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
        sound.play();
    });
}

const pacman_death_audio = '../models/audios/pacman_death.wav';

function pacman_death(){
    let listener_pacman_death = new THREE.AudioListener();
    camera.add( listener_pacman_death );
    let sound = new THREE.Audio( listener_pacman_death );
    let audioLoader = new THREE.AudioLoader();
    audioLoader.load( pacman_death_audio, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( false );
        sound.setVolume( 0.5 );
        sound.play();
    });
}