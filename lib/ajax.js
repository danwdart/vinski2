let loadAjax = (name) => new Promise((res, rej) => {
    let x = new XMLHttpRequest();
    // shut up
    x.overrideMimeType('text/plain');
    x.open('GET', name, true);
    x.onreadystatechange = () => {
        if (4 == x.readyState) {
            if (200 !== x.status)
                return rej('Error loading '+name);
            return res(x.responseText);
        }
    };
    x.send();
});
