var buildTax = require('./buildTax');
var createProducts = require('./createProducts');
var getUsers = require('./getUsers');

var retrieveContainerClass = function(db, store, createBucketFiles){
	getUsers(db, store);
    buildTax(db, createBucketFiles);
    createProducts(db, store, createBucketFiles);
};

module.exports = retrieveContainerClass;