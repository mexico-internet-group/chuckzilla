module.exports = function(bucket){
	
	function sendString(route, name, vn, str, maxAge){
		var file = bucket.file( route + '/' + name );
		var obj = 'var ' + vn + ' = ' + str + ';';
		
		var stream = file.createWriteStream({
			metadata: {
				cacheControl: 'public, max-age=' + maxAge,
				contentType: 'text/javascript; charset=utf-8'
			} 
		});

		stream.on('error', function(err) {
			console.log(err);
		});
		stream.on('finish', function() {
			file.makePublic();
		});
		stream.end(obj);
	};
	
	return{
		sendString: sendString
	};
	
};