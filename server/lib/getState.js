module.exports = function(reqObj, router, actions, req, res){
	actions.getState(reqObj, req, res);
	return;
};