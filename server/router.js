require('./map');

var express = require('express');
var actionClass = require('./actions');
var router = express.Router();
var dispatcher = require('./dispatcher');
var methods = require('./methods');

var routerClass = function(client){ 
	
	var actions = new actionClass(client);
	var reqObj ={};
    
	client.on('dispatchServerResponse',function(payload){
		dispatcher(reqObj,payload);
	});
    
	router.use( cookieParser() );
	methods(reqObj, router, actions);
	return router;
};

module.exports = routerClass;