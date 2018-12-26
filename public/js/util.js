
/* General util
 */

const nearestHundred = num => Math.round(num/100) * 100;

const  pipe = function() {
    return arg => {
        Array.from(arguments).forEach(fn => fn(arg));
        return arg;
    }
}

const isArray = obj => obj instanceof Array;

/* Dom creation/manipulation
 */

const addClass = clazz => { return elem => elem.classList.add(clazz) };

const addChild = child => { return elem => elem.appendChild(child) };

const div = () => document.createElement('div');

const img = () => document.createElement('img');

const on = (elem, evt, cb) => {
    elem.addEventListener(evt, cb);
}
