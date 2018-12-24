var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var cons = require('consolidate');
var cookieParser = require('cookie-parser');
var emit = require("emit");
var fs = require('fs');
var path = require('path');
var url = require('url');


app.use(express.static(__dirname));


app.engine('html', cons.swig);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'html');

//app.set('view engine', 'html');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('stylus').middleware({src: __dirname + '/app/public'}));
app.use(express.static(__dirname + '/app/public'));
app.use('/static', express.static('node_modules'))
app.use('/scripts', express.static(__dirname + '/node_modules'));
require('./app/server/routes')(app);




//io.on('connection', () => {
//    console.log('a user is connected')
//})

//mongoose.connect(dbUrl, {useMongoClient: true}, (err) => {
//    console.log('mongodb connected', err);
//})

var server = http.listen(3000, () => {
   
    console.log('server is running on port', server.address().port);
   
});
//console.log(server);