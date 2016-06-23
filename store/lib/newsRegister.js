module.exports = function(db, store, payload, response){
	if( typeof store.token[payload.mail] === 'undefined' ){
		var date = new Date();
		var collection = db.collection('newsletter');

    collection.insert(
      {
        name: payload.name,
        mail: payload.mail,
        token: payload.token,
        ipuser: payload.ipuser,
        date: date,
        fingerprint: payload.fingerprint
      },
      function(){}
    );
	}
  response({auth: 1});
	return;
};
