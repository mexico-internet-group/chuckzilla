require('./map');
require('./qs');

//var heapdump = require('heapdump');

var gcloud = require('gcloud');
var gcloudConfig = {projectId: '####.####.####.####'};
var cloudStorageBucket = '####.####.####.####';
var storage = gcloud.storage(gcloudConfig);
var bucket = storage.bucket(cloudStorageBucket);
var mongo = require('mongodb').MongoClient;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var createBucketFiles = require('./createBucketFiles')(bucket);
var fx = require('./methods');
var retrieveContainer = require('./retrieve/retrieveContainer');
var mongoUri;
var elasticsearch = require('elasticsearch');


if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production'){
	mongoUri = 'mongodb://####.####.####.####:27017/commerce';
	global.searchEngine = new elasticsearch.Client({
		host: '####.####.####.####:9200'
	});
}
else{
	mongoUri = 'mongodb://10.240.0.10:27017/commerce';
	global.searchEngine = new elasticsearch.Client({
		host: '####.####.####.####:9200'
	});
}

var store = {
    users:{},
	products:{},
    token:{}
};

console.log('--> Inicializando Random Acces Memories Service');

mongo.connect(mongoUri, function(err, db){
	if(err) return console.log(err);
	else console.log('--> dB Lista');

	var fxRaw = new fx(db, store, null, null, createBucketFiles);
	retrieveContainer(db, store, createBucketFiles);

	interval = setInterval(function(){
		var epoch = Math.round(new Date().getTime() / 60000);
		if (epoch % 1 === 0){
			fxRaw.EXPIRE_BUYINGS();
		}
	},60000);

    io.on('connection', function(socket){
        socket.on('dispatcherHandleServer', function(data){
            var actionType = data.actionType;
			var tokenRequest = data.tokenRequest;
            var response = function(a){
                var tmpObj = a;
                tmpObj.actionType = actionType;
				tmpObj.tokenRequest = tokenRequest;
                socket.emit('dispatchServerResponse', tmpObj);
				fxClass = null;
            };
            var fxClass = new fx(db, store, data, response, createBucketFiles);
            fxClass[actionType]();
        });
    });

});

http.listen(8181);
