var getPassword = function(mail, store){
	if(!mail) return null;
	var token = store.token[mail];
	
	if(!token) return null;
	var user = store.users[token];
	
	if(!user) return null;
	
	if(user.password) return user.password;
	
	return null;
};

module.exports = function(db, store, payload, response){
	var password = getPassword(payload.mail, store);
	response({p: password, m: payload.mail});
};