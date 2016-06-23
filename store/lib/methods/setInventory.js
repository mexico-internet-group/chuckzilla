var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'admin@hmovil.com',
        pass: 'Omega0023'
    }
});

var setInventory = function(_this, db, store, payload, response, createBucketFiles, pendingInventory){
    if(payload.data && payload.data.secret && payload.data.secret === 'CHUCKZILLA_RULES_THE_WORLD'){
		var data = JSON.parse(payload.data.data);
		var now = new Date();

		var str = '';

		map(data, function(val, key){
			var item = store.products[val.id];
			var rawQty = val.qty;
			var qty = parseFloat(rawQty);

			if(val.status === 'Damaged Product'){
				db.collection('inventoryError').insertOne({
					info: val,
					reason: 'DAMAGED_PRODUCT',
					timeStamp: now
				}, function(e, r){
					if(e) return console.log(e);
				});

				str += '<div>' + val.id + ' ' + val.qty + '</div>';
				str += '<div>DAMAGED_PRODUCT</div>';
				str += '<br />';
				str += '<br />';
				return;
			}
			if(val.status === 'CALIDAD'){
				db.collection('inventoryError').insertOne({
					info: val,
					reason: 'EN_PROCESO_DE_CALIDAD',
					timeStamp: now
				}, function(e, r){
					if(e) return console.log(e);
				});
				str += '<div>' + val.id + ' ' + val.qty + '</div>';
				str += '<div>EN_PROCESO_DE_CALIDAD</div>';
				str += '<br />';
				str += '<br />';
				return;
			}
			/*if(val.location.toUpperCase() !== 'HMOVIL'){
				db.collection('inventoryError').insertOne({
					info: val,
					reason: 'UNKNOW_LOCATION',
					timeStamp: now
				}, function(e, r){
					if(e) return console.log(e);
				});
				return;
			}*/
			if(!item){
				db.collection('inventoryError').insertOne({
					info: val,
					reason: 'UNKNOW_PRODUCT',
					timeStamp: now
				}, function(e, r){
					if(e) return console.log(e);
				});
				str += '<div>' + val.id + ' ' + val.qty + '</div>';
				str += '<div>UNKNOW_PRODUCT</div>';
				str += '<br />';
				str += '<br />';
				return;
			}
			if( isNaN(qty) ){
				db.collection('inventoryError').insertOne({
					info: val,
					reason: 'UNEXPECTED_QTY',
					timeStamp: now
				}, function(e, r){
					if(e) return console.log(e);
				});
				str += '<div>' + val.id + ' ' + val.qty + '</div>';
				str += '<div>VALOR_NO_VALIDO</div>';
				str += '<br />';
				str += '<br />';
				return;
			}
			
			
			if(pendingInventory[val.id]) qty = (qty - pendingInventory[val.id]);
			item.onHandInventory = qty;

            if(item.parent){
                map(item.parent, function(value, index){
                    var bundle = store.products[value];
                    if(!bundle) return null;
                    if(bundle.children){
                        var max = 0;
                        map(bundle.children, function(subvalue, subindex){
                            if(store.products[subvalue].onHandInventory > max) max = store.products[subvalue].onHandInventory;
                        });
                        bundle.onHandInventory = max;

                        global.searchEngine.update({
                            index: 'dgl',
                            type: 'product',
                            id: value,
                            body: {
                                doc: {
                                    onHandInventory: bundle.onHandInventory
                                }
                            },
                            function(e, r){}
                        });
                        db.collection('inventory').update(
                            {_id: value},
                            {$set:
                                {
                                    onHandInventory: bundle.onHandInventory
                                }
                            },
                            {},
                            function(){}
                        );

                    }
                });
            }


			db.collection('inventory').findAndModify(
				{_id: val.id},
				[],
				{
					$set:{
						onHandInventory: item.onHandInventory
					}
				},
				{new: true},
				function(e, object){
					if(e) return console.log(e);
					delete object.value.carted;
					createBucketFiles.sendString('products', object.value._id, 'product', JSON.stringify(object.value), '10' );
				}
			);

			global.searchEngine.update({
				index: 'dgl',
				type: 'product',
				id: val.id,
				body: {
					doc: {
						onHandInventory: item.onHandInventory
					}
				}
			},
            function(e, r){}
            );

		});

		var mailOptions = {
	        from: 'hmovil <admin@hmovil.com>',
	        to: 'jasso.enrique@gmail.com',
	        subject: 'Reporte de errores en inventario Celistics',
	        html: str
	    };

	    transporter.sendMail(mailOptions, function(error, info){
	        if(error){
	            return console.log(error);
	        }
	        else{
	          return;
	        }
	    });
	}

    return;
};

module.exports = function(_this, db, store, payload, response, createBucketFiles){

    var pendingInventory = {};

    db.collection('inventory').find({},{_id: 1, onHandInventory: 1}).toArray(function(e, d){
        if(e) return console.log(e);
        map(d, function(val, key){
            global.searchEngine.update({
                index: 'dgl',
                type: 'product',
                id: val._id,
                body: {
                    doc: {
                        onHandInventory: val.onHandInventory
                    }
                },
                function(e, r){}
            });
        });
    });

    var pendings = db.collection('orders').find({
        $or: [
            { orderStatus: 'PENDING_REVIEW' },
            { orderStatus: 'WAITING_SYSTEM'}
        ]
    },{cart: 1});

    pendings.toArray(function(e, docs){
        if(e) console.log('SET_INVENTORY: Pendings Query ToArray', e);
        map(docs, function(val, key){
            var items = val.cart.items;
            map(items, function(upc, item){
                if(pendingInventory[upc]){
                    pendingInventory[upc] = pendingInventory[upc] + item.qty;
                }
                else{
                    pendingInventory[upc] = item.qty;
                }
            });
        });
		
		var buying = db.collection('users').find(
			{'cart.status': 'buying'},
			{cart: 1}
		);
		
		buying.toArray(function(error, els){
			map(els, function(val, key){
				var items = val.cart.items;
				map(items, function(upc, item){
					if(pendingInventory[upc]){
						pendingInventory[upc] = pendingInventory[upc] + item.qty;
					}
					else{
						pendingInventory[upc] = item.qty;
					}
				});
			});
			
			setInventory(_this, db, store, payload, response, createBucketFiles, pendingInventory);
		});
    });

	return null;
};
