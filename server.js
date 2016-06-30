var express = require('express');
var app = express();
var PORT = process.env.PORT || 3030;
var parser = require('body-parser');
var todos = require('./todos.js');
app.use(parser.json());

var todoNextId = 0;

app.post('/todos', function(req, res){
    var body = req.body;
    body.id = todoNextId;
    todos.push(body);
    todoNextId++;
    res.json(body);
});



app.get('/', function(req, res){
  res.send('Todo API Root');
});

app.get('/todos', function(req, res){
  res.json(todos);
});

app.get('/todos/:id', function(req, res){
  var todoID = parseInt(req.params.id);
  var matching;
  todos.forEach(function(item){
    if(item.id === todoID){
      matching = item;
    }
  }); //end forEach

  if(matching){
    res.json(matching);
  } else {
    res.status(404).send();
  }
});

app.listen(PORT, function(){
  console.log('Server started on port '+ PORT);
});
