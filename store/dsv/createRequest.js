'use strict';

var request = require('request');
var post = function(data){
	var _id = 'D- ' + data.Sku;

	request.post({
			url: 'http://manager.hmovil.com/api-accounting/loadDownloable',
			form: {
				_id: _id
			}
		},
		function(){}
	);
};

var postProducts = function(arr){
	var arr = JSON.parse(arr);
	for(var i = 0; i < arr.length; i++){
		post(arr[i]);
	}
};

module.exports = function(method, body, response){
	var base = 'https://iwsdvlp.intcomex.com/api/iwsapi/';
	var credentials = require('./createKey')();

	base += method;
	base += '?apiKey=' + credentials.apiKey;
	base += '&utcTimeStamp=' + credentials.date;
	base += '&signature=' + credentials.hash;
	base += '&locale=en';

	if(method === 'PlaceOrder'){
		request(
			{
				method: 'POST',
	    		uri: base,
				multipart: [
					{
						'content-type': 'application/json',
						body: JSON.stringify(body)
					}
				]
			},
			function (error, response, body) {
				if (error) {
					return console.error('upload failed:', error);
				}
				console.log(body);
			}
		);
	}
	else if(method === 'GetCatalog'){
		request(base, function (error, r, body) {
			response({ data: JSON.parse(body) });
		});
	}
	else if(method === 'GetProduct'){
		base += '&sku=' + body;
		request(base, function (error, r, body) {
			response({ data: JSON.parse(body) });
		});
	}
	else{
		console.log('METHOD_UNKNOW');
	}
};
