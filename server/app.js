var webApp = function(id){
    var express = require('express');
    var router = require('./router');
	var bodyParser = require('body-parser');
	var subdomain = require('express-subdomain');
    var app = express();
    var fs = require('fs');
	var oneDay = 86400000;
	var socketAddres;
	var nodemailer = require('nodemailer');

	global.sendError = function(a){return {"APPLICATION_ERROR":a}};
	global.uuid = require('node-uuid');
	global.cookieParser = require('cookie-parser');
	global.transporter = nodemailer.createTransport("SMTP",{
		service: 'Gmail',
		auth: { user: 'mailing@simonejs.com', pass: 'Omega002'}
	});

	if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production'){
		global.domainCookie = '.dgl.com';
		domain = 'http://dgl.com:80';
		socketAddres = '127.0.0.1';
	}
	else{
		global.domainCookie = '.hmovil.com';
		domain = 'https://hmovil.com:80';
		socketAddres = '10.240.0.8';
	}

    var clientio = require('socket.io-client');
    var client = clientio.connect('http://'+ socketAddres +':8181');

	app
    .disable('etag')
	.use(function(req, res, next ){
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', 0);
		res.setHeader('Access-Control-Allow-Credentials', true);
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
		res.setHeader('Access-Control-Allow-Origin', domain);
		next();
	})
	.use( bodyParser.urlencoded({ extended: false }) )
	.use( bodyParser.json() )
    .use('/api/', router(client) );

    var server = app.listen(8080, function(){
        console.log('Listen Ready');
    });
};
module.exports = webApp;
