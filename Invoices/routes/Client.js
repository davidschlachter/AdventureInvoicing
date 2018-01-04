var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/Invoices', ['clients']);

// Get All Clients
router.get('/Clients', function(req, res, next){
  db.Clients.find(function(err, clients){
    if(err){
      res.send(err);
    }
    res.json(clients);
  });
});

// Get Single client
router.get('/Client/:id', function(req, res, next){
  db.Clients.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, client){
    if(err){
      res.send(err);
    }
    res.json(client);
  });
});

//Save client
router.post('/new', function(req, res, next){
  var client = req.body;
  if(!client.name){
    res.status(400);
    res.json({
      "error": "Bad Data"
    });
  } else {
    db.Clients.save(client, function(err, todo){
      if(err){
        res.send(err);
      }
      res.json(client);
    });
  }
});

// Delete Client
router.delete('/client/:id', function(req, res, next){
  db.Clients.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, client){
    if(err){
      res.send(err);
    }
    res.json(client);
  });
});

// Update client
router.put('/client/:id', function(req, res, next){
  var client = req.body;
  var updclient = {};

  updclient = client;
  delete updclient._id;

  if(!updclient){
    res.status(400);
    res.json({
      "error":"Bad Data"
    });
  } else {
    //client._id = mongojs.ObjectId(client._id);
    db.Clients.update({_id: mongojs.ObjectId(req.params.id)}, updclient, {}, function(err, client){
      if(err){
        res.status(400);
        res.send(err);
      }
      res.json(client);
    });
  }
});

module.exports = router;