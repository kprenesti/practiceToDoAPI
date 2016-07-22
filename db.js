var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/data/dev-todo-api.sqlite'
});
var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.todo = sequelize.import(__dirname + '/models/todo.js');
module.exports = db;
