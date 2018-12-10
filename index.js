var express = require('express');
var bodyParser = require('body-parser');
var HookedWeb3Provider = require("hooked-web3-provider");
const contractAddress = require('./libs/contractAddress');
var Web3 = require('web3');
const HelloGold = require('./libs/HelloGold')
const provider = require('./libs/provider');
const cors = require('cors')
//const lib = require('./util/lib')
const Tx = require('ethereumjs-tx')
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//Initialize the web3 provider using localhost RPC and an Infura RPC Fallback
var web3 = new Web3(new Web3.providers.HttpProvider( provider ));
const contract = web3.eth.contract(HelloGold);
//const TransferTokens = require('./libs/TransferTokens');
//const CheckBal = web3.eth.contract(TransferTokens);

const privateKey = new Buffer('80248670d6309e74d63ad7afa9cef82a6fadcbcccbdd2a25eb69a08e1053b5c1', 'hex')
const defaultAddress = "0x75Cb7cc29Cc9489A85E14744391Df17Dc8cA3746"

app.post('/HelloGold/checkUserBalance', function(req, res){
  try
  {
    var address = req.body.address;

    function BalancePromise(user_addr, contract_addr) {
      return new Promise((resolve, reject) => {
        var ethBalance = HelloGold.checkBalance(address);
        ethBalance = ethBalance.toNumber();
        ethBalance = ethBalance * Math.pow(10, -18);
        console.log("User's ETH Investment balance is" + " "  + ethBalance);
        var TotalEthBalance = web3.eth.getBalance(user_addr);
        TotalEthBalance = TotalEthBalance.toNumber();
        TotalEthBalance = TotalEthBalance * Math.pow(10, -18);
        console.log("User's ETH  balance is" + " "  + TotalEthBalance);
        var output =
        {
          ethBalance : ethBalance,
          TotalEthBalance : TotalEthBalance
        }
        return resolve(output);
      });
    }
    var ResultPromise = new Promise((resolve, reject) => {
      var BalancesPromise = BitCademyPromise(address,contractAddress);
      resolve(balanceDetails);
    })
    ResultPromise.then(function(balanceDetails){
      res.send(balanceDetails);
    })
  }
  catch(err){
    console.log(err.message);
    res.send(err.message);
  }
  finally{
    var time = new Date(Date.now()).toUTCString();
    //console.log(time);
    console.log("HelloGoldBitCademy.js [checkUserBalances] is executed at UTC Time :" + time);
  }
});





function depositFundsPromise(amount, userAddress) {
  return new Promise((resolve, reject) => {
    const count = web3.eth.getTransactionCount(defaultAddress);
    // const abiArray = BTM_Voting
    // const contract = web3.eth.contract(abiArray).at(contractAddress);

    var rawTransaction = {
        "from": defaultAddress,
        "nonce": web3.toHex(count),
        "gasPrice": "0x04e3b29200",
        "gasLimit": "0xF458F",
        "to": contractAddress,
        "value": "0x0",
        "data": HelloGold.depositFunds.getData(amount, {from: userAddress})
    };

    var privKey = privateKey
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
        if(err) {
          console.log(err)
          reject(new Error(err.message))
        }

        console.log(hash);
        resolve(hash)
    });
  })
}


app.post('/HelloGold/depositFunds', async (req, res) => {
    try
    {
      console.log('Request in')
      const {amount, sender} = req.body

    const execSetRate = await depositFundsPromise(amount, sender);
    res.send({
      error: 0,
      txid: execSetRate
    });
    } catch(err) {
      console.log('err' + err.message);
      res.status(500).send({
        error: 1,
        error_message: err.message
      });
    }
});

function claimRefundPromise(amount, userAddress) {
  return new Promise((resolve, reject) => {
    const count = web3.eth.getTransactionCount(defaultAddress);
    // const abiArray = BTM_Voting
    // const contract = web3.eth.contract(abiArray).at(contractAddress);

    var rawTransaction = {
        "from": defaultAddress,
        "nonce": web3.toHex(count),
        "gasPrice": "0x04e3b29200",
        "gasLimit": "0xF458F",
        "to": contractAddress,
        "value": "0x0",
        "data": HelloGold.claimRefund.getData(amount, {from: userAddress})
    };

    var privKey = privateKey
    var tx = new Tx(rawTransaction);

    tx.sign(privKey);
    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, hash) => {
        if(err) {
          console.log(err)
          reject(new Error(err.message))
        }

        console.log(hash);
        resolve(hash)
    });
  })
}

app.post('/HelloGold/claimRefund', async (req, res) => {
    try
    {
      console.log('Request in')
      const {amount, sender} = req.body

    const execSetRate = await claimRefundPromise(amount, sender);
    res.send({
      error: 0,
      txid: execSetRate
    });
    } catch(err) {
      console.log('err' + err.message);
      res.status(500).send({
        error: 1,
        error_message: err.message
      });
    }
});




app.listen(9000, function(err){
  if (!err) {
    console.log("Server is Running on port 9000");
  }
});
