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

const Resource = require('./modules/Resource.js');

const pageCount = 15;

/* END
 * ---
 *
 * Auxiliary functions
 */



/* END
 * ---
 *
 * App config
 */

app.use('/', express.static('./public'));

app.get('/items', async (req, res) => {
    let page = req.query.page || 0;
    Resource.query()
        .orderBy('id', 'desc')
        .limit(pageCount)
        .offset(pageCount*page)
        .then(items => {
            res.json(items);
        })
});

// LETS GO
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}!`) )
