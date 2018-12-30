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

    let p   = text => {
        let dom = document.createElement('p');
        dom.appendChild(document.createTextNode(text));
        return dom;
    }

    let addClass = clazz => { return elem => elem.classList.add(clazz) };

    let rmClass  = clazz => { return elem => elem.classList.remove(clazz) };

    let addChild = child => { return elem => elem.appendChild(child) };


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

    const nearestHundred = num => Math.round(num/100) * 100;

    const breakPoints = {
        // key = window width range
        // val = number of gallery columns
        '100,200': 2,
        '200,300': 2,
        '300,400': 2,
        '400,500': 3,
        '500,600': 3,
        '600,700': 3,
        '700,800': 4,
        '800,900': 4,
        '900,1000': 4
    };
    
    const getUpperBound = () => nearestHundred(window.innerWidth) || 4;
    
    const getLowerBound = () => nearestHundred(window.innerWidth) - 100 || 2;
    
    const getBreakpoint = () => {
        let bp = breakPoints[`${getLowerBound()},${getUpperBound()}`];
        return !bp ? (window.innerWidth >= 1000 ? 4 : 2) : bp;
    }


    return {
        hide,
        show,
        on,
        q,
        div,
        img,
        p,
        getItems,
        getBreakpoint,
        addClass,
        addChild,
        pipe
    };
})();
