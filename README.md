# blockchain-Lottery-backend

## What you need to run it:
* node.js
* testrpc
* truffle

## How to run:
* Run testrpc to simulate ethereum
* Deploy truffle
* Run :
```sh
sudo npm install -g ethereumjs-testrpc # for installing testrpc
cd blockchain-Lottery-backend
node app.js
```

## Routes:
* /lastWinner returns the wallet of the lotto winner
* /participantsCount return the number of people participating
