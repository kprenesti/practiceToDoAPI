var express = require('express');
var app = express();
var PORT = process.env.PORT || 3030;
var parser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
app.use(parser.json());


//========= ADD AN ITEM TO TODOS (POST)====//
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');


    db.todo.create(body).then(function(todo){
      res.status(200).json(todo);
    });
    // body.id = todoNextId;
    // todos.push(body);
    // todoNextId++;
    // res.json(body);
});

//====== QUERY ITEMS OR GET ALL ITEMS (GET) =========//
app.get('/', function(req, res) {
	res.send('Todo List API Root');
});

app.get('/todos', function (req, res) {
	var query = req.query;
  var where = {};
	if (query.hasOwnProperty('completed') && query.completed == 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed == 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q')) {
		  where.description = {
        $like: '%'+query.q+'%'
      };
	}
  db.todo.findAll({where: where}).then(function(todos){
    res.json(todos);
  }, function(e){
    res.status(404).json(e);
  });
});

// ======== GET INDIVIDUAL ITEM (GET) ========//
app.get('/todos/:id', function(req, res){
  var todoID = parseInt(req.params.id, 10);

  db.todo.findById(todoID).then(function(todo){
    res.json(todo);
  }, function(e){
    res.status(404).json(e);
  });
  // var matching = _.findWhere(todos, {id: todoID});
  // if(matching){
  //   res.json(matching);
  // } else {
  //   res.status(404).send();
  // }
});

// ====== DELETE TODOS (DELETE) =======//
app.delete('/todos/:id', function(req, res){
  var todoID = parseInt(req.params.id, 10);
  db.todo.destroy({
    where: {
      id: todoID
    },
    truncate: true
  }).then(function(affectedRows){
    if(affectedRows === 0){
      res.status(404).send();
    } else {
      res.status(204).send('Item successfully deleted.');
    }
  })

  //   return res.status(404).send('No item with id '+ todoID +' found.');
  // }
  // var cleanedTodos = _.without(todos, unwanted);
  // console.log(cleanedTodos);
  // res.json(cleanedTodos);
});

// ==== UPDATE TODOS (PUT) ===========//
app.put('/todos/:id', function(req, res){
  //Establish variables
  var body = _.pick(req.body, 'description', 'completed');
  var todoID = parseInt(req.params.id);
  var atts = {};

  //Check to make sure data submitted is valid
  if(body.hasOwnProperty('completed')){
    atts.completed = body.completed;
  }

  if(body.hasOwnProperty('description')){
    atts.description = body.description;
  }

  db.todo.findById(todoID)
    .then(function(todo){
      if(todo){
        return todo.update(atts).then(function(todo){
          res.json(todo.toJSON());
        }, function(e){
          res.status(400).json(e);
        });
      } else {
        return res.status(404).send();
      }
    }, function(){
      res.status(500).send();
    });

}); //end put

//============ USER FUNCTIONS ============//
app.post('/users', function(req, res){
  var body = _.pick(req.body, 'email', 'password', 'name');
  db.user.create(body).then(function(user){
    res.json(user.toJSON());
  }, function(e){
    res.status(400).json(e);
  });
});

app.post('users/signin', function(req, res){
  var body = _.pick(req.body, 'username', 'password');
  if(_.isString(body.username) && _.isString(body.password)){
    res.toPublicJSON(body);
  }
});


db.sequelize.sync().then(function(){
  app.listen(PORT, function(){
    console.log('Server started on port '+ PORT);
  }); //end app.listen
}); //end .then
