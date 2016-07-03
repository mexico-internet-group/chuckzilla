var getState = require('./lib/getState');
var setUser = require('./lib/setUser');
var login = require('./lib/login');
var getUser = require('./lib/getUser');
var logout = require('./lib/logout');
var addToCart = require('./lib/addToCart');
var buyNow = require('./lib/buyNow');
var getPs = require('./lib/getPs');
var getZipCode = require('./lib/getZipCode');
var setAddress = require('./lib/setAddress');
//var sendPayment = require('./lib/sendPayment');
var getAddress = require('./lib/getAddress');
var setFavoriteAddress = require('./lib/setFavoriteAddress');
var getUserOrders = require('./lib/getUserOrders');
var getMailingData = require('./lib/getMailingData');
var paypalPayment = require('./lib/paypalPayment');
var executePaypal = require('./lib/executePaypal');
var SetExpressCheckout = require('./lib/SetExpressCheckout');
var DoExpressCheckoutPayment = require('./lib/DoExpressCheckoutPayment');

var PostPayment = require('./lib/PostPayment');
var siteMap = require('./lib/siteMap');
var newsRegister = require('./lib/newsRegister');

var retrieveSearch = require('./search/retrieveSearch');
var retrieveSuggest = require('./search/retrieveSuggest');
var retrieveTax = require('./search/retrieveTax');
var retrieveLanding = require('./search/retrieveLanding');
var retrieveUpc = require('./search/retrieveUpc');
var elasticsearch = require('elasticsearch');
var ipAddress;

if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production'){
	ipAddress = '104.196.130.41';
}
else{
	ipAddress = '10.240.0.5';
}

var client = new elasticsearch.Client({
  host: ipAddress + ':9200'
});

var routerClass = function(reqObj, router, actions){
	router
	.get('/getState', function(req, res){
		getState(reqObj, router, actions, req, res);
		return;
	})
	.get('/searchItems',function(req, res){
		retrieveSearch(req, res, client);
		return;
	})
	.get('/suggestItems',function(req, res){
		retrieveSuggest(req, res, client);
		return;
	})
	.get('/searchTax', function(req, res){
		retrieveTax(req, res, client);
		return;
	})
	.get('/retrieveLanding', function(req, res){
		retrieveLanding(req, res, client);
		return;
	})
	.post('/setUser',function(req, res){
		setUser(reqObj, router, actions, req, res);
		return;
    })
	.post('/login',function(req,res){
		login(reqObj, router, actions, req, res);
		return;
	})
    .get('/getUser',function(req,res){
		getUser(reqObj, router, actions, req, res);
		return;
    })
	.get('/logout',function(req,res){
		logout(reqObj, router, actions, req, res);
		return;
    })
	.post('/addToCart', function(req, res){
		addToCart(reqObj, router, actions, req, res);
		return;
	})
	.get('/buyNow', function(req, res){
		buyNow(reqObj, router, actions, req, res);
		return;
	})
	.post('/getPs', function(req, res){
		getPs(reqObj, router, actions, req, res);
		return;
	})
	.get('/getZipCode', function(req, res){
		getZipCode(reqObj, router, actions, req, res);
		return;
	})
	.post('/setAddress', function(req, res){
		setAddress(reqObj, router, actions, req, res);
		return;
	})
	/*.post('/sendPayment', function(req, res){
		sendPayment(reqObj, router, actions, req, res);
		return;
	})*/
	.get('/getAddress', function(req, res){
		getAddress(reqObj, router, actions, req, res);
		return;
	})
	.post('/setFavoriteAddress', function(req, res){
		setFavoriteAddress(reqObj, router, actions, req, res);
		return;
	})
	.get('/getUserOrders', function(req, res){
		getUserOrders(reqObj, router, actions, req, res);
		return;
	})
	.get('/getMailingData', function(req, res){
		getMailingData(reqObj, router, actions, req, res);
		return;
	})
	.post('/paypalPayment', function(req, res){
		paypalPayment(reqObj, router, actions, req, res);
		return;
	})
	.post('/executePaypal', function(req, res){
		executePaypal(reqObj, router, actions, req, res);
		return;
	})
	.get('/SetExpressCheckout', function(req, res){
		SetExpressCheckout(reqObj, router, actions, req, res);
		return;
	})
	.post('/DoExpressCheckoutPayment', function(req, res){
		DoExpressCheckoutPayment(reqObj, router, actions, req, res);
		return;
	})
	.post('/postPayment', function(req, res){
		PostPayment(reqObj, router, actions, req, res);
		return;
	})
	.get('/siteMap.xml', function(req, res){
		siteMap(reqObj, router, actions, req, res);
		return;
	})
	.post('/newsRegister', function(req, res){
		newsRegister(reqObj, router, actions, req, res);
		return;
	})
	.get('/retrieveUpc', function(req, res){
		return retrieveUpc(req, res, client);
	})
};

module.exports = routerClass;
