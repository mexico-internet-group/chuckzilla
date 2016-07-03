'use strict';

var executePayment = require('./sendPayment/executePayment');
var request = require('request');
var md5 = require('md5');
var bins = require('./bin');
var ObjectId = require('mongodb').ObjectID;

var pagoFacil = function(db, store, payload, response, price, mail, status, score, boxTime){

	var p = {
		"jsonrpc": "2.0",
		"method": "transaccion",
		"params": {
			"data": {
				"nombre": payload.payment.holder_name,
				"apellidos": payload.payment.holder_last_name,
				"numeroTarjeta": payload.payment.card,
				"cvt": payload.payment.cvv,
				"cp": payload.payment.postalCode,
				"mesExpiracion": payload.payment.mm,
				"anyoExpiracion": payload.payment.aa,
				"monto": price,
				"idSucursal": process.env.NODE_ENV === 'production' ? "####.####.####.####" : "####.####.####.####",
				"idUsuario": process.env.NODE_ENV === 'production' ? "####.####.####.####" : "####.####.####.####",
				"idServicio": "3",
				"email": mail,
				"telefono": payload.payment.phone.substring(0, 10),
				"celular": payload.payment.phone.substring(0, 10),
				"calleyNumero": payload.payment.postalAddress.substring(0, 45),
				"colonia": payload.payment.neighborhood.substring(0, 30),
				"municipio": payload.payment.D_mnpio.substring(0, 30),
				"estado": payload.payment.d_estado.substring(0, 45),
				"pais": "Mexico",
				"noMail": "1",
				"plan": (payload.payment.msi == '1' ? "MSI":"NOR")
			}
		},
		"id": payload.tid
	};

	if(payload.payment.msi == '1'){
		p.params.data.mensualidades = "06";
	}

	request({
	    url: process.env.NODE_ENV === 'production' ? 'https://www.pagofacil.net/ws/public/Wsjtransaccion/' : 'https://www.pagofacil.net/st/public/Wsjtransaccion/',
	    method: "POST",
	    json: p
	},
	function (error, res, paymentResponse) {
		if (error) return console.error(error);
		payload.boxTime = boxTime;
    	if(paymentResponse && paymentResponse.result && paymentResponse.result.autorizado == 1)return executePayment(db, store, payload, response, paymentResponse, 'PagoFacilCard', status, score);
		else {
			return response({error:'DENIED', tid: payload.newTid});
		}
	})
};

module.exports = function(db, store, payload, response){
	var user = store.users[payload.token];
	if(typeof user === 'undefined') return response({error:'YOU_DONT_HAVE_A_USER'});
	if(typeof user.tid === 'undefined') return response({error:'YOU_ARE_NOT_BUYING'});

	if(payload.tid === user.tid){
		user.tid = payload.newTid;

		var pcng = [
		[ 80.31, 85.84, 84.95, 82.40, 129.53, 446.60, 463.93, 113.86],
		[ 86.20, 93.21, 94.04, 89.76, 145.07, 497.70, 518.88, 127.76],
		[ 92.10, 100.54, 103.14, 97.12, 160.55, 548.80, 574.00, 141.71],
		[ 101.76, 111.72, 114.64, 108.00, 191.27, 653.45, 680.93, 169.60],
		[ 111.47, 122.89, 126.15, 118.92, 221.94, 758.28, 787.68, 197.40],
		[ 122.10, 135.28, 139.46, 130.80, 252.70, 865.55, 901.78, 226.72],
		[ 132.78, 147.70, 152.86, 142.76, 283.42, 973.00, 1015.70, 255.99],
		[ 143.41, 160.13, 166.17, 154.64, 314.14, 1080.63, 1129.80, 285.31],
		[ 154.09, 172.52, 179.52, 166.56, 344.86, 1188.08, 1243.73, 314.54],
		[ 164.77, 184.94, 192.83, 178.52, 375.52, 1295.35, 1357.83, 343.85],
		[ 175.40, 197.33, 206.18, 190.78, 411.71, 1423.10, 1494.50, 378.13],
		[ 186.08, 209.75, 219.54, 203.12, 447.80, 1550.85, 1631.00, 412.40],
		[ 196.76, 222.18, 232.85, 215.46, 483.98, 1678.43, 1767.85, 446.67],
		[ 207.39, 234.56, 246.24, 227.77, 520.17, 1806.18, 1904.35, 480.94],
		[ 218.07, 246.99, 259.55, 240.11, 556.26, 1933.93, 2040.85, 515.21],
		[ 228.70, 259.38, 272.91, 252.41, 592.45, 2061.50, 2177.53, 549.44],
		[ 239.38, 271.80, 286.22, 264.75, 628.59, 2189.25, 2314.03, 583.72],
		[ 250.05, 284.23, 299.57, 277.05, 664.72, 2317.00, 2450.70, 618.03],
		[ 260.73, 296.61, 312.92, 289.35, 700.86, 2444.58, 2587.20, 652.26],
		[ 271.36, 309.04, 326.23, 301.69, 737.05, 2572.33, 2723.88, 686.53],
		[ 282.00, 321.47, 339.58, 314.00, 773.14, 2700.08, 2860.55, 720.80],
		[ 292.67, 333.85, 352.94, 326.34, 809.33, 2827.65, 2997.05, 755.08],
		[ 303.35, 346.33, 366.29, 338.68, 845.46, 2955.40, 3133.73, 789.35],
		[ 314.03, 358.71, 379.60, 350.98, 881.65, 3083.15, 3270.23, 823.62],
		[ 324.71, 371.14, 392.95, 363.32, 917.74, 3210.73, 3406.73, 857.89],
		[ 335.29, 383.57, 406.31, 375.62, 953.93, 3338.48, 3543.58, 892.12],
		[ 345.97, 395.95, 419.62, 387.93, 990.06, 3466.23, 3680.08, 926.44],
		[ 356.65, 408.38, 432.97, 400.27, 1026.20, 3593.80, 3816.75, 960.71],
		[ 367.33, 420.76, 446.32, 412.57, 1062.39, 3721.55, 3953.25, 994.94],
		[ 378.00, 433.19, 459.68, 424.91, 1098.53, 3849.30, 4089.75, 1029.25],
		[ 388.64, 445.62, 472.98, 437.25, 1134.67, 3976.88, 4226.43, 1063.48],
		[ 399.27, 458.00, 486.29, 449.55, 1170.80, 4104.63, 4363.10, 1097.75],
		[ 409.94, 470.43, 499.69, 461.89, 1206.99, 4232.38, 4499.78, 1132.03],
		[ 420.62, 482.86, 513.00, 474.20, 1243.08, 4360.13, 4636.28, 1166.30],
		[ 431.30, 495.24, 526.35, 486.50, 1279.27, 4487.70, 4772.78, 1200.57],
		[ 441.93, 507.67, 539.66, 498.84, 1315.41, 4615.45, 4909.45, 1234.84],
		[ 452.61, 520.05, 553.06, 511.14, 1351.54, 4743.20, 5045.95, 1269.11],
		[ 463.24, 532.48, 566.37, 523.48, 1387.68, 4870.78, 5182.63, 1303.34],
		[ 473.92, 544.91, 579.68, 535.82, 1423.87, 4998.53, 5319.30, 1337.66],
		[ 484.60, 557.29, 593.08, 548.12, 1459.96, 5126.28, 5455.80, 1371.93],
		[ 495.23, 569.72, 606.38, 560.46, 1496.14, 5253.85, 5592.48, 1406.16],
		[ 505.91, 582.10, 619.74, 572.77, 1532.28, 5381.60, 5728.98, 1440.47],
		[ 516.58, 594.57, 633.05, 585.07, 1568.42, 5509.35, 5865.48, 1474.70],
		[ 527.22, 607.00, 646.44, 597.41, 1604.61, 5636.93, 6002.15, 1508.98],
		[ 537.85, 619.38, 659.75, 609.71, 1640.75, 5764.68, 6138.83, 1543.25],
		[ 7.18, 8.26, 8.80, 8.14, 21.88, 76.91, 81.9, 20.59],
		[ 322.71, 371.63, 395.85, 365.83, 984.45, 3458.81, 3693.3, 925.95]
		];

		var price = 0;
		var weight = 0;
		map(user.cart.items, function(val, key){
			for(var i = 0; i < val.qty; i++){
				price += val.details.price;
				weight += val.details.weight || 0;
			}
		});

		if(price >= 2998) weight = 0;

		db.collection('users').findOne(
			{token: payload.token},
			{address: 1},
			function(e, d){
				if(e) return console.log(e);
				if(!d) return response({error:'YOU_DONT_HAVE_A_USER'});
				if(!d.address && !d.address[payload.payment.address]) return response({error:'YOU_DONT_HAVE_A_USER'});
				var a = d.address[payload.payment.address];
				db.collection('postalCodes').findOne(
					{
						_id: new ObjectId(a.d_asenta)
					},
					function(e, doc){
						if(e) return console.log(e);
						if(!doc) return response({error:'YOU_DONT_HAVE_A_USER'});
						var zone = parseFloat(doc.zone);
						var boxTime = doc.boxTime;
						var nArr = (weight/1000) === Math.floor(weight/1000) ?  (weight/1000 - 1) : Math.floor(weight/1000);

						if(nArr < 0){
							var deliveryPrice = 0;
						}
						else if(nArr < 45){
							var rule = pcng[nArr];
							var deliveryPrice = rule[zone - 1];
						}
						else{
							var dPrice = ( (weight/1000) === Math.floor(weight/1000) ? (weight/1000) : ( Math.floor(weight/1000) + 1 ) ) * pcng[45][zone - 1];
							var deliveryPrice = Math.max(dPrice, pcng[46][zone - 1]);
						}

						if(weight === 0){
							deliveryPrice = 0;
						}

						payload.payment.d_asenta = doc.d_asenta;
						payload.payment.amount = deliveryPrice;

						if(weight === 0) price += 0;
						else price += deliveryPrice;

						var querystring = {
							i: payload.ip,
							license_key: 'Z944idGc2Tuq',
							city: payload.payment.D_mnpio,
							region: payload.payment.d_estado,
							postal: payload.payment.postalCode,
							country: 'Mexico',
							shipAddr: a.postalAddress + ' ' + a.externalNumber + ' ' + a.internalNumber,
							shipCity: a.d_ciudad,
							shipRegion: a.d_estado,
							shipPostal: a.postalCode,
							shipCountry: 'Mexico',
							domain: user.mail.split('@')[1] || '',
							custPhone: payload.payment.phone,
							emailMD5: md5(user.mail), //string (32) md5
							usernameMD5: md5(user.name + ' ' + user.lastName), //string (32) md5
							bin: payload.payment.card.substring(0,6),
							binName: bins[payload.payment.card.substring(0,6)] || bins[payload.payment.card.substring(0,5)] || bins[payload.payment.card.substring(0,4)] || '',
							user_agent: payload.userAgent,
							accept_language: 'es-ES,es;q=0.8,en;q=0.6,ro;q=0.4',
							txnID: payload.tid,
							order_amount: price,
							order_currency: 'MXN'
						};
						request({
							url: 'https://minfraud.maxmind.com/app/ccv2r',
							method: 'GET',
							qs: querystring
						}, function(error, responseFraud, body){
							if(error) {
							    return response({error:'TIME_OUT'});
							}
							else {
								var res = body.split(";");
								var mindFraud = {};

								for(var i = 0; i < res.length; i++){
									var temp = res[i].split("=");
									mindFraud[temp[0]] = temp[1]
								}

								var proxyScore = parseFloat(mindFraud.proxyScore);
								var riskScore = parseFloat(mindFraud.riskScore);

								if(mindFraud.ip_countryName !== 'Mexico' && (typeof process.env.NODE_ENV !== 'undefined' || process.env.NODE_ENV === 'production') ){
									return response({error:'YOU_ARE_NOT_BUYING', tid: payload.newTid});
								}

								if(riskScore < 0 && proxyScore === 0){
									return pagoFacil(db, store, payload, response, price, user.mail, 'OK', mindFraud, boxTime);
								}
								else if(riskScore > 70){
									return response({error:'YOU_ARE_NOT_BUYING', tid: payload.newTid});
								}
								else{
									return pagoFacil(db, store, payload, response, price, user.mail, 'PENDING', mindFraud, boxTime);
								}


							}
						});
					}
				);
			}
		);
	}
	else{
		return response({error:'TIME_OUT', tid: payload.newTid});
	}
	return;
};
