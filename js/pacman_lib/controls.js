/**
 * @author José Neto Gonçalves
 * @author Maxime Hutinet
 * @author David Laroche
 */

function controls_manager(){
    pacman = scene.getObjectByName( "pacman_model" );

    ghost = scene.getObjectByName( "ghost1_model" );

    // Change the camera position with the keyboard
    window.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") {
            move(pacman, "right");
            moveGhost(ghost);
        }
        else if (e.key === "ArrowLeft") {
            move(pacman, "left");
            moveGhost(ghost);
        }
        else if (e.key === "ArrowUp") {
            move(pacman, "up");
            moveGhost(ghost);
        }
        else if (e.key === "ArrowDown") {
            move(pacman, "down");
            moveGhost(ghost);
        }
    });
}
