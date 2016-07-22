module.exports = function(sequelize, DataTypes){
  return sequelize.define('todo', {
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
};
