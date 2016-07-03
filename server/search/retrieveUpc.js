'use strict';

module.exports = function(req, res, client){
  client.get({
    index: '####.####.####.####',
    type: '####.####.####.####',
    id: req.query.upc
  }, function(error, response){
    if(error) return res.send({error: true});

    res.send(response);
  });
};
