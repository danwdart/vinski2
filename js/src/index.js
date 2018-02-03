import '../../node_modules/font-awesome/css/font-awesome.css';
import '../../css/app.css';

import Game from './game';
import assets from './assets';
import Menu from './menu';

const canvas                  = document.querySelector(`canvas`),
    debug                   = document.querySelector(`.debug`),
    loading                 = document.querySelector(`.loading`),
    hud                     = document.querySelector(`.hud`),
    gl                      = canvas.getContext(`webgl`);

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

const load = () => {
    const arrOut = assets(gl, loading),
        menu = new Menu(game),
        game = new Game(canvas, hud, debug, gl, menu, ...arrOut);

    game.start();
    //menu.showMenu();
};

window.addEventListener(`load`, load);
window.addEventListener(`error`, (err) => console.log(err));
