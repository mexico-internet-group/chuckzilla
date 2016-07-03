var Iconv = require('iconv').Iconv;
var fs = require('fs');
var mongo = require('mongodb').MongoClient;

function readFileSync_encoding(filename, encoding) {
    var content = fs.readFileSync(filename);
    var iconv = new Iconv(encoding, 'UTF-8');
    var buffer = iconv.convert(content);
    return buffer.toString('utf8');
}

var d = readFileSync_encoding('./postalCode.txt', 'iso-8859-1');

d = d.replace('El Catálogo Nacional de Códigos Postales, es elaborado por Correos de México y se proporciona en forma gratuita para uso particular, no estando permitida su comercialización, total o parcial, ni su distribución a terceros bajo ningún concepto.\r\n','');
d = d.replace('d_codigo|d_asenta|d_tipo_asenta|D_mnpio|d_estado|d_ciudad|d_CP|c_estado|c_oficina|c_CP|c_tipo_asenta|c_mnpio|id_asenta_cpcons|d_zona|c_cve_ciudad\r\n','');

arr = d.split('\r\n');
arr.pop();

var tmpArr = [];

for( var g = 0; g < arr.length; g++){
	var a = arr[g].split('|');
	arr[g] = a;
}

for( var i = 0; i < arr.length; i++){
	var tmpObj = {
		d_codigo: arr[i][0],
		d_asenta: arr[i][1],
		d_tipo_asenta: arr[i][2],
		D_mnpio: arr[i][3],
		d_estado: arr[i][4],
		d_ciudad: arr[i][5],
		d_CP: arr[i][6],
		c_estado: arr[i][7],
		c_oficina: arr[i][8],
		c_CP: arr[i][9],
		c_tipo_asenta: arr[i][10],
		c_mnpio: arr[i][11],
		id_asenta_cpcons: arr[i][12],
		d_zona: arr[i][13],
		c_cve_ciudad: arr[i][14]
	};
	tmpArr.push(tmpObj);
}

var mongoUri;

if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production'){
	mongoUri = 'mongodb://127.0.0.1:27017/commerce';
}
else{
	mongoUri = 'mongodb://127.0.0.1:27017/commerce';
}

mongo.connect(mongoUri, function(err, db){
	if(err){
		console.log(err);
	}
	db.collection('postalCodes').insert(tmpArr, {w: 1}, function(e, docs){
		if(!e){
			console.log('--> Listo');
		}
		db.close();
	});
});

console.log(tmpArr);
