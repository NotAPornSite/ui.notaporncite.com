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

    let GalleryItem = function(domNode)
    {
        this.domNode = domNode;

        this._focus = addClass('is-focused');
        this._blur = rmClass('is-focused');

        on(domNode, 'touchstart', e => {
            this._focus(domNode);
        })
        on(domNode, 'touchend', e => {
            this._blur(domNode);
        })
    }

    let Gallery = function(domNode) {
        this._nearestHundred = num => Math.round(num/100) * 100;

        this._breakpoints = {
            '100,200': 0,
            '200,300': 0,
            '300,400': 0,
            '400,500': 1,
            '500,600': 1,
            '600,700': 1,
            '700,800': 2,
            '800,900': 2,
           '900,1000': 2
       };

       this._getBreakpoint = () => {
           let upper = this._nearestHundred(window.innerWidth),
               lower = this._nearestHundred(window.innerWidth) - 100;
           return this._breakpoints[`${lower},${upper}`];
        };

        this._previous = this._getBreakpoint();

        this._items = [];

        this._reorder = () => {
            // TODO implement me!
            console.log('reorder gallery');
        };

        this.addItem = item => {
            this._items.push(item);
            this.domNode.appendChild(item.domNode);
        }

        this.domNode = domNode;

        on(window, 'resize', e => {
            let current = this._getBreakpoint();
            if (current && current != this._previous) {
                this._reorder();
                this._previous = current;
            }
        });
    };

    let galleryItem = src => {
        const construct = pipe(
                            addClass('gallery-item'),
                            addChild(
                                pipe(
                                    addClass('gi-img'),
                                    addChild(img()),
                                    addChild(pipe(addClass('gi-img-overlay'))(div()))
                                )(div())
                            ),
                            addChild( pipe(addClass('gi-content'))(div()) )
                        );

        const item = construct(div());
        item.querySelector('img').src = src;
        return new GalleryItem(item);
    }


    return {
        hide,
        show,
        on,
        q,
        div,
        img,
        addClass,
        rmClass,
        pipe,
        galleryItem,
        getItems,
        Gallery
    };
})();
