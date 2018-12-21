'use strict';
const npc = (function() {

    const MODAL_DELAY_INTERVAL = 250;

    /* General util
     */
    let pipe = function() {
        return arg => {
            Array.from(arguments).forEach(fn => fn(arg));
            return arg;
        }
    }

    let on = (elem, evt, cb) => {
        elem.addEventListener(evt, cb);
    }

    let q = query => document.querySelector(query);

    /* elements */

    let div = () => document.createElement('div');

    let img = () => document.createElement('img');

    let addClass = clazz => { return elem => elem.classList.add(clazz) };


    /* Modal
     */

    let show = id => {
        let elem = q(`#${id}.is-hidden`);
        if (elem) {
            elem.classList.remove('is-hidden');
            setTimeout(() => elem.classList.remove('is-faded'), MODAL_DELAY_INTERVAL);
        } else
            console.error(`No element for selector '#${id}.is-hidden'.`);
    };

    let hide = id => {
        let elem = document.querySelector(`#${id}`);
        if (elem) {
            elem.classList.add('is-faded');
            setTimeout(() => elem.classList.add('is-hidden'), MODAL_DELAY_INTERVAL);
        } else
            console.error(`No element by id '${id}'!`);
    };


    /* Gallery
     */

    let galleryItem = src => {
        const construct = pipe(addClass('gallery-item')),
              item      = construct(div());
        item.appendChild(img()).src = src;

        return item;
    }

    let getItems = page => {
        return new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function(e) {
                if (this.status === 200) {
                    resolve(JSON.parse(this.responseText));
                } else {
                    reject(this.status);
                }
            });
            xhr.open('GET', `/items?page=${page}`);
            xhr.send();
        });
    }

    return {
        hide,
        show,
        on,
        q,
        div,
        img,
        addClass,
        pipe,
        galleryItem,
        getItems
    };
})();
