var getState = require('./dispatch/getState');
var setUser = require('./dispatch/setUser');
var setGuest = require('./dispatch/setGuest');
var getUser = require('./dispatch/getUser');
var login = require('./dispatch/login');
var addToCart = require('./dispatch/addToCart');
var buyNow = require('./dispatch/buyNow');
var getPs = require('./dispatch/getPs');
var getZipCode = require('./dispatch/getZipCode');
var setAddress = require('./dispatch/setAddress');
var sendPayment = require('./dispatch/sendPayment');
var getAddress = require('./dispatch/getAddress');
var getUserOrders = require('./dispatch/getUserOrders');
var setFavoriteAddress = require('./dispatch/setFavoriteAddress');
var paypalPayment = require('./dispatch/paypalPayment');
var executePaypal = require('./dispatch/executePaypal');
var SetExpressCheckout = require('./dispatch/SetExpressCheckout');
var DoExpressCheckoutPayment = require('./dispatch/DoExpressCheckoutPayment');
var postPayment = require('./dispatch/postPayment');
var newsRegister = require('./dispatch/newsRegister');

var fxClass = function(reqObj,payload){

	var req = reqObj[payload.tokenRequest].req;
	var res = reqObj[payload.tokenRequest].res;

	this.GET_STATE = function(){
		getState(payload, res);
		return;
	};

    this.SET_USER = function(){
		setUser(payload, res);
		return;
    };

	this.SET_GUEST = function(){
		setGuest(payload, res);
		return;
	};

	this.GET_USER = function(){
		getUser(payload, res);
		return;
	};

	this.LOGIN = function(){
		login(payload, res);
		return;
	};

	this.ADD_TO_CART = function(){
		addToCart(payload, res);
		return;
	};

	this.BUY_NOW = function(){
		buyNow(payload, res);
		return;
	};

	this.GET_PS = function(){
		getPs(payload, res);
		return;
	};

	this.GET_ZIP_CODE = function(){
		getZipCode(payload, res);
		return;
	};

	this.SET_ADDRESS = function(){
		setAddress(payload, res);
		return;
	};

	this.SEND_PAYMENT = function(){
		sendPayment(payload, req, res);
		return;
	};

	this.GET_ADDRESS = function(){
		getAddress(payload, res);
		return;
	};

	this.SET_FAVORITE_ADDRESS = function(){
		setFavoriteAddress(payload, res);
		return;
	};

	this.GET_USER_ORDERS = function(){
		getUserOrders(payload, res);
		return;
	};

	this.PAYPAL_PAYMENT = function(){
		paypalPayment(payload, res);
		return;
	};

	this.EXECUTE_PAYPAL = function(){
		executePaypal(payload, req, res);
		return;
	};

	this.SET_EXPRESS_CHECKOUT = function(){
		SetExpressCheckout(payload, res);
		return;
	};

	this.DO_EXPRESS_CHECKOUT_PAYMENT = function(){
		DoExpressCheckoutPayment(payload, req, res);
		return;
	};

	this.INTCOMEX = function(){
		return res.send(payload);
	};

	this.POST_PAYMENT = function(){
		postPayment(payload, req, res);
		return;
	};

	this.SITEMAP = function(){
		res.setHeader('content-type', 'text/xml');
		res.end(payload.xml);
		return;
	};

	this.NEWS_REGISTER = function(){
		newsRegister(payload, res);
		return;
	};
};

var dispatcher = function(reqObj,payload){
    var fx = new fxClass(reqObj,payload);
    fx[payload.actionType]();

	reqObj[payload.tokenRequest] = null;
	delete reqObj[payload.tokenRequest];
};

module.exports = dispatcher;
