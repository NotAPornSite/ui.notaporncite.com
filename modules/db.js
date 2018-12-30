require('dotenv').config();

const pageSize = 15;
const mysql = require('mysql'),
      conn  = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB
      });

conn.connect(function(err) {
    if (err) console.log(`An error occurred connection to the db - ${err}`);
});

const getResources = page => new Promise((resolve, reject) => {
    conn.query(`select * from resource limit ${page*pageSize},${pageSize}`, (error, results) => {
        if (error){
            reject(error);
            return;
        }
        resolve(results);
    })
});

module.exports = {getResources};