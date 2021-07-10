"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var mongoURI = 'mongodb+srv://Kd-test:kshitij-1@cluster0.lhual.mongodb.net/demoDB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('database connection established!');
  }
}); //defining our schema 

var userSchema = new Schema({
  fname: String,
  mname: String,
  lname: String,
  email: String,
  passwd: String,
  mobile: String,
  address: String,
  education: String,
  dob: Date,
  pin: Number,
  place: String,
  state: String,
  country: String,
  resume: {
    data: Buffer,
    contentType: String
  }
});
var UserModel = new mongoose.model('UserModel', userSchema); //model

var addToDb = function addToDb(obj, cb) {
  var user = new UserModel(obj);
  user.save(function (err, result) {
    console.log('from dbUtils : ' + err);
    console.log('from dbUtils : ' + result);

    if (err) {
      cb(err, result); //result as empty
    } else {
      cb(err, result); //err as null
    }
  });
};

var findInDb = function findInDb(queryObj, cb) {
  UserModel.find(queryObj, function (err, data) {
    if (err) {
      cb(err, data); //data as null
    } else {
      cb(err, data); //err as null
    }
  });
};

module.exports = {
  addToDb: addToDb,
  findInDb: findInDb
};