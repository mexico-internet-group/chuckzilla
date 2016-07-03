var setToken = function(reqObj,req,res){
	req.token = 'rt' + uuid.v1();
	reqObj[req.token] = {};
    reqObj[req.token].req = req;
    reqObj[req.token].res = res;
};

var actions = function(client){

	this.getState = function(reqObj, req, res){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'GET_STATE',
			tokenRequest: req.token
        });
	};

    this.setUser = function(reqObj, req, res, token, name, lastName, mail, password, phone, tid){
		setToken(reqObj, req, res);
        client.emit('dispatcherHandleServer',{
            actionType:'SET_USER',
            token:token,
            name:name,
            lastName:lastName,
            mail:mail,
            password:password,
			tid: tid,
			phone: phone,
			tokenRequest:req.token
        });
    };

    this.login = function(reqObj, req, res, mail, password, token){
		setToken(reqObj, req, res);
        client.emit('dispatcherHandleServer',{
            actionType:'LOGIN',
			mail:mail,
            password:password,
			token: token,
			tokenRequest:req.token
        });
	};

    this.getUser = function(reqObj, req, res, token){
		setToken(reqObj, req, res);
        client.emit('dispatcherHandleServer',{
            actionType: 'GET_USER',
            token: token,
			tokenRequest: req.token
        });
    };

	this.setGuest = function(reqObj, req, res, token){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'SET_GUEST',
            token: token,
			tokenRequest: req.token
        });
	};

	this.addToCart = function(reqObj, req, res, token, id, qty, operator){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'ADD_TO_CART',
            token: token,
			id: id,
			qty: qty,
			operator: operator,
			tokenRequest: req.token
        });
	};

	this.buyNow = function(reqObj, req, res, token, tid){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'BUY_NOW',
            token: token,
			tokenRequest: req.token,
			tid: tid
        });
	};

	this.getPs = function(reqObj, req, res, token, tid, newTid){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'GET_PS',
            token: token,
			tokenRequest: req.token,
			tid: tid,
			newTid: newTid
        });
	};

	this.getZipCode = function(reqObj, req, res, query){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'GET_ZIP_CODE',
			query: query,
            tokenRequest: req.token
        });
	};

	this.setAddress = function(reqObj, req, res, address, token){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'SET_ADDRESS',
			address: address,
			token: token,
            tokenRequest: req.token
        });
	};

	this.sendPayment = function(reqObj, req, res, payment, token, tid, newTid){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'SEND_PAYMENT',
			payment: payment,
			token: token,
			tid: tid,
			newTid: newTid,
            tokenRequest: req.token
        });
	};

	this.getAddress = function(reqObj, req, res, token){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'GET_ADDRESS',
			token: token,
            tokenRequest: req.token
        });
	};

	this.setFavoriteAddress = function(reqObj, req, res, token, key){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'SET_FAVORITE_ADDRESS',
			token: token,
			key: key,
            tokenRequest: req.token
        });
	};

	this.getUserOrders = function(reqObj, req, res, token){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'GET_USER_ORDERS',
			token: token,
            tokenRequest: req.token
        });
	};

	this.getMailingData = function(mail, ip, userAgent, referer){
		client.emit('dispatcherHandleServer',{
            actionType: 'GET_MAILING_DATA',
			mail: mail,
			ip: ip,
			userAgent: userAgent,
			referer: referer
        });
	};

	this.paypalPayment = function(reqObj, req, res, token, tid, newTid, delivery, addressDetail, phone){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'PAYPAL_PAYMENT',
			token: token,
			tid: tid,
			newTid: newTid,
			delivery: delivery,
			addressDetail: addressDetail,
			phone: phone,
            tokenRequest: req.token
        });
	};

	this.executePaypal = function(reqObj, req, res, token, tid, newTid, payment){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'EXECUTE_PAYPAL',
			token: token,
			tid: tid,
			newTid: newTid,
            tokenRequest: req.token,
			payment: payment,
			paymentId: req.cookies.ppp
        });
	};

	this.SetExpressCheckout = function(reqObj, req, res, token, tid, newTid, address, amount){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'SET_EXPRESS_CHECKOUT',
			token: token,
			tid: tid,
			newTid: newTid,
            tokenRequest: req.token,
			address: address,
			amount: amount
        });
	};

	this.DoExpressCheckoutPayment = function(reqObj, req, res, token, tid, newTid, obj){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'DO_EXPRESS_CHECKOUT_PAYMENT',
			token: token,
			tid: tid,
			newTid: newTid,
            tokenRequest: req.token,
			obj: obj
        });
	};

	this.IntComex = function(reqObj, req, res, id){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'INTCOMEX',
            tokenRequest: req.token,
			id: id
        });
	};

	this.PostPayment = function(reqObj, req, res, payment, token, tid, newTid, userAgent, ip){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'POST_PAYMENT',
			payment: payment,
			token: token,
			tid: tid,
			newTid: newTid,
            tokenRequest: req.token,
			userAgent: userAgent,
			ip: ip
        });
	};

	this.siteMap = function(reqObj, req, res){
		setToken(reqObj, req, res);
		client.emit('dispatcherHandleServer',{
            actionType: 'SITEMAP',
            tokenRequest: req.token
        });
	};

	this.newsRegister = function(reqObj, req, res, name, mail, token, ipuser, fingerprint){
		setToken(reqObj, req, res);
        client.emit('dispatcherHandleServer',{
            actionType:'NEWS_REGISTER',
            name:name,
            mail:mail,
						token: token,
						ipuser: ipuser,
						fingerprint: fingerprint,
						tokenRequest:req.token
        });
    };

};

module.exports = actions;
