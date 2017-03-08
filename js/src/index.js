import '../../node_modules/font-awesome/css/font-awesome.css';
import '../../css/app.css';

import Game from './game';
import assets from './assets';
import Menu from './menu';

const
    canvas                  = document.querySelector('canvas'),
    debug                   = document.querySelector('.debug'),
    loading                 = document.querySelector('.loading'),
    hud                     = document.querySelector('.hud'),
    gl                      = canvas.getContext('webgl');

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

const load = () => {
    assets(gl, loading).then(
        (arrOut) => {
            let game = new Game(canvas, hud, debug, gl, ...arrOut);
            game.start();
            // change to not cheat
            //    menu = new Menu(game);
            //menu.showMenu();
        }
    ).catch((err) => console.log(err));
};

window.addEventListener('load', load);
window.addEventListener('error', (err) => console.log(err));
