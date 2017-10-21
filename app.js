'use strict'

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const passport	  = require('passport');
const config      = require('./config/db');
const User        = require('./models/user.js');
const port        = process.env.PORT || 8080;
const jwt         = require('jwt-simple');
const apiRoutes   = express.Router();
//const seed = require('seed')

mongoose.connect(config.database);
require('./config/passport')(passport);

function getToken(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

function listen(){
    var Web3 = require('web3');

    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    // can be 'latest' or 'pending'
    var filter = web3.eth.filter('latest');

    // watch for changes
    filter.watch(function (error, result){
        if (!error)
            console.log(result);
    });

    return filter
}

var filter = listen()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/api', apiRoutes);

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

apiRoutes.post('/signup', function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password.'});
    } else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password,
        });
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Email already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

apiRoutes.post('/auth', function (req, res) {
    User.findOne({
        email: req.body.email,
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, config.secret);
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

apiRoutes.get('/user', passport.authenticate('jwt', { session: false}),
    function (req, res) {
        var token = getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({
                email: decoded.email,
            }, function (err, user) {
                if (err) throw err;

                if (!user) {
                    return res.status(403).send(
                        {success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    res.json(
                        {success: true, msg: 'Welcome in the member area ' + user.email + '!'});
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }
    });

app.listen(port);
console.log('The poor are getting poorer at: http://localhost:' + port);
