var ipAddress;

if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV !== 'production'){
	//ipAddress = '104.197.184.211';
	//ipAddress = '130.211.124.234';
	ipAddress = '127.0.0.1';
}
else{
	ipAddress = '10.240.0.2';
}

var rawCommand = "curl -XPUT 'http://" + ipAddress + ":9200/dgl/product/##PRODUCTID##?refresh=true' -d '##BODY##'";
var exec = require('child_process').exec;

var fxClass = module.exports = function(a) {

	console.log('--> Insertando documentos al motor de busqueda');

	var insert = function(val, index){

		var id = val._id.replace(/ /g,'-');
		val._id = id;
		val.suggest = {
			input : [ val.displayName ],
			output : val.displayName,
			payload : { productId : id },
			weight : 1
		};

		var obj = JSON.stringify(val);
		var cmd = rawCommand.replace('##PRODUCTID##', id).replace('##BODY##', obj);

		exec(cmd, function (e, stdout, stderr) {
			if(e){
				console.log(cmd);
			}

			if(index + 1 < a.length){
				insert(a[index + 1], index + 1);
			}
			else{
				console.log('--> Motor de busqueda listo');
			}

		});

	};

	insert(a[0],0);

};
