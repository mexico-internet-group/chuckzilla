module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var tid = req.cookies.tid;
	var newTid = 'tid' + uuid.v1();
	var address = req.query.address;
	var amount = 0;

	if(req.query.amount) amount = parseFloat(req.query.amount);
	if(!address) return res.send( sendError('YOU_DONT_HAVE_A_SHIPPING_ADDRESS') );
	if(!token) return res.send( sendError('YOU_ARE_NOT_HUMAN') );
	if(!tid) return res.send( sendError('YOU_ARE_NOT_BUYING') );

	return actions.SetExpressCheckout(reqObj, req, res, token, tid, newTid, address, amount);
};
