let sctMain = document.querySelector('section.main'),
    btnSP = document.querySelector('button.sp'),
    btnMP = document.querySelector('button.mp'),
    btnOpt = document.querySelector('button.opt'),
    sctSP = document.querySelector('section.sp'),
    sctMP = document.querySelector('section.mp'),
    sctOpt = document.querySelector('section.opt'),
    btnsBack = document.querySelectorAll('button.back'),
    btnsSelect = document.querySelectorAll('button.select'),
    showMenu = () => {
        document.body.style.background = 'url("img/screenshot1.png")';
        menu.style.display = 'flex';

        btnSP.addEventListener('click', clickSP);
        btnMP.addEventListener('click', clickMP);
        btnOpt.addEventListener('click', clickOpt);
        [].forEach.call(btnsBack, btn => btn.addEventListener('click', clickBack));
        [].forEach.call(btnsSelect, btn => btn.addEventListener('click', () => {
            menu.style.display = 'none';
            canvas.style.display = 'block';
            hud.style.display = 'flex';
            triggerStart();
        }));
    },
    clickSP = () => {
        sctMain.style.display = 'none';
        sctSP.style.display = 'flex';
    },
    clickBack = (ev) => {
        let btnClicked = ev.currentTarget,
            sct = btnClicked.parentNode;
        sct.style.display = 'none';
        sctMain.style.display = 'flex';
    }
    clickMP = () => {
        sctMain.style.display = 'none';
        sctMP.style.display = 'flex';
    },
    clickOpt = () => {
        sctMain.style.display = 'none';
        sctOpt.style.display = 'flex';
    };
