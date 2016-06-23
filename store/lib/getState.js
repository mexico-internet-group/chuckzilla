module.exports = function(db, store, payload, response){
	response({data: store});
	return;
};