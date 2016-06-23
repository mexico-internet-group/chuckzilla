var managerMethods = require('./lib/managerMethods');
var getState = require('./lib/getState');
var setUser = require('./lib/setUser');
var getUser = require('./lib/getUser');
var setGuest = require('./lib/setGuest');
var login = require('./lib/login');
var addToCart = require('./lib/addToCart');
//var expireCarts = require('./lib/expireCarts');
var buyNow = require('./lib/buyNow');
var getPs = require('./lib/getPs');
var getZipCode = require('./lib/getZipCode');
var setAddress = require('./lib/setAddress');
//var sendPayment = require('./lib/sendPayment');
var getAddress = require('./lib/getAddress');
var getUserOrders = require('./lib/getUserOrders');
var setFavoriteAddress = require('./lib/setFavoriteAddress');
var getMailingData = require('./lib/getMailingData');
var paypalPayment = require('./lib/paypalPayment');
var executePaypal = require('./lib/executePaypal');
var SetExpressCheckout = require('./lib/SetExpressCheckout');
var DoExpressCheckoutPayment = require('./lib/DoExpressCheckoutPayment');
var IntComex = require('./lib/IntComex');
var PostPayment = require('./lib/PostPayment');
var siteMap = require('./lib/siteMap');
var expireBuyings = require('./lib/expireBuyings');
var newsRegister = require('./lib/newsRegister');
var resetPassword = require('./lib/resetPassword');

var fx = function(db, store, payload, response, createBucketFiles){
	var _this = this;

	this.GET_STATE = function(){
		getState(db, store, payload, response);
		return;
	};

	this.SET_USER = function(){
		setUser(db, store, payload, response);
		return;
	};

	this.GET_USER = function(){
		getUser(db, store, payload, response);
		return;
	};

	this.SET_GUEST = function(){
		setGuest(db, store, payload, response);
		return;
	};

	this.LOGIN = function(){
		login(db, store, payload, response);
		return;
	};

	this.ADD_TO_CART = function(){
		addToCart(db, store, payload, response);
		return;
	};

	this.EXPIRE_CARTS = function(){
		expireCarts(db, store);
		return;
	};

	this.EXPIRE_BUYINGS = function(){
		expireBuyings(db, store);
	};

	this.BUY_NOW = function(){
		buyNow(db, store, payload, response);
		return;
	};

	this.GET_PS = function(){
		getPs(db, store, payload, response);
		return;
	};

	this.GET_ZIP_CODE = function(){
		getZipCode(db, store, payload, response);
		return;
	};

	this.SET_ADDRESS = function(){
		setAddress(db, store, payload, response);
		return;
	};

	/*this.SEND_PAYMENT = function(){
		sendPayment(db, store, payload, response);
		return;
	};*/

	this.GET_ADDRESS = function(){
		getAddress(db, store, payload, response);
		return;
	};

	this.SET_FAVORITE_ADDRESS = function(){
		setFavoriteAddress(db, store, payload, response);
		return;
	};

	this.GET_USER_ORDERS = function(){
		getUserOrders(db, store, payload, response);
		return;
	};

	this.GET_MAILING_DATA = function(){
		getMailingData(db, store, payload, response);
		return;
	};

	this.PAYPAL_PAYMENT = function(){
		paypalPayment(db, store, payload, response);
		return;
	};

	this.EXECUTE_PAYPAL = function(){
		executePaypal(db, store, payload, response);
		return;
	};

	this.SET_EXPRESS_CHECKOUT = function(){
		SetExpressCheckout(db, store, payload, response);
		return;
	};

	this.DO_EXPRESS_CHECKOUT_PAYMENT = function(){
		DoExpressCheckoutPayment(db, store, payload, response);
		return;
	};

	this.INTCOMEX = function(){
		IntComex(db, store, payload, response);
		return;
	};

	this.POST_PAYMENT = function(){
		PostPayment(db, store, payload, response);
		return;
	};

	this.SITEMAP = function(){
		siteMap(db, store, payload, response);
		return;
	};

	this.NEWS_REGISTER = function(){
		newsRegister(db, store, payload, response);
		return;
	};
	
	this.RESET_PASSWORD = function(){
		return resetPassword(db, store, payload, response);
	};

	managerMethods(this, db, store, payload, response, createBucketFiles);
};

module.exports = fx;
