const express = require('express');
const path = require('path');
const redis = require('redis');
const port = process.env.PORT||3000;
let client = redis.createClient();

client.on('connect', function(){
  console.log('Connected to Redis...');
});

const app = express();
app.set('view engine', 'hbs');

app.get('/', function(req, res, next){
  res.render('searchusers');
});

// Search processing
app.post('/user/search', function(req, res, next){
  let id = req.body.id;

  client.hgetall(id, function(err, obj){
    if(!obj){
      res.render('searchusers', {
        error: 'User does not exist'
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj
      });
    }
  });
});

app.get('/user/add', function(req, res, next){
  res.render('adduser');
});

app.post('/user/add', function(req, res, next){
  let id = req.body.id;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let phone = req.body.phone;

  client.hmset(id, [
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone
  ], function(err, reply){
    if(err){
      console.log(err);
    }
    console.log(reply);
    res.redirect('/');
  });
});


app.delete('/user/delete/:id', function(req, res, next){
  client.del(req.params.id);
  res.redirect('/');
});

app.listen(port, function(){
  console.log('Server started on port '+port);
});