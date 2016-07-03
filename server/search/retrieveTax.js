var fxClass = module.exports = function(req, res, client){
	var query = req.query;
	if(!query.offset) query.offset = 0;
	query.offset = parseFloat(query.offset);
	var obj = {
		query: {
			filtered: {
				filter: {
					bool: {
						must: [
							{
								range: {
									onHandInventory:{
										gt: 0
									}
								}
							},
							{
								term: { available: true }
							},
							{
								term: {  }
							}
						]
					}
				}
	    	}
		},
		sort: [],
		facets: {
			Marca: {
				facet_filter: {
					nested: {
						path: 'char',
						query: {
							match: {
								'char.propertie': 'Marca'
							}
						},
						join: false
					}
				},
				terms: {
					field: 'char.valueText',
					size: 40
				},
				nested: 'char'
			},
			Color: {
				facet_filter: {
					nested: {
						path: 'char',
						query: {
							match: {
								'char.propertie': 'Color'
							}
						},
						join: false
					}
				},
				terms: {
					field: 'char.valueText',
					size: 40
				},
				nested: 'char'
			},
			Capacidad: {
				facet_filter: {
					nested: {
						path: 'char',
						query: {
							match: {
								'char.propertie': 'Capacidad'
							}
						},
						join: false
					}
				},
				terms: {
					field: 'char.valueText',
					size: 40
				},
				nested: 'char'
			},
			'Tamaño': {
				facet_filter: {
					nested: {
						path: 'char',
						query: {
							match: {
								'char.propertie': 'Tamaño'
							}
						},
						join: false
					}
				},
				terms: {
					field: 'char.valueText',
					size: 40
				},
				nested: 'char'
			}
		},
		partial_fields: {
			data: {
				exclude: ["description", "suggest"]
	    	}
	  	}
	};

	obj.query.filtered.filter.bool.must[2].term[query.parent] = query.value;

	map(query, function(val, key){
		if(key !== 'parent' && key !== 'value' && key !== 'offset' && key !== 'orderProp' && key !== 'order'){
			var tmpObj = {
				nested: {
					path: 'char',
					query: {
						bool: {
							must: [
								{
									match: {
										'char.searchPropertie': key ? key.toLowerCase() : ''
									}
								},
								{
									match: {
										'char.searchValueText': val ? val.toLowerCase() : ''
									}
								}
							]
						}
					}
				}
			};
			obj.query.filtered.filter.bool.must.push(tmpObj);
		}
	});

	var orderObj = {};
	if(query.orderProp === '_score') query.orderProp = 'popularity';
	orderObj[query.orderProp] = query.order;

	obj.sort.push(orderObj);

	client.search({
			index: '####.####.####.####',
			from: query.offset * 20,
			size: 20,
			body: obj
		},
		function (error, response) {
    		if (error){
				console.log(error);
				return res.send( sendError('SEARCH_ERROR_RETRY_LATER') );
			}
			response.offset = query.offset;
			res.send(response);
    		return;
  		}
	);

};
