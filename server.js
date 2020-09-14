const express = require('express');
const CronJob = require('cron').CronJob;
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const _ = require('lodash')
const { mongoose } = require('./server/db/mongoose');

const { User } = require('./server/models/user'); //Requiring User model
var { authenticate } = require('./server/middleware/authenticate');
// const fs = require('fs');

// const port = process.env || 3000;
const port = 3000;

var day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const app = express();

app.set('view-engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public/fonts')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.render('login.ejs');
});


app.get('/register', (req, res) => {
    res.render('register.ejs');
});

//Registering users
app.post('/register', (req, res) => {
    const { email, password, rePassword } = req.body;
    let errors = [];

    if (!email || !password || !rePassword) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != rePassword) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register.ejs', {
            errors,
            email,
            password,
            rePassword
        });
    } else {
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push({ msg: 'Email already exists' });
                res.render('register.ejs', {
                    errors,
                    email,
                    password,
                    rePassword
                });
            } else {
                var body = _.pick(req.body, ['email', 'password']); //Picking email and password from the request

                var user = new User(body); //New instance of user
                //body already has email and password keys, so passed directly
                user.save().then(() => { //Saving the user in the database
                    return user.generateAuthToken();
                }).then((token) => {
                    // res.header('x-auth', token).send('You are registered'); //token sent back as header
                    res.header('x-auth', token).redirect('/login');
                }).catch((err) => {
                    console.log('Some kind of error');
                    res.status(400).send('Registration error');
                });
            }
        });
    }
});

//Logging in users
app.post('/login', (req, res) => { //send email an password in the request

    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => { //verifying user with these credentials exists

        user.generateAuthToken().then((token) => { //generate token for user who logged in
            // res.header('x-auth', token).send('You are logged in'); //send token back in a header
            res.header('x-auth', token).redirect('/'+token);
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).send('Login error');
    });
})

app.get('/', (req,res)=>{
  res.send('Please sign up or login to view the home page')
})

app.get('/:token',authenticate, (req, res) => {
    res.render('home.ejs');
});

<<<<<<< HEAD
app.post('/', (req, res) => {
    var routine = [
        req.body.subjectName0,
        req.body.subjectName1,
        req.body.subjectName2,
        req.body.subjectName3,
        req.body.subjectName4,
    ]

    var startTime = [
        req.body.subjectStartTime0,
        req.body.subjectStartTime1,
        req.body.subjectStartTime2,
        req.body.subjectStartTime3,
        req.body.subjectStartTime4
    ]
=======
app.post('/:token',authenticate, (req, res) => {
    var routine = {
        monday: req.body.subjectName0,
        tuesday: req.body.subjectName1,
        wednesday: req.body.subjectName2,
        thursday: req.body.subjectName3,
        friday: req.body.subjectName4,
    }

    var links = {
        monday: req.body.subjectStartTime0,
        tuesday: req.body.subjectStartTime1,
        wednesday: req.body.subjectStartTime2,
        thursday: req.body.subjectStartTime3,
        friday: req.body.subjectStartTime4
    }
>>>>>>> 224a8d9c7fd8baca46cd6830153dc85c65eea9a8

    var meetSubjects = req.body.subjectNameSelection;
    var meetLinks = req.body.subjectMeetLinkInput;

    // console.log(routine, '\n', startTime);
    // console.log(meetSubjects, meetLinks);

    console.log(day);

    res.render('savedRoutine.ejs', {
        day: day,
        routine: routine,
        startTime: startTime,
        meetSubjects: meetSubjects,
        meetLinks: meetLinks
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));