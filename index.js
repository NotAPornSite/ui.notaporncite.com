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

const Resource = require('./modules/Resource.js');
const Category = require('./modules/Category.js');

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
        .where('type', '=', 'image')
        .orderBy('id', 'asc')
        .limit(pageCount)
        .offset(pageCount*page)
        .then(items => {
            res.json(items);
        })
});

app.get('/categories', async (req, res) => {
    let {q} = req.query;
    if (!q) {
        console.log('nope');
        return res.json([]);
    }
    let categories = await Category.query().where('name', 'like', `${q}%`);
    res.json(categories);
})

// LETS GO
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}!`) )
