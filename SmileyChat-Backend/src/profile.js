const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const md5 = require('md5');
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('Profile', profileSchema);
const userSchema = require('./userSchema');
const uploadImage = require('./uploadCloudinary');
const Users = mongoose.model('User', userSchema);
const connectionString = "mongodb+srv://chuzhengtian99:czt990811@comp531.hcfoxm3.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connectionString)

function getHeadline(req, res) {
    let username = req.params.user ? req.params.user : req.username;

    Profile.findOne({username: username}).exec(function(err, data) {
        if (data) res.status(200).send({username: username, headline: data.headline});
        else res.status(400).send({result: "user doesn't exist"});
    })
}

function updateHeadline(req, res) {
    Profile.updateOne({username: req.username}, {$set:{headline: req.body.headline}}, function(err, data) {
        res.status(200).send({username: req.username, headline: req.body.headline})
    })
}

function getEmail(req, res) {
    let username = req.params.user ? req.params.user : req.username;

    Profile.findOne({username: username}).exec(function(err, data) {
        if (data)
            res.status(200).send({username:username, email: data.email});
        else {
            res.status(400).send({result: "user doesn't exist"});
        }
    })
}

function updateEmail(req, res) {
    Profile.updateOne({username: req.username}, {$set:{email: req.body.email}}, function(err, data) {
        res.status(200).send({username: req.username, email: req.body.email})
    })
}

function getZipcode(req, res) {
    let username = req.params.user ? req.params.user : req.username;

    Profile.findOne({username: username}).exec(function(err, data) {
        if (data)
            res.status(200).send({username: username, zipcode: data.zipcode});
        else {
            res.status(400).send({result: "user doesn't exist"});
        }
    })

}

function updateZipcode(req, res) {
    Profile.updateOne({username: req.username}, {$set:{zipcode: req.body.zipcode}}, function(err, data) {
        res.status(200).send({username: req.username, zipcode: req.body.zipcode})
    })
}

function getBirthday(req, res) {
    let username = req.params.user ? req.params.user : req.username;

    Profile.findOne({username: username}).exec(function(err, data) {
        if (data) res.status(200).send({username: username, birthday: data.birthday});
        else res.status(400).send({result: "user doesn't exist"});
    })
   

}

function getAvatar(req, res) {
    let user = req.params.user == null ? req.username : req.params.user;

    Profile.findOne({username: user}).exec(function(err, data) {
        if (data)
            res.status(200).send({username: user, avatar: data.avatar});
        else {
            res.status(400).send({result: "user doesn't exist"});
        }
    })
}

function updateAvatar(req, res) {
    Profile.updateOne({username: req.username}, {$set:{avatar: req.fileurl}}, function(err, data){
        res.status(200).send({username: req.username, avatar: data.avatar});
    })
}

function updatePassword(req, res) {
    let salt = req.username + new Date().getTime();
    let hash = md5(salt + req.body.password);
    Users.updateOne({username: req.username}, {$set:{salt: salt, hash: hash}}, function(err, data) {
        res.status(200).send({username: req.username, result: "success"})
    })
}

function getUsername(req, res) {
    res.status(200).send({username: req.username});
}

function getPhoneNum(req, res) {
    let username = req.params.user ? req.params.user : req.username;

    Profile.findOne({username: username}).exec(function(err, data) {
        if (data) res.status(200).send({username: username, phoneNum: data.phoneNum});
        else  res.status(400).send({result: "user doesn't exist"});
    })
}

function updatePhoneNum(req, res) {
    Profile.updateOne({username: req.username}, {$set:{phoneNum: req.body.phoneNum}}, function(err, data) {
        res.status(200).send({username: req.username, phoneNum: req.body.phoneNum})
    })
}

function getAuth(req, res) {
    let username = req.params.user ? req.params.user : req.username;

    Profile.findOne({username: username}).exec(function(err, data) {
        if (data) {
            res.status(200).send({username: username, auth: data.auth});
             
        } 
        else res.status(400).send({result: "user doesn't exist"});
    })
}




module.exports = (app) => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.get('/headline/:user?', getHeadline);
    app.put('/headline', updateHeadline);
    app.get('/email/:user?', getEmail);
    app.put('/email', updateEmail);
    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', updateZipcode);
    app.get('/dob/:user?', getBirthday);
    app.get('/avatar/:user?', getAvatar);
    app.put('/avatar', uploadImage('avatar'), updateAvatar);
    app.put('/password', updatePassword);
    app.get('/username', getUsername);
    app.get('/phoneNum/:user?', getPhoneNum);
    app.put('/phoneNum', updatePhoneNum);
    app.get('/google/:user?', getAuth);

}