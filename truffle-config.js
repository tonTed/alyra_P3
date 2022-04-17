const path = require("path");

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
