import Events from './events';

export default class Menu
{
    constructor(game) {
        this.game = game;

        let selectors = {
                canvas: 'canvas',
                hud: '.hud',
                menu: '.menu',
                menus: '.menus',
                menuMain: 'menu.main',
                menuPause: 'menu.pause',
                menuSP: 'menu.sp',
                menuNew: 'menu.new',
                btnSP: 'button.sp',
                btnNew: 'button.new',
                btnMP: 'button.mp',
                btnOpt: 'button.opt',
                btnCreds: 'button.credits',
                btnResume: 'button.resume',
                btnQuit: 'button.quit',
                menuMP: 'menu.mp',
                menuOpt: 'menu.opt',
                menuCreds: 'menu.credits'
            },
            selectorsAll = {
                btnsBack: 'button.back',
                btnsSelect: 'button.select'
            };

        selectors.forEach(
            (strSelector, name) =>
                this[name] = document.querySelector(strSelector)
        );

        selectorsAll.forEach(
            (strSelector, name) =>
                this[name] = document.querySelectorAll(strSelector)
        );
    }

    clickResume () {
        this.menuPause.style.display = 'none';
        this.canvas.style.display = 'flex';
        this.hud.style.display = 'flex';
        this.game.animating = true;
        requestAnimationFrame(this.game::loop);
        Events.goFull(this.canvas);
    }

    clickQuit () {
        this.menuPause.style.display = 'none';
        this.menuMain.style.display = 'flex';
    }

    clickSP () {
        this.menuMain.style.display = 'none';
        this.menuSP.style.display = 'flex';
    }

    clickNew () {
        this.menuSP.style.display = 'none';
        this.menuNew.style.display = 'flex';
    }

    clickBack(ev) {
        let btnClicked = ev.currentTarget,
            menu = btnClicked.parentNode;
        menu.style.display = 'none';
        this.menuMain.style.display = 'flex';
    }

    clickSelect() {
        this.menuNew.style.display = 'none';
        this.canvas.style.display = 'block';
        this.hud.style.display = 'flex';
        Events.goFull(this.canvas);
        this.game.start();
    }

    clickMP() {
        this.menuMain.style.display = 'none';
        this.menuMP.style.display = 'flex';
    }

    clickOpt() {
        this.menuMain.style.display = 'none';
        this.menuOpt.style.display = 'flex';
    }

    clickCreds() {
        this.menuMain.style.display = 'none';
        this.menuCreds.style.display = 'flex';
    }

    showMenu() {
        document.body.style.background = 'url("img/screenshot1.png")';
        this.menus.style.display = 'flex';
        this.menuMain.style.display = 'flex';

        this.btnSP.addEventListener('click', ::this.clickSP);
        this.btnMP.addEventListener('click', ::this.clickMP);
        this.btnOpt.addEventListener('click', ::this.clickOpt);
        this.btnCreds.addEventListener('click', ::this.clickCreds);
        this.btnNew.addEventListener('click', ::this.clickNew);
        this.btnResume.addEventListener('click', ::this.clickResume);
        this.btnQuit.addEventListener('click', ::this.clickQuit);
        [].forEach.call(
            this.btnsBack,
            btn => btn.addEventListener('click', ::this.clickBack)
        );
        [].forEach.call(
            this.btnsSelect,
            btn => btn.addEventListener('click', ::this.clickSelect)
        );
    }

    pause() {
        this.game.animating = false;
        this.canvas.style.display = 'none';
        this.hud.style.display = 'none';
        this.menuPause.style.display = 'flex';
    }
};
