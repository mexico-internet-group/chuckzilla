var fxClass = module.exports = function(req, res, client){
	var query = req.query;

	if(!query.offset) query.offset = 0;
	query.offset = parseFloat(query.offset);

	var obj = {
		query: {
			filtered: {
				query: {
					bool: {
					    should: [
							{
								match: {
									line: {
										query: query.q,
										boost: 30,
										fuzziness: 'AUTO'
									}
								}
							},
							{
								match: {
									family: {
										query: query.q,
										boost: 29,
										fuzziness: 'AUTO'
									}
								}
							},
							{
								match: {
									department: {
										query: query.q,
										boost: 28,
										fuzziness: 'AUTO'
									}
								}
							},
							{
								match: {
									displayName: {
										query: query.q,
										boost: 2,
										fuzziness: 'AUTO'
									}
								}
							},
							{
								match: {
									'displayName.spanish': {
										query: query.q,
										boost: 2,
										fuzziness: 'AUTO'
									}
								}
							},
							{
								match: {
									description: {
										query: query.q,
										boost: 1,
										fuzziness: 'AUTO'
									}
								}
							}
					    ]
					}
				},
				filter: {
					bool: {
						must: [
							{
								range: {
									onHandInventory: {
										gt: 0
									}
								}
							},
							{
								term: { available: true }
							}
						]
					}
				}
			}
		},
		sort: [],
		facets: {
			/*Precio: {
				terms: {
					field: 'price'
				}
			},*/
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
				exclude: ["description", 'suggest']
			}
    	}
	};

	map(query, function(val, key){
		if(key !== 'q' && key !== 'offset' && key !== 'gte' && key !== 'lte' && key !== 'orderProp' && key !== 'order'){
			var tmpObj = {
				nested: {
					path: 'char',
					query: {
						bool: {
							must: [
								{
									match: {
										'char.searchPropertie': key
									}
								},
								{
									match: {
										'char.searchValueText': val
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
				return res.send({error:1});
			}
			response.offset = query.offset;
			res.send(response);
    		return;
  		}
	);

};
