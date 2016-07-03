module.exports = function(reqObj, router, actions, req, res){
	var query = req.query.zip;
	if(typeof query === 'undefined') res.send( sendError('PLEASE_SEND_A_ZIP_CODE') );
	else actions.getZipCode(reqObj, req, res, query);
	return;
};