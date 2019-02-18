var http = require('http');
var mysql = require('mysql');

console.log("kkkk");
module.exports = function (app) {
    app.router.register('/', function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('Hello World');
        res.close();
    });
}
