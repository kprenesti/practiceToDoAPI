var _ = require('underscore');
var bcrypt = require('bcrypt');
var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes){
  var user = sequelize.define('user', {
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
        this.setDataValue('password_hash', hashedPassword);
      } //end set function
    } //end password
  }, //end user object
  {
    beforeValidate: function(user, options){
      if(typeof user.email === 'string'){
        user.email = user.email.toLowerCase();
      }
    }, //end beforeValidate
    classMethods: {
      authenticate: function(body){
        return new Promise(function(resolve, reject){
          //make sure email and password are present and strings.  If not, reject.
          if(typeof body.email !== 'string' || typeof body.password !== 'string'){
            return reject();
          }
          user.findOne({
            where:{email:body.email}
          }).then(function(user){
            if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
              return reject();
            }
            resolve(user);
          }, function(e){
            reject();
          });
        });
      }
    },
    instanceMethods: {
      toPublicJSON: function(){
        var json = this.toJSON();
        return _.pick(json, 'id', 'email', 'username', 'createdAt', 'updatedAt'); //Will not return password, hash, or salt
      },
      generateToken: function(type){
        if(!_.isString(type)){
          return undefined;
        }
        try {
          var stringData = JSON.stringify({id: this.get('id'), type: type});
          var encryptedData = crypto.AES.encrypt(stringData, 'tobyAngel1').toString();
          var token = jwt.sign({
            token: encryptedData
          }, 'tobyAngel1');
          return token;
        } catch (e) {
          res.status(400).json(e);
        }
      } //end toPublicJSON
    } //end instanceMethods
  } //end hooks
); //end define user
return user;
} //end modules.export
