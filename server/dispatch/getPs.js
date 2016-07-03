module.exports = function(payload, res){

	res.cookie('tid', payload.tid , {
		expires: new Date(Date.now() + (15*60*1000) ),
		httpOnly: true,
		domain: domainCookie
	});

	if(payload.type !== 'user'){
		res.send({
			isGuest: true,
			cart: payload.cart
		});
	}
	else{
		res.send({
			isGuest: false,
			name: payload.name,
			lastName: payload.lastName,
			mail: payload.mail,
			cart: payload.cart,
			address: payload.address,
			orders: payload.orders,
			phone: payload.phone
		});
	}
return;
};
