const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const profileSchema = require('./profileSchema');
const Profile = mongoose.model('Profile', profileSchema);
const connectionString = "mongodb+srv://chuzhengtian99:czt990811@comp531.hcfoxm3.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connectionString);

function getFollowing(req, res) {
    let username = req.params.user ? req.params.user : req.username;

    Profile.findOne({username: username}).exec(function(err, data) {
        if (data)
            res.status(200).send({username: data.username, followingList: data.followingList});
        else res.status(400).send({result: "user doesn't exist"});
    })
}

function addFollowing(req, res) {
 
    Profile.findOne({username: req.params.user}).exec(function(err, data) {

        if (data) {
            Profile.updateOne({username: req.username}, {$push: {followingList: req.params.user}}, function(err, data) {
               
                Profile.findOne({username: req.username}).exec(function(err, data){
                   
                    return res.status(200).send({username: data.username, followingList: data.followingList});
                })
           
            });
        } else {
            return res.status(200).send({result: "User does not exist!"});
        }
        
    })
}

function removeFollowing(req, res) {
    Profile.findOne({username: req.username}).exec(function(err, data){
        let list = data.followingList;
        const index = list.indexOf(req.params.user);
        if (index > -1) list.splice(index, 1);

        Profile.updateOne({username: req.username}, {$set: {followingList: list}}, function(err, data){

            Profile.findOne({username: req.username}).exec(function(err, data){       
                return res.status(200).send({username: data.username, followingList: data.followingList});
            })
        })
    })
}


module.exports = (app) => {
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.get('/following/:user?', getFollowing);
    app.put('/following/:user', addFollowing);
    app.delete('/following/:user', removeFollowing);
}