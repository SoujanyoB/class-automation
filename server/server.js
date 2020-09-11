const express = require('express');
const CronJob = require('cron').CronJob;
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const _= require('lodash')
const {mongoose} = require('./db/mongoose');

const {User} = require('./models/user');        //Requiring User model
var {authenticate}=require('./middleware/authenticate');
// const fs = require('fs');

// const port = process.env || 3000;
const port = 3000;

const app = express();

app.set('view-engine', ejs);

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public/fonts')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/login', (req, res) => {
    res.render('login.ejs');
});


app.get('/register', (req, res) => {
    res.render('register.ejs');
});

//Registering users
app.post('/register',(req,res)=>{

    var body= _.pick(req.body,['email','password']);                    //Picking email and password from the request

    var user= new User(body);                                           //New instance of user
                                                                        //body already has email and password keys, so passed directly
    user.save().then(() => {                                            //Saving the user in the database
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send('You are registered');                          //token sent back as header
    }).catch((err) => {
        console.log(err);
        res.status(400).send('Registration error');
    });



})

 //Logging in users
 app.post('/login',(req,res)=>{                                    //send email an password in the request

    var body=_.pick(req.body,['email','password']);
    
    User.findByCredentials(body.email,body.password).then((user) => {   //verifying user with these credentials exists
        
        user.generateAuthToken().then((token) => {                      //generate token for user who logged in
            res.header('x-auth',token).send('You are logged in');                      //send token back in a header
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).send('Login error');
    }); 
})

app.listen(port, () => console.log(`Listening on port ${port}`));
