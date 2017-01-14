import Game from './game';
import assets from './assets';
import menu from './menu';

const
    canvas                  = document.querySelector('canvas'),
    debug                   = document.querySelector('.debug'),
    loading                 = document.querySelector('.loading'),
    hud                     = document.querySelector('.hud'),
    gl                      = canvas.getContext('webgl');

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

const load = () => {
    assets(gl, loading).then(
        (arrOut) => menu.showMenu(
            () => new Game(canvas, hud, debug, gl, ...arrOut)
        )
    ).catch((err) => console.log(err));
};

window.addEventListener('load', load);
window.addEventListener('error', (err) => console.log(err));
