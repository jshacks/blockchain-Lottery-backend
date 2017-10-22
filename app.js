'use strict'

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');
const config      = require('./config/db');
const User        = require('./models/user.js');
const port        = process.env.PORT || 8080;
const apiRoutes   = express.Router();
var BigNumber = require('bignumber.js');

var Web3 = require('web3');
var provider = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var contract        = require("truffle-contract");
var path            = require('path');
var MyContractJSON  = require(path.join(__dirname, '/../blockchain-Lottery-solidity/build/contracts/Lottery.json'));

// function listen(){
//
//     // can be 'latest' or 'pending'
//     var filter = provider.eth.filter('latest');
//
//     // watch for changes
//     filter.watch(function (error, result){
//         if (!error)
//             console.log(result);
//     });
//
//     return filter
// }
//
// var filter = listen();


app.get('/', function (req, res) {
    var MyContract = contract(MyContractJSON);
    //MyContract.setProvider(provider.currentProvider);

    // Use Truffle as usual
    let poc = MyContract.at('0xb2d351b5d787730e59f5c9c900f178a72b65b433').then(function (instance){
        return instance.NewWinner.call();
    }).then(function (result) {
        console.log(result);
    }, function (error) {
        console.log(error);
    });
    res.send("viata")
});

app.get('/test', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});


app.listen(port);
console.log('The poor are getting poorer at: http://localhost:' + port);
