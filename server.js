const express = require('express');
const CronJob = require('cron').CronJob;
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const _ = require('lodash')
const { mongoose } = require('./server/db/mongoose');

const { User } = require('./server/models/user'); //Requiring User model
const { Routine } = require('./server/models/routine')
var { authenticate } = require('./server/middleware/authenticate');
const { string } = require('yargs');
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
    let error;
    if (!body.email || !body.password) {
        error = 'Enter a valid email and password!';
    }


    if (error) {
        res.render('login.ejs', { error: error });
    } else {
        User.findByCredentials(body.email, body.password).then((user) => { //verifying user with these credentials exists

            user.generateAuthToken().then((token) => { //generate token for user who logged in
                // res.header('x-auth', token).send('You are logged in'); //send token back in a header
                res.header('x-auth', token).redirect('/' + token);
            })
        }).catch((err) => {
            res.render('login.ejs', { error: err });
            // res.status(400).send('Login error');
        });
    }


})

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/:token', authenticate, (req, res) => {

    res.render('home.ejs', { token: req.params.token, day: day });
});


app.post('/:token', authenticate, (req, res) => {
    var routine = [
        req.body.subjectName0,
        req.body.subjectName1,
        req.body.subjectName2,
        req.body.subjectName3,
        req.body.subjectName4,
    ]

    var startTime = [ //changed name of this variable
        req.body.subjectStartTime0,
        req.body.subjectStartTime1,
        req.body.subjectStartTime2,
        req.body.subjectStartTime3,
        req.body.subjectStartTime4
    ]

    var meetSubjects = req.body.subjectNameSelection;
    var meetLinks = req.body.subjectMeetLinkInput;


    var body0 = _.pick(req.body, ['subjectStartTime0', 'subjectName0']);
    var body1 = _.pick(req.body, ['subjectStartTime1', 'subjectName1']);
    var body2 = _.pick(req.body, ['subjectStartTime2', 'subjectName2']);
    var body3 = _.pick(req.body, ['subjectStartTime3', 'subjectName3']);
    var body4 = _.pick(req.body, ['subjectStartTime4', 'subjectName4']);



    var routineObj = new Routine({
        _creator: "Ayon"
    })


    var length0 = body0.subjectStartTime0.length;
    var length1 = body1.subjectStartTime1.length;
    var length2 = body2.subjectStartTime2.length;
    var length3 = body3.subjectStartTime3.length;
    var length4 = body4.subjectStartTime4.length;


    var subjects0 = [];
    for (let i = 0; i < length0; i++) {
        const subjectStartTime = body0.subjectStartTime0[i];
        const subjectName = body0.subjectName0[i];
        subjects0.push({ subjectName, subjectStartTime })
    }
    routineObj.subjectsArr.push({ subjects: subjects0 });

    var subjects1 = [];
    for (let i = 0; i < length1; i++) {
        const subjectStartTime = body1.subjectStartTime1[i];
        const subjectName = body1.subjectName1[i];
        subjects1.push({ subjectName, subjectStartTime })
    }
    routineObj.subjectsArr.push({ subjects: subjects1 });

    var subjects2 = [];
    for (let i = 0; i < length2; i++) {
        const subjectStartTime = body2.subjectStartTime2[i];
        const subjectName = body2.subjectName2[i];
        subjects2.push({ subjectName, subjectStartTime })
    }
    routineObj.subjectsArr.push({ subjects: subjects2 });

    var subjects3 = [];
    for (let i = 0; i < length3; i++) {
        const subjectStartTime = body3.subjectStartTime3[i];
        const subjectName = body3.subjectName3[i];
        subjects3.push({ subjectName, subjectStartTime })
    }
    routineObj.subjectsArr.push({ subjects: subjects3 });

    var subjects4 = [];
    for (let i = 0; i < length4; i++) {
        const subjectStartTime = body4.subjectStartTime4[i];
        const subjectName = body4.subjectName4[i];
        subjects4.push({ subjectName, subjectStartTime })
    }
    routineObj.subjectsArr.push({ subjects: subjects4 });



    routineObj.save().then((doc) => {
        console.log("data saved");
    }).catch((err) => {
        console.log(err)
    });




    res.render('savedRoutine.ejs', {
        day: day,
        routine: routine,
        startTime: startTime,
        meetSubjects: meetSubjects,
        meetLinks: meetLinks,
        token: req.params.token
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));