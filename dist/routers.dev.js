"use strict";

//all routers are present in this file 
var express = require('express');

var router = express.Router();

var bodyParser = require('body-parser');

var fastTwoSms = require('fast-two-sms');

var multer = require('multer');

var path = require('path');

var fs = require('fs');

var session = require('express-session');

var addToDb = require('./dbUtil');

var dbUtils = require('./dbUtil');

var _require = require('express'),
    query = _require.query; //set up the body parser -> 


router.use(bodyParser.urlencoded('extended : false'));
router.use(bodyParser.json()); //let our router use express-session 

router.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); //set up multer --> 

var options = {
  storage: multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, './uploads');
    },
    filename: function filename(req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  // fileFilter: (req, file, cb) => {
  //     if (path.extname(file.originalname) === '.pdf') {
  //         return cb(null, true);
  //     }
  //     cb(new Error("only .pdf files are allowed."));
  // },
  limits: {
    fileSize: 2 * Math.pow(10, 6) //2 MB max size 

  }
};
var upload = multer(options).single('resumeFile'); //upload.single('resumeFile')
//------------------now define routes here ------------------

router.post('/sendOTP', function (req, res) {
  console.log(req.body);
  var otp = Math.floor(100000 + Math.random() * 900000); // res.send({isSent : true, otp : otp}); 

  var mobile = req.body.mobile; //mobile number

  var options = {
    authorization: "xEcd3Gr48XWZj17PbSVmoA5psOyNRqLa06wF9fzUBhQkJItCn2rb4OAE5R93LDUSKXBHQlndptg7Ie0m",
    message: otp,
    numbers: [mobile]
  };
  fastTwoSms.sendMessage(options).then(function (response) {
    console.log(response);
    res.send({
      isSent: true,
      otp: otp
    });
  });
});
router.post('/submit', function (req, res) {
  //req.file - file uploaded 
  //req.body - other text fields data (form)
  var statusObj; //status of file uploading

  var rb;
  upload(req, res, function (err) {
    rb = req.body;

    if (err) {
      //multer error
      if (err.code == 'LIMIT_FILE_SIZE') {
        err.message = "file is larger than allowed size.";
        err.success = false;
      }

      statusObj = err;
    } else {
      console.log(req.file);

      if (!req.file) {
        res.status(500);
        return res.json('file not found!');
      }

      statusObj = {
        success: true,
        message: 'File uploaded successfully'
      };
    } // now we need to store this data to database. 


    var obj = {
      fname: rb.fname,
      mname: rb.mname,
      lname: rb.lname,
      email: rb.email,
      passwd: rb.passwd,
      mobile: rb.mobile,
      address: rb.address,
      education: rb.edu,
      dob: rb.dob,
      pin: rb.pin,
      place: rb.place,
      state: rb.state,
      country: rb.country,
      resume: {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.originalname)),
        contentType: 'file'
      }
    };
    dbUtils.addToDb(obj, function (err, result) {
      if (err) {
        res.render('err', {
          message: 'a database error occured!'
        });
      } else {
        if (result.length === 0) {
          //item array is empty => not uploaded to db 
          res.status(500);
          return res.render('err', {
            message: 'a database error occured! please try after some time.'
          });
        } //uploaded to db ===> user registration successfull


        res.status(200);
        res.render('msg.pug');
      }
    });
  });
});
router.post('/login', function (req, res) {
  console.log(req.body);
  var queryObj = {
    email: req.body.email,
    passwd: req.body.password
  };

  if (queryObj.email && queryObj.passwd) {
    dbUtils.findInDb(queryObj, function (err, data) {
      if (err) {
        error = {
          message: 'a database error occured!'
        };
        res.render('err', error);
      } else {
        if (data[0]) {
          console.log(data);
          req.session.loggedin = true;
          req.session.username = data[0].fname + ' ' + data[0].lname;
          res.redirect('/user/profile');
        } else {
          var _error = {
            message: 'email or password is incorrect! try again.'
          };
          res.render('err', _error);
        }
      }
    });
  }
});
router.get('/profile', function (req, res) {
  if (req.session.loggedin) {
    // res.send('Welcome back, ' + req.session.username + '!');
    var auth = {
      loggedin: true,
      username: req.session.username
    };
    res.render('profile', auth);
  } else {
    var _auth = {
      loggedin: false,
      username: undefined
    };
    res.render('profile', _auth);
  }

  res.end();
});
router.get('/logout', function (req, res) {
  if (req.session.loggedin) {
    req.session.destroy(function (err) {
      if (err) {
        var _error2 = "sorry, we can't log you out!";
        res.render('err', _error2);
      } else {
        //logged out successfully
        res.redirect('/'); //home
      }
    });
  } else {
    res.redirect('/'); //home, user already logged out!
  }
});
module.exports = router;