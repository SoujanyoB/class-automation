const express = require('express');
const CronJob = require('cron').CronJob;
const ejs = require('ejs');
const path = require('path');

// const fs = require('fs');

// const port = process.env || 3000;
const port = 3000;

const app = express();

app.set('view-engine', ejs);

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public/fonts')));

app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});


app.listen(port, () => console.log(`Listening on port ${port}`));
