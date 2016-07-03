module.exports = function(reqObj, router, actions, req, res){
	var a = req.body;
	var token = req.cookies.usrtkn;
	var error = false;

	var address = {
		addressName: a.addressName || '',
		postalAddress: a.postalAddress || '',
		postalCode: a.postalCode || '',
		d_asenta: a.d_asenta || '',
		D_mnpio: a.D_mnpio || '',
		d_estado: a.d_estado || '',
		d_ciudad: a.d_ciudad || '',
		externalNumber: a.externalNumber || '',
		internalNumber: a.internalNumber || ''
	};

	map(address, function(val, key){
		if(val === '' && key !== 'internalNumber'){
			error = true;
		}
	});

	if(error) res.send( sendError('ADDRESS_DATA_INCOMPLETE') );
	else if(typeof token === 'undefined') res.send( sendError('YOU_ARE_NOT_HUMAN') );
	else actions.setAddress(reqObj, req, res, address, token);
	
	return;
};