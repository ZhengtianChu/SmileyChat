const md5 = require('md5')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const userSchema = require('./userSchema');
const session = require('express-session');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const profileSchema = require('./profileSchema');
const articleSchema = require('./articleSchema');

const mongoose = require('mongoose');
const Users = mongoose.model('User', userSchema);
const Article = mongoose.model('Article', articleSchema);
const Profile = mongoose.model('Profile', profileSchema);
const connectionString = "mongodb+srv://chuzhengtian99:czt990811@comp531.hcfoxm3.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connectionString)

let sessionUser = {};
cookieKey = "sid";
url = "http://127.0.0.1:4200";
// url = "https://smileychat.surge.sh"

function isLoggedIn(req, res, next) {
    if (!req.cookies) {
        return res.status(401).send({result: "require cookies"});
    }

    let sid = req.cookies[cookieKey];
    if (!sid) {
        return res.status(401).send({result: "require sid"});
    }
    let username = sessionUser[sid];

    if (username) {
        req.username = username;
        next();
    } else {
        return res.status(401).send({result: "require username"});
    }
}

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.sendStatus(400);
    }

    Users.find({username: username}).exec(function(err, data) {
        if (data.length == 1) {
            let hash = md5(data[0].salt + password);
            if (hash == data[0].hash) {
                let sessionKey = md5(hash + new Date().getTime + username);
                
                sessionUser[sessionKey] = username;

                cookieKey = "sid";

                res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
            
                return res.status(200).send({username: username, result: "success"});
            } else {
                return res.status(200).send({result: "incorrect username or pwd"});
            }
        } else {
            return res.status(200).send({result: "incorrect username or pwd"});
        }
    })
}

function register(req, res) {
    let username = req.body.username;
    let password = req.body.password; 

    if (!username || !password) {
        return res.sendStatus(400);
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password);

    Users.find({username: username}).exec(function(err, data) {
    
        if (data.length > 0)
            return res.status(200).send({username: username, result: "user exists"})
        else {

            // email validation

            Profile.findOne({email: req.body.email}).exec(function(err, data) {
                if (data) {
                    return res.status(200).send({username: username, result: "email exists"})
                } else {

                    new Users({
                        username: username,
                        salt: salt,
                        hash: hash
                    }).save()
                    new Profile({
                        username: username,
                        email: req.body.email,
                        phoneNum: req.body.phoneNum,
                        headline: "Free",
                        birthday: req.body.birthday,
                        zipcode: req.body.zipcode,
                        avatar: "https://s1.chu0.com/src/img/png/f5/f585c840fdaf4d47a344df75ee34c14a.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:00KSYo4Cz9Msm67tpVJbja5C56k=",
                        followingList: [],
                        auth: []
                    }).save()
        
                    let sessionKey = md5(hash + new Date().getTime + username);
                        
                    sessionUser[sessionKey] = username;

                    cookieKey = "sid";
        
                    res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
                
                    return res.status(200).send({username: username, result: "success"})

                }
            })
        }
    })
}

function logout(req, res) {
    let sid = req.cookies[cookieKey];


    delete sessionUser[sid];

    res.cookie(cookieKey, "", { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});

    res.clearCookie(cookieKey);
    res.status(200).send({result: "OK"});
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '288054613121-g0j0ga64i7ijn5t4ptbtl8fubafsrn17.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    // callbackURL:"https://smileychat.herokuapp.com/auth/google/callback"
},
    function(accessToken, refreshToken, profile, done) {
        let user = {
            'email': profile.emails[0].value,
            'name' : profile.name.givenName + ' ' + profile.name.familyName,
            'id'   : profile.id,
            'token': accessToken,
            'avatar': profile.photos[0].value
        }
       
        return done(null, user);
    })
);

function loginWithGoogle(req, res) {

    if (!req.isAuthenticated()) return res.status(400);

    const user = req.user;
    var username = user.name;

    delete sessionUser['token'];
    res.clearCookie('token');


    Profile.find({}).exec(function(err, data) {
        let flag = false;
        data.forEach(element => {
            if (element['auth']) {
                if (element['auth']['Google'] == username) {
                    let sessionKey = md5(new Date().getTime + username);
                    sessionUser[sessionKey] = element['username'];
                    res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
                    flag = true;

                    cookieKey = "sid";
                    return res.redirect(url + '/#/main');
                }
            }
        }); 

        if (flag == false) {
            Profile.findOne({email: user.email}).exec(function(err, data) {
                if (!data) {
        
                    // if the username already exists, prevent conflicts
                    Profile.findOne({username: username}).exec(function(err, data){
               
                        if (data) {
                            username = username + '_' + user.token.slice(0,10);
                        }
                      
                        new Users({
                            username: username,
                            auth: "Google"
                        }).save()
                        new Profile({
                            username: username,
                            headline: 'Free',
                            followingList:[],
                            email: user.email,
                            zipcode: 10000,
                            birthday: new Date().getTime(),
                            avatar: user.avatar,
                            phoneNum: "000-000-0000"
                        }).save()

                        let sessionKey = user.token;

                        cookieKey = "token";
                        sessionUser[sessionKey] = username;
                        res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
                        return res.redirect(url + '/#/main');
                    })    
                } else {
                    // email already exist, login with this email
                    
                    // link google account to the user

        
                    let username = data.username;
                    if (username == user.name) {
                        let sessionKey = user.token;
                        sessionUser[sessionKey] = username;
                        cookieKey = "token";
                        res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
                        return res.redirect(url + '/#/main');
    
                    } else {
                        Profile.updateOne({email: user.email}, {$set:{auth: {Google: req.user.name}}}, function(err, data) {
                        
                            let sessionKey = md5(new Date().getTime + username);
                            sessionUser[sessionKey] = username;
                            cookieKey = "sid";
                            res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
                            return res.redirect(url + '/#/main');
        
                        })     
                    }
                }
            })
        }
       
    })

}

function linkAccount(req, res){
    let sid = req.cookies['sid'];
    let token = req.cookies['token'];

    

    let mainAccount = sessionUser[sid];
    let linkedAccount = sessionUser[token];

    console.log(sessionUser[sid])
    console.log(sessionUser[token])

    if (sid != "" && token != "" &&  mainAccount && linkedAccount ) {
        Profile.findOne({username: mainAccount}).exec(function(err, data) {
            var followingList = data["followingList"];

        
            Profile.findOne({username: linkedAccount}).exec(function(err, data2) {
                var newList = followingList.concat(data2.followingList);
                let newSet = new Set(newList);
                newList = Array.from(newSet);
                newList = newList.filter(function(v) {
                    return v != mainAccount;
                })
    
                // merge following
                Profile.updateOne({username: mainAccount}, {$set: {auth: {Google: linkedAccount}, followingList: newList} }, function(err, data) {
    
                })
    
                // update posts
                

                Article.updateMany({author: linkedAccount}, {$set: {author: mainAccount}}, function(err, data) {
    
                })

                // update comments
                Article.find({}).exec(function(err, data) {
                    for (var i = 0; i < data.length; i++) {
                        var com = data[i]['comments'];
                        for (var j = 0; j < com.length; j++ ) {
                            console.log(com[j]['author'])
                            if (com[j]['author'] == linkedAccount) {
                                let newcomment = {
                                    author: mainAccount,
                                    text: com[j].text,
                                    date: com[j].date
                                }

                                com[j] = newcomment;
                                Article.updateOne({pid: data[i].pid}, {$set: {comments: com}}, function(err, data){

                                })
                            }
                        }   
                    }
                })

                // delete
                Profile.deleteOne({username: linkedAccount}, function(err, data) {

                })

                Users.deleteOne({username: linkedAccount}, function(err, data) {
                    
                })
          
                delete sessionUser['token'];
                res.cookie("token", "", { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
                res.clearCookie('token');
                cookieKey = "sid";       
                return res.status(200).send({result: "success", username1: mainAccount, username2: linkedAccount});
               
            })
          
        })
    } else {
        return res.status(200).send({result: "lack account"});
    }
}

function deleteAuth(req, res) {
    Profile.updateOne({username: req.username}, {$set:{auth: {}}}, function(err, data) {
        
        delete sessionUser['token'];

        res.cookie("token", "", { maxAge: 3600*1000, httpOnly: true, sameSite: 'None', secure: true});
        res.clearCookie('token');
        cookieKey = "sid";       

  
        Profile.findOne({username: req.username}).exec(function(err, data) {
            // console.log(data.auth)
            res.status(200).send({username: data.username, auth: data.auth})
        })

    })
}

module.exports = (app) => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    
    app.post('/login', login);
    app.post('/register', register);

    app.use(session({
        secret: 'doNotGuessTheSecret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/loginWithGoogle', failureRedirect: '/' }));
    app.get('/loginWithGoogle', loginWithGoogle)
    app.get('/linkAccount', linkAccount)

    app.use(isLoggedIn);
    app.delete('/google',deleteAuth)
    app.put('/logout', logout);
}