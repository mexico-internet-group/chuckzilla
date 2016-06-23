var openPayClass = require('openpay');
var openpay = new openPayClass('mgrw4ztnu6wiuo3bdysp', 'sk_b7860786e81d43388d189b58cc251271', false);

var chargeRequest = {
   'source_id' : 'kqgykn96i7bcs1wwhvgw',
   'method' : 'card',
   'amount' : 100,
   'currency' : 'MXN',
   'description' : 'Cargo inicial a mi cuenta',
   'order_id' : 'oid-00051',
   'device_session_id' : 'kR1MiQhz2otdIuUlQkbEyitIqVMiI16f',
   'customer' : {
        'name' : 'Juan',
        'last_name' : 'Vazquez Juarez',
        'phone_number' : '4423456723',
        'email' : 'juan.vazquez@empresa.com.mx'
   }
}

openpay.charges.create(chargeRequest, function(error, charge) {
	if(error){
		console.log(error);
	}
	else{
		console.log(charge);
	}
});
