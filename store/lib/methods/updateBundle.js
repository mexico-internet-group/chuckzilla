var exec = require('child_process').exec;
var request = require('request');

module.exports = function(_this, db, store, payload, response, createBucketFiles, searchItem, nImages){

    var collection = db.collection('inventory');
    var bundle = searchItem;

    if(nImages) bundle.numberOfImages = nImages;

    var childrenArray = [];
    if(bundle.children.trim() !== ''){
        var p = [];
        childrenArray = bundle.children.split(',');
        childrenArray = map(childrenArray, function(val, key){
            p.push(bundle._id);
            return val.trim();
        });
        store.products[val].parent = p;
    }
    bundle.children = childrenArray;

    collection.find(
        {_id:
            {
                $in: childrenArray
            }
        },
        {
            carted: 0
        }
    ).toArray(function(error, docs){
        var sum = 0;
        var sumCost = 0;
        var flag = 0;
        var min = 0;
        var chars = [];
        var dataChilds = [];
        var input = searchItem.displayName.split(" ");
        input.push(searchItem.displayName);

        if(docs !== null){
            map(docs, function(val, key){
                sumCost = sumCost + val.cost;
                delete val.cost;

                dataChilds.push(val);

                if(flag === 0){
                    min = val.onHandInventory;
                    flag++;
                }else{
                    if(val.onHandInventory < min) min = val.onHandInventory;
                }
                sum = sum + val.weight;

                map(val.char, function(val, key){
                    chars.push(val);
                });
            });
        }

        delete bundle.location;
        delete bundle.description;
        delete bundle.cost;

        bundle.weight = sum;
        bundle.onHandInventory = min;
        bundle.char = chars;
        bundle.dataChilds = dataChilds;
        bundle.height = 0;
        bundle.width = 0;
        bundle.deep = 0;
        bundle.suggest = {
            input : input,
            output : bundle.displayName,
            payload : { productId : bundle._id },
            weight : sum
        };

        //Memoria
        if(typeof store.products[bundle._id] === 'undefined'){
            exec('insert ' + searchItem._id + ' ' + "'" + JSON.stringify(bundle) + "'" , function (e, stdout, stderr) {  });

            store.products[bundle._id] = {
                char:{
                    department: bundle.department,
                    family: bundle.family,
                    line: bundle.line,
                    price: bundle.price,
                    displayName: bundle.displayName,
                    weight: bundle.weight
                },
                onHandInventory: bundle.onHandInventory,
                children: childrenArray,
                carted: {}
            }
        }else{
            var item = store.products[bundle._id];
            item.char.department = bundle.department;
            item.char.family = bundle.family;
            item.char.line = bundle.line;
            item.char.price = bundle.price;
            item.char.displayName = bundle.displayName;
            item.char.weight = bundle.weight;
            item.onHandInventory = bundle.onHandInventory;
        }

        //Buscador
        global.searchEngine.update({
            index: 'dgl',
            type: 'product',
            id: bundle._id,
            body: {
                doc: {
                  available: bundle.available,
                  height: bundle.height,
                  width: bundle.width,
                  deep: bundle.deep,
                  weight: bundle.weight,
                  department: bundle.department,
                  family: bundle.family,
                  line: bundle.line,
                  price: bundle.price,
                  cost: bundle.cost,
                  previousPrice: bundle.previousPrice,
                  displayName: bundle.displayName,
                  initialRating: bundle.initialRating,
                  freeShipping: bundle.freeShipping,
                  msi: bundle.msi,
                  isBundle: bundle.isBundle,
                  isDynamicParent: bundle.isDynamicParent,
                  isDynamicChild: bundle.isDynamicChild,
                  char: bundle.char,
                  dynamicChar: bundle.dynamicChar,
                  discountTypeA: bundle.discountTypeA,
                  discountTypeB: bundle.discountTypeB,
                  discountTypeC: bundle.discountTypeC,
                  inComing: bundle.inComing,
                  numberOfImages: bundle.numberOfImages,
                  children: bundle.children,
                  onHandInventory: bundle.onHandInventory,
                  dataChilds: bundle.dataChilds,
                  metaTitle: bundle.metaTitle,
            			metaDescription: bundle.metaDescription,
            			keywords: bundle.keywords
                }
            }
        },
        function(e, r){}
        );

        //Consola
        delete bundle.suggest;
        createBucketFiles.sendString('products', bundle._id, 'product', JSON.stringify(bundle), '10' );

        bundle.cost = sumCost;
        //Base de datos
        collection.findAndModify(
            {_id: bundle._id},
            [],
            {$set: bundle},
            {upsert: true, "new": true},
            function(err, object){
              if(err){
                console.log(err);
              }else{
                response({
                    route: payload.route,
                    isHTTP: payload.isHTTP,
                    socketID: payload.socketID
                });
              }
            }
        );
    });
};
