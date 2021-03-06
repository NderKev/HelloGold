//const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const privKey = "<private key here>";
const mnemonic = "come hover maple exhaust proud invite sweet elegant seven pair stock toy";
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

    networks: {
      ropsten: {
        provider: () => { return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/PGeaCCgYpthSugPncips")},
        network_id: '3'
      },
      rinkeby: {
        provider: () => { return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/PGeaCCgYpthSugPncips")},
        network_id: '4',
        gas: 4600000
      },
      development: {
          host: "127.0.0.1",
          port: 8545,
          network_id: "*" // Match any network id
      }
  }
};
