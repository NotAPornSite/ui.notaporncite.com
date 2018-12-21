/**
 * ui.notaporncite.com
 *
 * Simple express applicate to serve UI assets
 *
 * @author NotKeithRichards
 */
'use strict';
require('dotenv').config()

/* App dependencies
 */

const express = require('express'),
      app     = express();
// {
const data    = require('./modules/items.js');

const pageCount = 15;

/* END
 * ---
 *
 * Auxiliary functions
 */

const getPage = page => {
    let start = page*pageCount;
    if (start > data.length) {
        return [];
    }
    if (start + pageCount > data.length) {
        return data.slice(start);
    }

    return data.slice(page*pageCount, (page*pageCount)+pageCount);
}

/* END
 * ---
 *
 * App config
 */

app.use('/', express.static('./public'));

app.get('/items', (req, res) => {
    const { page } = req.query;
    if (!page) {
        return res.json(getPage(0));
    }
    res.json(getPage(page));
});

// LETS GO
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}!`) )
