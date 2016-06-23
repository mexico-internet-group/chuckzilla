'use strict';

var IntComexRequest = require('../dsv/createRequest');

module.exports = function(db, store, payload, response){
	if(!payload.id) return IntComexRequest('GetCatalog', null, response);
	IntComexRequest('GetProduct', payload.id, response);
};
