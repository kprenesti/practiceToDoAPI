var express = require('express');
var app = express();
var PORT = process.env.PORT || 3030;
var parser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var todos = require('./todos.js');
app.use(parser.json());

var todoNextId = 0;

//========= ADD AN ITEM TO TODOS (POST)====//
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');

    if(!_.isBoolean(body.completed)|| !_.isString(body.description)|| body.description.trim().length === 0){
      return res.status(400).json(e);
    }
    db.todo.create({
      description: body.description,
      completed: body.completed
    }).then(function(todo){
      res.status(200).json(todo);
    });
    // body.id = todoNextId;
    // todos.push(body);
    // todoNextId++;
    // res.json(body);
});

//====== QUERY ITEMS OR GET ALL ITEMS (GET) =========//
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed == 'false') {
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		  filteredTodos = _.filter(filteredTodos, function (todo) {
			     return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
});

// ======== GET INDIVIDUAL ITEM (GET) ========//
app.get('/todos/:id', function(req, res){
  var todoID = parseInt(req.params.id);
  var matching = _.findWhere(todos, {id: todoID});
  if(matching){
    res.json(matching);
  } else {
    res.status(404).send();
  }
});

// ====== DELETE TODOS (DELETE) =======//
app.delete('/todos/:id', function(req, res){
  var todoID = parseInt(req.params.id);
  var unwanted = _.findWhere(todos, {id: todoID});
  if(!unwanted){
    return res.status(404).send('No item with id '+ todoID +' found.');
  }
  var cleanedTodos = _.without(todos, unwanted);
  console.log(cleanedTodos);
  res.json(cleanedTodos);
});

// ==== UPDATE TODOS (PUT) ===========//
app.put('/todos/:id', function(req, res){
  //Establish variables
  var body = _.pick(req.body, 'description', 'completed');
  var todoID = parseInt(req.params.id);
  var itemToUpdate = _.findWhere(todos, {id: todoID});
  var validAtts = {};

  //Check for matching ids
  if(!itemToUpdate){
    return res.status(404).send();
  }

  //Check to make sure data submitted is valid
  if(body.hasOwnProperty('completed')&& _.isBoolean(body.completed)){
    validAtts.completed = body.completed;
  } else if (body.hasOwnProperty(body.completed)){
    res.status(400).send('Bad request.  Try again.');
  }

  if(body.hasOwnProperty('description')&& _.isString(body.description) && body.description.trim().length > 0){
    validAtts.description = body.description;
  } else if (body.hasOwnProperty(body.description)){
    res.status(400).send('Bad request.  Try again.');
  }

  //Update item
  _.extend(itemToUpdate, validAtts);

  //Send response data
  res.json(itemToUpdate);

}); //end put


db.sequelize.sync().then(function(){
  app.listen(PORT, function(){
    console.log('Server started on port '+ PORT);
  }); //end app.listen
}); //end .then
