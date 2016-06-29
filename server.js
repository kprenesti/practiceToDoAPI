var express = require('express');
var app = express();
var PORT = process.env.PORT || 3030;
var todos = require('./todos.js');

app.get('/', function(req, res){
  res.send('Todo API Root');
});

app.get('/todos', function(req, res){
  res.json(todos);
});

app.listen(PORT, function(){
  console.log('Server started on port '+ PORT);
});
