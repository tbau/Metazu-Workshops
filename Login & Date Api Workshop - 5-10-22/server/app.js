const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const path = require('path');
const app = express();
__basedir = __dirname;

const logins = require(path.join(__basedir, '../', 'logins.json'));

const port = 80;

const SRC_DIR = path.join(__dirname, '../src');
const LOGIN_FILE = path.join(SRC_DIR, 'index.html');
const DASHBOARD_FILE = path.join(SRC_DIR, 'dashboard.html');

app.use(session({ secret: crypto.randomBytes(16).toString("hex"), resave: false, saveUninitialized: false }))
app.use(express.json());

let loginMiddleware = (req, res, next) => {
    if (req.session.email != null) {
        next();
    } else {
        res.sendStatus(403);
    }
}

app.get('/', function(req, res) {
    res.sendFile(LOGIN_FILE);
})

app.get('/dashboard.html', loginMiddleware, function(req, res) {
    res.sendFile(DASHBOARD_FILE);
})

app.post('/login', function(req, res) {
    if (req.body.email == logins.email &&
        req.body.password == logins.password) {
        req.session.email = logins.email;
        console.log(`User ${req.body.email} logged in`)
        res.json({ 'status': 'Success' });
    } else {
        res.json({ 'status': 'Error' });
    }
});

app.get('/date', loginMiddleware, function(req, res) {
    res.json(new Date().toLocaleDateString());
});

app.get('/weather', loginMiddleware, function(req, res) {
    res.json({ high: 70, low: 65, conditions: 'Rainy', location: 'Nashville' });
});

app.use(express.static("src"));

app.listen(port, function() {
    console.log("Example app listening at http://localhost:%s", port);
})