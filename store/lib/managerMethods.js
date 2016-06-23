var getTaxonomy = require('./methods/getTaxonomy');
var setTaxonomy = require('./methods/setTaxonomy');
var getInventory = require('./methods/getInventory');
var getItemDetail = require('./methods/getItemDetail');
var getItemDetailAcc = require('./methods/getItemDetailAcc');
var getOrders = require('./methods/getOrders');
var getOrderDetail = require('./methods/getOrderDetail');
var makeEntrie = require('./methods/makeEntrie');
var updateProduct = require('./methods/updateProduct');
var getProviders = require('./methods/getProviders');
var updateProvider = require('./methods/updateProvider');
var getManagedUsers = require('./methods/getManagedUsers');
var masiveInsert = require('./methods/masiveInsert');
var savePurchaseOrder = require('./methods/savePurchaseOrder');
var setInventory = require('./methods/setInventory');
var loadDownloable = require('./methods/loadDownloable');
var changeStatusOrder = require('./methods/changeStatusOrder');
var updateLanding = require('./methods/updateLanding');
var getSomeItems = require('./methods/getSomeItems');
var stampBill = require('./methods/stampBill');

module.exports = function(_this, db, store, payload, response, createBucketFiles){
	_this.GET_TAXONOMY = function(){
		getTaxonomy(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.SET_TAXONOMY = function(){
		setTaxonomy(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_INVENTORY = function(){
		getInventory(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_ITEM_DETAIL = function(){
		getItemDetail(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_ITEM_DETAIL_ACC = function(){
		getItemDetailAcc(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_ORDERS = function(){
		getOrders(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_ORDER_DETAIL = function(){
		getOrderDetail(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.MAKE_ENTRIE = function(){
		makeEntrie(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.UPDATE_PRODUCT = function(){
		updateProduct(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_PROVIDERS = function(){
		getProviders(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.UPDATE_PROVIDER = function(){
		updateProvider(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_MANAGED_USERS = function(){
		getManagedUsers(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.MASIVE_INSERT = function(){
		masiveInsert(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.SET_INVENTORY = function(){
		setInventory(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.LOAD_DOWNLOABLE = function(){
		loadDownloable(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.SAVE_PURCHASE_ORDER = function(){
		savePurchaseOrder(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.CHANGE_STATUS_ORDER = function(){
		changeStatusOrder(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.UPDATE_LANDING = function(){
		updateLanding(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.GET_SOME_ITEMS = function(){
		getSomeItems(_this, db, store, payload, response, createBucketFiles);
		return;
	};
	_this.STAMP_BILL = function(){
		stampBill(_this, db, store, payload, response, createBucketFiles);
		return;
	};
};
