/**
 * ui.notaporncite.com
 *
 * Simple express applicate to serve UI assets
 *
 * @author NotKeithRichards
 */
'use strict';
require('dotenv').config()

const express = require('express'),
      app     = express();

app.use('/', express.static('./public'));

// LETS GO
app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}!`) )
