'use strict';
const npc = (function() {

    let show = id => {
        let elem = document.querySelector(`#${id}.is-hidden`);
        if (elem) {
            elem.classList.remove('is-hidden');
        } else {
            console.log(`No element by id '${id}' and 'hidden'`);
        }
    };

    let hide = id => {
        let elem = document.querySelector(`#${id}`);
        if (elem) {
            elem.classList.add('is-hidden');
        } else {
            console.error(`No element by id '${id}'!`);
        }
    };

    return { hide, show };
})();
