'use strict'

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const config      = require('./config/db');
const User        = require('./models/user.js');
const port        = process.env.PORT || 8080;
const apiRoutes   = express.Router();
var BigNumber     = require('bignumber.js');
var Web3            = require('web3');
var contract        = require("truffle-contract");
var path            = require('path');
var MyContractJSON  = require('../blockchain-Lottery-solidity/build/contracts/Lottery.json');

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


var MyContract = contract(MyContractJSON);
MyContract.setProvider(new Web3.providers.HttpProvider('http://138.68.105.52:8545'));
// Use Truffle as usual
var instance = MyContract.at('0x83aedfffd13c42b6e91ef6569e3823ed55ae58ce')

app.get('/test', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/lastWinner', function (req,res){
    instance.lastWinner().then(function (lastWin){ res.send(lastWin)})
})


app.get('/participantsCount', function (req,res){
    instance.participantsCounter().then(function (count){res.send(count.toString())})
})

app.listen(port);
console.log('The poor are getting poorer at: http://localhost:' + port);
