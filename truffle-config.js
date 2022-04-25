const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
		development: {
			host: "127.0.0.1",     // Localhost (default: none)
			port: 8545,            // Standard Ethereum port (default: none)
			network_id: "*",       // Any network (default: none)
		},
		ropsten:{
      provider : function() {return new HDWalletProvider({
        mnemonic:{phrase:`${process.env.MNEMONIC}`},
        providerOrUrl:`https://ropsten.infura.io/v3/${process.env.INFURA_ID}`})},
        network_id:3,
    },
    kovan:{
      provider : function() {return new HDWalletProvider({
        mnemonic:{phrase:`${process.env.MNEMONIC}`},
        providerOrUrl:`https://kovan.infura.io/v3/${process.env.INFURA_ID}`
      })},
      network_id:42,
    },
		fuji :{
      provider : function() {return new HDWalletProvider({
        mnemonic:{phrase:`${process.env.MNEMONIC}`},
        providerOrUrl:`https://api.avax-test.network/ext/bc/C/rpc`
      })},
      network_id:43113,
    },
	},
	mocha: {
		reporter: 'eth-gas-reporter',
		reporterOptions: {
			gasPrice: 1,
			token: 'ETH',
		}
	},
	plugins: ["solidity-coverage"],
	compilers: {
		solc: {
			version: "0.8.13",    	// Fetch exact version from solc-bin (default: truffle's version)
		}
	},
};
