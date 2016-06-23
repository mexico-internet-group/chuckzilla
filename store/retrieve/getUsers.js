var getUserClass = function(db, store){
    var userObj = {};

    db.collection('users').find({},{_id:0}).toArray(function(err, docs){
        if(err){console.log(err)}
        else{
            map(docs, function(val, key){
                if(val.mail){
                    store.token[val.mail] = val.token;
                }
                userObj[val.token] = {
					type: val.type,
                    name: val.name,
                    lastName: val.lastName,
                    mail: val.mail,
                    password: val.password,
					cart: val.cart,
                    providerType: val.providerType,
                    favoriteZone: val.favoriteZone
                };
            });
            store.users = userObj;
        }
    });

};

module.exports = getUserClass;
