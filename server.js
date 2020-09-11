const express = require('express');
const CronJob = require('cron').CronJob;
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');

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

app.post('/login', (req, res) => {
    console.log(req.body);
    res.send('Hello')
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', (req, res) => {
    console.log(req.body);
    res.send('Hello')
})

app.listen(port, () => console.log(`Listening on port ${port}`));
