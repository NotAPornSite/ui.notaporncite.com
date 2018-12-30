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
      app     = express(),
      db      = require('./modules/db.js');

const data    = require('./modules/items.js');

const pageCount = 15;

/* END
 * ---
 *
 * Auxiliary functions
 */

const getPage = page => {
    let start = page*pageCount, end = start + pageCount;
    if (start > data.length) {
        return [];
    }
    if (start + pageCount > data.length) {
        return data.slice(start);
    }
    console.log({start, end});

    return data.slice(start, end);
}

/* END
 * ---
 *
 * App config
 */

app.use('/', express.static('./public'));

app.get('/items', async (req, res) => {
    let page = req.query.page || 0;
    try {
        let results = await db.getResources(page);
        res.json(results.map(item => item.url));
    } catch (err) {
        console.error(err);
        res.json({errors: [err]}); // should error handle on client side...
    }
});

// LETS GO
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}!`) )
