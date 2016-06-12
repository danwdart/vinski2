let menus = document.querySelector('.menus'),
    menuMain = document.querySelector('menu.main'),
    menuPause = document.querySelector('menu.pause'),
    menuSP = document.querySelector('menu.sp'),
    menuNew = document.querySelector('menu.new'),
    btnSP = document.querySelector('button.sp'),
    btnNew = document.querySelector('button.new'),
    btnMP = document.querySelector('button.mp'),
    btnOpt = document.querySelector('button.opt'),
    btnResume = document.querySelector('button.resume'),
    btnQuit = document.querySelector('button.quit'),
    menuMP = document.querySelector('menu.mp'),
    menuOpt = document.querySelector('menu.opt'),
    btnsBack = document.querySelectorAll('button.back'),
    btnsSelect = document.querySelectorAll('button.select'),
    showMenu = () => {
        document.body.style.background = 'url("img/screenshot1.png")';
        menus.style.display = 'flex';
        menuMain.style.display = 'flex';

        btnSP.addEventListener('click', clickSP);
        btnMP.addEventListener('click', clickMP);
        btnOpt.addEventListener('click', clickOpt);
        btnNew.addEventListener('click', clickNew);
        btnResume.addEventListener('click', clickResume);
        btnQuit.addEventListener('click', clickQuit);
        [].forEach.call(btnsBack, btn => btn.addEventListener('click', clickBack));
        [].forEach.call(btnsSelect, btn => btn.addEventListener('click', () => {
            menuNew.style.display = 'none';
            canvas.style.display = 'block';
            hud.style.display = 'flex';
            goFull();
            triggerStart();
        }));
    },
    pause = () => {
        animating = false;
        canvas.style.display = 'none';
        hud.style.display = 'none';
        menuPause.style.display = 'flex';
    },
    clickResume = () => {
        menuPause.style.display = 'none';
        canvas.style.display = 'flex';
        hud.style.display = 'flex';
        animating = true;
        requestAnimationFrame(loop);
        goFull();
    },
    clickQuit = () => {
        menuPause.style.display = 'none';
        menuMain.style.display = 'flex';
    }
    clickSP = () => {
        menuMain.style.display = 'none';
        menuSP.style.display = 'flex';
    },
    clickNew = () => {
        menuSP.style.display = 'none';
        menuNew.style.display = 'flex';
    },
    clickBack = (ev) => {
        let btnClicked = ev.currentTarget,
            menu = btnClicked.parentNode;
        menu.style.display = 'none';
        menuMain.style.display = 'flex';
    }
    clickMP = () => {
        menuMain.style.display = 'none';
        menuMP.style.display = 'flex';
    },
    clickOpt = () => {
        menuMain.style.display = 'none';
        menuOpt.style.display = 'flex';
    };
