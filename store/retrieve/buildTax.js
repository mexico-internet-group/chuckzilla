var buildTaxClass = function(db, createBucketFiles){
    var collection = db.collection('tax');
    var result = collection.find({},{_id:0}).toArray(function(err,docs){
        constructTax(docs,db);
    });

    var constructTax = function(docs,db){
        var tax = {};
        map(docs,function(val,key){
            if(typeof val.parent === 'undefined' || val.parent === null){
                tax[val.n] = {};
            }
        });
        map(tax,function(val,key){
            map(docs,function(subval,subkey){
                if(subval.parent === key){
                    tax[key][subval.n] = {};
                }
            });
        });
        map(tax,function(val,key){
            map(val,function(subval,subkey){
                map(docs,function(value,index){
                    if(value.parent === subkey){
                        tax[key][subkey][value.n] = null;
                    }
                });
            });
        });
		createBucketFiles.sendString('tax', 'menu', 'tax', JSON.stringify(tax), '100' );
    };
};

module.exports = buildTaxClass;
