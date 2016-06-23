var exec = require('child_process').exec;
var request = require('request');
var updateBundle = require('./updateBundle');

module.exports = function(_this, db, store, payload, response, createBucketFiles){
	var item = payload.item;
	var collection = db.collection('inventory');
	if(typeof item.body.char === 'undefined' && !item.body.isBundle){
		var searchItem = {
			_id: item.body._id,
			id: item.body._id,
			sku: item.body.sku,
			displayName: item.body.displayName,
			unitOfMeasure: item.body.unitOfMeasure,
			width: item.body.width,
			height: item.body.height,
			deep: item.body.deep,
			weight: item.body.weight,
			metaTitle: item.body.metaTitle,
			metaDescription: item.body.metaDescription,
			keywords: item.body.keywords,
			popularity: parseFloat( item.body.popularity )
		};
		collection.findAndModify(
			{_id: item.body._id},
			[],
			{$set: searchItem},
			{upsert: true, "new": true},
			function(err, object){
				if(!payload.isMasive) response({
					route: payload.route,
					isHTTP: payload.isHTTP,
					socketID: payload.socketID
				});
			}
		);
	}else{
		if(!item.body.isBundle){
			map(item.body.char, function(val , key){
				val.searchPropertie = val.propertie.toLowerCase();
				val.searchValueText = val.valueText.toLowerCase();
			});
		}

		var searchImages = function(id, a, cb){
			request('http://storage.googleapis.com/hmovil-data/images/' + id + '-' + a + '.jpg', function (error, response, body) {
				if (response.statusCode == 404) {
					cb(a);
				}
				else{
					a++;
					searchImages(id, a, cb);
				}
			});
		};

		var searchItem = {
			_id: item.body._id,
			id: item.body._id,
			available : (function(){
				if(typeof item.body.available === 'undefined' || !item.body.available) return false;
				else return true;
			})(),
			height : parseFloat( item.body.height ),
			width : parseFloat( item.body.width ),
			deep : parseFloat( item.body.deep ),
			weight : parseFloat( item.body.weight ),
			department : item.body.department === '0' ? '' : item.body.department,
			family : item.body.family === '0' ? '' : item.body.family,
			line : item.body.line === '0' ? '' : item.body.line,
			location: item.body.location === '0' ? 'online' : item.body.location,
			price : parseFloat( item.body.price ),
			previousPrice : (function(){
				var p = item.body.price;
				var o = item.body.originalPrice;
				if(p !== o){
					return parseFloat( o );
				}
				else{
					return parseFloat( item.body.previousPrice );
				}
			})(),
			displayName : item.body.displayName,
			//onHandInventory : parseFloat( item.body.onHandInventory ),
			initialRating : parseFloat( item.body.initialRating ),
			freeShipping : (function(){
				if(typeof item.body.freeShipping === 'undefined' || !item.body.freeShipping) return false;
				else return true;
			})(),
			msi : (function(){
				var m = item.body.msi;
				var arr = m.split(',');
				var msi = map(arr, function(val, key){
					var v = val.trim();
					if(v !== '') return v;
				});
				return msi;
			})(),
			isBundle : (function(){
				if(typeof item.body.isBundle === 'undefined' || !item.body.isBundle) return false;
				else return true;
			})(),
			isDynamicParent : (function(){
				if(typeof item.body.isDynamicParent === 'undefined' || !item.body.isDynamicParent) return false;
				else return true;
			})(),
			isDynamicChild : (function(){
				if(typeof item.body.isDynamicChild === 'undefined' || !item.body.isDynamicChild) return false;
				else return true;
			})(),
			char : item.body.char,
			dynamicChar : [ ],
			description : item.body.description,
			discountTypeA: item.body.discountTypeA,
			discountTypeB: item.body.discountTypeB,
			discountTypeC: item.body.discountTypeC,
			inComing: typeof item.body.inComing === 'undefined' ? 0 : item.body.inComing,
			metaTitle: item.body.metaTitle,
			metaDescription: item.body.metaDescription,
			keywords: item.body.keywords,
			popularity: parseFloat( item.body.popularity )
		};

		searchItem.searchDepartment = searchItem.department.replace(/-/g,'').replace(/ /g,'');
		searchItem.searchFamily = searchItem.family.replace(/-/g,'').replace(/ /g,'');
		searchItem.searchLine = searchItem.line.replace(/-/g,'').replace(/ /g,'');

		if(item.files !== 0){
			searchItem.numberOfImages = item.files;
		}
		else{
			searchItem.numberOfImages = parseFloat( item.body.numberOfImages );
		}

		if(!searchItem.previousPrice) searchItem.previousPrice = searchItem.price;

		var lUpdate = function(a){
			if(a) searchItem.numberOfImages = a;
			if(item.body.line.toLowerCase().indexOf('descarga') > -1) searchItem.onHandInventory = 99999999999;
			createBucketFiles.sendString('products', searchItem._id, 'product', JSON.stringify(searchItem), '10' );
			var suggestArr = searchItem.displayName.split(' ');
			suggestArr.push(searchItem.displayName);

			searchItem.suggest = {
				input : suggestArr,
				output : searchItem.displayName,
				payload : { productId : searchItem._id },
				weight : 1
			};

			searchItem.line = searchItem.line.replace(/-/g,' ');

			if(item.body.isNew === 'true'){
				searchItem.onHandInventory = 0;
				exec('insert ' + searchItem._id + ' ' + "'" + JSON.stringify(searchItem) + "'" , function (e, stdout, stderr) {  });
				searchItem.carted = {};
				searchItem.cost = 0;
				searchItem.rating = parseFloat( item.body.initialRating );
				delete searchItem.suggest;
			}
			else{
				exec('flush ' + searchItem._id + ' ' + "'" + JSON.stringify({ doc: searchItem }) + "'" , function (e, stdout, stderr) { if(e) console.log(e) });
			}

			searchItem.line = searchItem.line.replace(/ /g,'-');

			if(!store.products[searchItem.id]) store.products[searchItem.id] = {};

			store.products[searchItem.id].char = {
				department: searchItem.department,
				family: searchItem.family,
				line: searchItem.line,
				price: searchItem.price,
				displayName: searchItem.displayName,
				weight: searchItem.weight
			};

			if(item.body.isNew === 'true' || item.body.line.toLowerCase().indexOf('descarga') > -1 ){
				store.products[searchItem.id].onHandInventory = searchItem.onHandInventory;
			}
			store.products[searchItem.id].available = searchItem.available;

			searchItem.cost = parseFloat( item.body.cost );

			collection.findAndModify(
				{_id: item.body._id},
				[],
				{$set: searchItem},
				{upsert: true, "new": true},
				function(err, object){
					if(!payload.isMasive) response({
						route: payload.route,
						isHTTP: payload.isHTTP,
						socketID: payload.socketID
					});
				}
			);
		};

		if(item.body.isBundle){
			searchItem.children = item.body.children;

			if(!searchItem.numberOfImages || searchItem.numberOfImages === 0){
				searchImages(item.body._id, 0, function(nImages){
					updateBundle(_this, db, store, payload, response, createBucketFiles, searchItem, nImages);
				});
			}
			else{
				updateBundle(_this, db, store, payload, response, createBucketFiles, searchItem);
			}
		}else if(payload.isMasive || !searchItem.numberOfImages || searchItem.numberOfImages === 0){
			searchImages(item.body._id, 0, function(nImages){
				lUpdate(nImages);
			});
		}
		else{
			lUpdate();
		}
	}

	return;
};
