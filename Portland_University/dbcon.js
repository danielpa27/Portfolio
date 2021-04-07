var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'redacted',
    user: 'redacted',
    password: 'redacted',
    database: 'redacted'
});
module.exports.pool = pool;