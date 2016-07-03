var fs = require('fs');

var orderBody = fs.readFileSync('./mailing/html/orderBody.html', 'utf8');
var orderItem = fs.readFileSync('./mailing/html/orderItem.html', 'utf8');
var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var setFutureDay = function(n){
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(today.getDate() + n);
	return yesterday;
};

module.exports = function(order){
	if(order.deliveryType === 1){
		x = 1;
	}
	else if(order.deliveryType === 2){
		x = 3;
	}
	else{
		x = 7;
	}
	var d = setFutureDay(x);
	var body = orderBody;
	var _order = (10000 + order.orderSequence);
	var _orderLink = '/mi-cuenta/historial-de-pedidos';
	var _date = 'De 3 a 6 días hábiles';
	var _userName = order.name;
	var _address = order.address.postalAddress + ' ' + order.address.externalNumber + ' ' + order.address.internalNumber + ', ' + order.address.D_mnpio + ', ' + order.address.d_ciudad + ', ' + order.address.d_estado + ', C.P. ' + order.address.postalCode;
	var _productos = 0;
	var _envio = parseFloat( order.amount );
	var _items = '';
	var _dN = new Date();
	var _today = _dN.getDate() + ' de ' + months[ _dN.getMonth() ] + ' de ' + _dN.getFullYear();

	map(order.items, function(val ,key){
		var originalStr = orderItem;

		originalStr = originalStr.replace(/##ITEMLINK##/g, '####.####.####.####' + val.details.department.replace(/ /g,'-') + '/' + val.details.family.replace(/ /g,'-') + '/' + val.details.line.replace(/ /g,'-') + '/' + val.details.displayName.replace(/ /g,'-') + '-' + key );
		originalStr = originalStr.replace(/##ITEMIMAGE##/g, '####.####.####.####'+ key +'-0.jpg');
		originalStr = originalStr.replace(/##ITEMNAME##/g, val.details.displayName );
		originalStr = originalStr.replace(/##ITEMPRICE##/g, val.details.price.toFixed(2) );

		for(var l = 0; l < val.qty; l++){
            _productos += val.details.price;
			_items += originalStr;
		}
	});

    var _total = _productos + _envio;
	var _subtotal = (_total * 1) / 1.16;

	body = body.replace(/##ORDERLINK##/g, _orderLink);
	body = body.replace(/##ORDER##/g, _order);
	body = body.replace(/##DATE##/g, _date);
	body = body.replace(/##USERNAME##/g, _userName);
	body = body.replace(/##ADDRESS##/g, _address);
	body = body.replace(/##ITEMS##/g, _items);
	body = body.replace(/##TODAY##/g, _today);
	body = body.replace(/##PRODUCTOS##/g, _productos.toFixed(2) );
	body = body.replace(/##ENVIO##/g, _envio.toFixed(2) );
	body = body.replace(/##SUBTOTAL##/g, _subtotal.toFixed(2) );
	body = body.replace(/##TOTAL##/g, _total.toFixed(2) );

	mail.send(order.mail, 'Confirmación de Compra ' + _order, body);
};
