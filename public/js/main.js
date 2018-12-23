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

    let GalleryColumn = function(domNode, active) {
        this._active = active;

        this._items = [];

        this._makeInactive = addClass('is-inactive');
        
        this._makeActive = rmClass('is-inactive');

        this.pop = () => {
            if (this._items.length > 0) {
                let item = this._items.pop();
                this.domNode.removeChild(item.domNode);
                return item;
            }
            return null;
        }

        this.push = item => {
            this._items.push(item);
            this.domNode.appendChild(item.domNode);
        };

        this.domNode = domNode;

        this.makeInactive = () => {
            this._active = false;
            this._makeInactive(this.domNode);
        }

        this.makeActive = () => {
            this._active = true;
            this._makeActive(this.domNode);
        }

        if (!this._active) {
            this.makeInactive();
        }
    }

    let Gallery = function(domNode) {
        this._nearestHundred = num => Math.round(num/100) * 100;

        this._breakpoints = {
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

        this._createGalleryItem = src => {
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

        this._getBreakpoint = () => {
            let upper = this._nearestHundred(window.innerWidth),
                lower = this._nearestHundred(window.innerWidth) - 100,
                bp = this._breakpoints[`${lower},${upper}`];
            if (!bp && upper >= 1000) {
                return 4;
            } else if (!bp && upper <= 200) {
                return 2;
            }
            return bp;
        };

        this._previous = this._getBreakpoint();

        this._inactiveColumns = [];

        this._activeColumns = [];

        this._getItem = (source, dest) => {
            if (source instanceof Array) {
                let col = source.reduce( (prev, curr) => curr._items.length >= prev._items.length ? curr : prev),
                    last = source[source.length-1];
                return last._items.length >= dest._items.length + 1 ? col.pop() : null;
            } else {
                return source.pop();
            }
        }

        this._pushItem = (item, dest) => {
            if (dest instanceof Array) {
                dest.reduce( (prev, curr) => curr._items.length < prev._items.length ? curr : prev).push(item);
            } else {
                dest.push(item);
            }
        }

        this._distributeItems = (source, dest) => {
            let item;
            while (item = this._getItem(source, dest)) {
                this._pushItem(item, dest);
            }
        };

        this._distributeActiveColumn = () => {
            let column = this._activeColumns.pop();
            column.makeInactive();
            this._distributeItems(column, this._activeColumns);
            this._inactiveColumns.push(column);
        }

        this._distributeToActiveColumn = () => {
            let column = this._inactiveColumns.pop();
            column.makeActive();
            this._distributeItems(this._activeColumns, column);
            this._activeColumns.push(column);
        }

        this._adjustColumns = () => {
            if (this._activeColumns.length > this._previous) {
                // removing a column
                this._distributeActiveColumn();
            } else {
                this._distributeToActiveColumn();
            }
        };

        this._reorder = () => {
            while (this._activeColumns.length !== this._previous) {
                this._adjustColumns();
            }
        };

        // the format of this data will likely change often
        this.addItems = dat => {
            let min, colCounter;
            this._activeColumns.forEach((col, i) => {
                if (!min) min = col._items.length;
                if (col._items.length <= min) {
                    min = col._items.length;
                    colCounter = i;
                }
            });
            colCounter = colCounter || 0;
            dat.forEach(url => {
                let item = this._createGalleryItem(sanatize(url));
                this._activeColumns[colCounter].push(item);
                colCounter = (colCounter + 1) % this._activeColumns.length; 
            })
        }

        this.domNode = domNode;

        // Add active columns and inactive columns according to current width
        for (let i = 0; i < 4; i++) {
            let column = pipe(addClass('gallery-column'))(div());
            if (i < this._previous) {
                this._activeColumns.push(new GalleryColumn(column, true));
            } else {
                this._inactiveColumns.push(new GalleryColumn(column, false));
            }
            this.domNode.appendChild(column);
        }

        on(window, 'resize', e => {
            let current = this._getBreakpoint();
            if (current && current != this._previous) {
                this._previous = current;
                this._reorder();
            }
        });
    };


    return {
        hide,
        show,
        on,
        q,
        getItems,
        Gallery
    };
})();
