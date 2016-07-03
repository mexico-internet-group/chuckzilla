module.exports = function(reqObj, router, actions, req, res){
	var token = req.cookies.usrtkn;
	var id = req.body.id;
	var qty = req.body.qty;
	var operator = req.body.operator;

	if(typeof id === 'undefined'){
		res.send( sendError('DATA_INCOMPLETE') );
	}
	else{
		actions.addToCart(reqObj, req, res, token, id, qty, operator);
	}
	return;
};