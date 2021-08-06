const express = require('express');
const User = require('../models/user'); //to user
const passport = require('passport');
const { Passport } = require('passport');
const router = express.Router();
const authenticate = require('../authenticate');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => { //the slash sign up path
    User.register(
        new User({username: req.body.username}),
        req.body.password,
        err => {
            if (err) {
                res.statusCode = 500; //not an issue on their end, but server
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        }
    );
}); 

router.post('/login', passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => { //one final thing, hey im out
    if (req.session) { //deleting session 
        req.session.destroy();
        res.clearCookie('session-id'); //in app.js used. clear cookie
        res.redirect('/'); //to redirect to the root path local host 3000/
    } else {
        const err = new Error('You are not logged in!'); //trhying to log out without being logged in
        err.status = 401;
        return next(err);
    }
});

module.exports = router;