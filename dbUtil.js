const mongoose = require('mongoose');
const { Schema } = mongoose;

const mongoURI = 'mongodb+srv://Kd-test:kshitij-1@cluster0.lhual.mongodb.net/demoDB?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('database connection established!');
    }
});
//defining our schema 
const userSchema = new Schema({
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
})

const UserModel = new mongoose.model('UserModel', userSchema); //model

const addToDb = (obj, cb) => {
    let user = new UserModel(obj);
    user.save((err, result) => {
        console.log('from dbUtils : ' + err);
        console.log('from dbUtils : ' + result);
        if (err) {
            cb(err, result);  //result as empty
        } else {
            cb(err, result); //err as null
        }
    })

}

const findInDb = (queryObj, cb) => {
    UserModel.find(queryObj, (err, data) => {
        if (err) {
            cb(err, data); //data as null
        } else {
            cb(err, data); //err as null
        }
    })
}

module.exports = {
    addToDb : addToDb, 
    findInDb : findInDb
}