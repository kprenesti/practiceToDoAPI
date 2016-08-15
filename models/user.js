var _ = require('underscore');
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes){
  return sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    }, //end email
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 25]
      }
    }, //end username
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
      validate: {
        isAlpha: true,
        len: [2, 25]
      }
    }
    salt: {
      type: DataTypes.STRING
    }, //end salt
    password_hash: {
      type: DataTypes.STRING
    }, //end hash
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [6, 20]
      },
      set: function(value){
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', password_hash);
      } //end set function
    } //end password
  }, //end user object
  {
    beforeValidate: function(user, options){
      if(typeof user.email === 'string'){
        user.email = user.email.toLowerCase();
      }
    }, //end beforeValidate
    instanceMethods: {
      toPublicJSON: function(){
        var json = this.toJSON();
        return _.pick(json, 'id', 'email', 'name', 'createdAt', 'updatedAt'); //Will not return password, hash, or salt
      } //end toPublicJSON
    } //end instanceMethods
  } //end hooks
); //end define user
} //end modules.export
