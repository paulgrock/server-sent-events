'use strict';
/*
 * GET users listing.
 */
var connections = [],
    history = [],
    lastMessageId = 0,
    totalRequests = 0;
var removeConnection = function(res){
  console.log('removed ');
  var index = connections.indexOf(res);
  if(index !== -1){
    connections.splice(index, 1);
  }
};

var broadcast = function(name){
  var message = {
    "id": "12345",
    "participants": [
      {
        "name": "Stephano",
        "score": "2"
      },
      {
        "name": "RoRo",
        "score": "1"
      }
    ]
  };
  console.log(message);
  message = JSON.stringify(message);
  lastMessageId += 1;
  console.log('broadcast to %d connections', connections.length);
  connections.forEach(function(res){
    sendSSE(res, name, message);
  });
};

var sendSSE = function(res, name, message){
  var data = '';
  data += 'event: update' + '\n';
  data += 'id: ' + lastMessageId + '\n';
  data += 'data: ' + message;
  data += '\n\n';
  res.write(data);
};

exports.index = function(req, res){
  if(req.accepts('text/event-stream')){
    res.header({
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive'
    });
    if(req.xhr) {
      res.xhr = null;
    }

    connections.push(res);
    req.on('close', removeConnection);

    setInterval(function(){
      broadcast('event');
    }, 5000);
  } else {
    res.send(200, 'foo');
  }
};
