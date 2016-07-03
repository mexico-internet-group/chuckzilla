var fxClass = module.exports = function(req, res, client){
	var query = req.query;
	var obj = {
		'product-suggest':
			{
				text: query.q,
				completion:{
					field: "suggest"
				}
			}
	};

	client.suggest({
			index: '####.####.####.####',
			body: obj
		},
		function (error, response) {
    		if (error) res.send( sendError('SEARCH_ERROR_RETRY_LATER') );
			else res.send(response);
    		return;
  		}
	);
};
