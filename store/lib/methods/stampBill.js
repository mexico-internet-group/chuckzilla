module.exports = function(_this, db, store, payload, response, createBucketFiles){
  var collection = db.collection('orders');
  collection.findAndModify(
      {tid: payload.tid},
      [],
      {
        $set:{
          billStamp:true,
          billNumber: payload.billNumber
        }
      },
      function(err, object){
          response({
              billNumber: payload.billNumber,
              socketID: payload.socketID
          });
      }
  );
	return;
};
