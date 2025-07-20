
require('@nomiclabs/hardhat-ethers');
require('@nomicfoundation/hardhat-chai-matchers');
require('@typechain/hardhat');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomicfoundation/hardhat-verify');
require('dotenv').config();

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 10143
    },
    monad: {
      url: process.env.MONAD_RPC_URL || 'https://rpc.monad.xyz',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 'auto',
      gas: 'auto',
      chainId: 10143
    },
    monadTestnet: {
      url: process.env.MONAD_TESTNET_RPC_URL || 'https://testnet-rpc.monad.xyz',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 'auto',
      gas: 'auto',
      chainId: 10143
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  sourcify: {
    enabled: true
  },
  
};
