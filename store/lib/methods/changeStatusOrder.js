module.exports = function(_this, db, store, payload, response, createBucketFiles){
  var date = new Date();
  var minute = date.getMinutes();
  var status = 'WAITING_SYSTEM';

  if((minute > 0 && minute < 15) || (minute > 30 && minute < 45)) status = 'PAYMENT_COMPLETE';

  var collection = db.collection('orders');
  collection.findAndModify(
      {tid: payload.tid},
      [],
      {$set:{orderStatus:status}},
      function(err, object){
          response({
              orderSequence: payload.orderSequence,
              socketID: payload.socketID,
              status: status
          });
      }
  );
	return;
};
