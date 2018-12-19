'use strict';
const npc = (function() {

    const MODAL_DELAY_INTERVAL = 500;

    /**
     * Display a modal class
     *
     * @param id {string} - id of the element to display
     * @return
     *
     * @author NotKeithRichards
     */
    let show = id => {
        let elem = document.querySelector(`#${id}.is-hidden`);
        if (elem) {
            setTimeout(() => {
                elem.classList.remove('is-faded');
            }, MODAL_DELAY_INTERVAL);
            console.log(`No element by id '${id}' and 'hidden'`);
        }
    };

    /**
     * Hide a modal class
     *
     * @param id {string} - id of the element to hide
     * @return
     *
     * @author NotKeithRichards
     */
    let hide = id => {
        let elem = document.querySelector(`#${id}`);
        if (elem) {
            setTimeout(() => {
                elem.classList.add('is-hidden');
            }, MODAL_DELAY_INTERVAL);
            elem.classList.add('is-faded');
        } else {
            console.error(`No element by id '${id}'!`);
        }
    };

    /**
     * Add an event listener for the event and element specified
     *
     * @param evt  {string}   - The event to listen for
     * @param elem {Element}  - The dom node to add the event to
     * @param cb   {Function} - Callback function to be called when the event it fired
     * @return
     *
     * @author NotKeithRichards
     */
    let on = (evt, elem, cb) => {
        elem.addEventListener(evt, cb);
    }

    /**
     * Shorthand for document.querySelector
     *
     * @param query {string} - selector
     * @return {Element} - First element matching provided query if found
     *
     * @author NotKeithRichards
     */
    let q = query => document.querySelector(query);

    return { hide, show, on, q };
})();
