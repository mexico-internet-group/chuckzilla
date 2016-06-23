var openPayClass = require('openpay');
var openpay = new openPayClass('mgrw4ztnu6wiuo3bdysp', 'sk_b7860786e81d43388d189b58cc251271', false);

var storeChargeRequest = {
   'method' : 'store',
   'amount' : 100,
   'description' : 'Cargo con tienda',
   'customer' : {
        'name' : 'Juan',
        'last_name' : 'Vazquez Juarez',
        'phone_number' : '4423456723',
        'email' : 'juan.vazquez@empresa.com.mx'
   }
};

openpay.charges.create(storeChargeRequest, function(error, charge) {
	if(error) return console.error(error);
	else {
		console.log(charge);
	}
});
