/**
 * @author José Neto Gonçalves
 * @author Maxime Hutinet
 * @author David Laroche
 */

function buildGui() {
    gui = new dat.gui.GUI({name: 'Spotlight', autoPlace: true, domElement: document.getElementsByClassName("light_gui"), positionFixed:false });
    let params = {
        'light color': spotLight.color.getHex(),
        intensity: spotLight.intensity,
        distance: spotLight.distance,
        angle: spotLight.angle,
        penumbra: spotLight.penumbra,
        decay: spotLight.decay
    };
    gui.addColor( params, 'light color' ).onChange( function ( val ) {
        spotLight.color.setHex( val );
    } );
    gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
        spotLight.intensity = val;
    } );
    gui.add( params, 'distance', 50, 200 ).onChange( function ( val ) {
        spotLight.distance = val;
    } );
    gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {
        spotLight.angle = val;
    } );
    gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {
        spotLight.penumbra = val;
    } );
    gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {
        spotLight.decay = val;
    } );
    gui.open();
}