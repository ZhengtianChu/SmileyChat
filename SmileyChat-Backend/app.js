const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = {
    origin: "http://127.0.0.1:4200",
    // origin: "https://smileychat.surge.sh",
    credentials: true
};
const auth = require("./src/auth")
const mongoose = require('mongoose');
const userSchema = require('./src/userSchema');
const User = mongoose.model('User', userSchema);
const bodyParser = require('body-parser');
const articles = require("./src/articles");
const profile = require("./src/profile");
const following = require("./src/following");
const connectionString = "mongodb+srv://chuzhengtian99:czt990811@comp531.hcfoxm3.mongodb.net/?retryWrites=true&w=majority";

const addUser = (req, res) => {
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

        let newUser = await (connector.then(()=> {
            return new User({username:req.params.uname, created:Date.now()}).save();
        }));
        res.send({name: newUser.username});
    })();

};

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));

app.get('', (req, res) =>{
    res.send("hello");
});

app.post('/users/:uname', addUser);

auth(app);
articles(app);
profile(app);
following(app);


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
});