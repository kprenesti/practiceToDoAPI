var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/sqlite-db.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

sequelize.sync()
.then(function(todo){
  return Todo.create(
    {description: 'Walk my dogs',
    completed: false
  })//end create
}).then(function(todo){
    return Todo.create({
      description: 'Learn Node',
      completed: false
    })//end create
  }).then(function(todos){
    return Todo.findAll({
      where: {
        description : {
          $like: '%dog%'
        }
      }
    });
  }).then(function(todos){
    if(todos){
      todos.forEach(function(todo){
        console.log(todo.toJSON());
      });
    }else{
      console.log('No todos found');
    }
  }).catch(function(e){
  console.log(e);
});
