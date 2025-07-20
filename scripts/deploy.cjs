
const { ethers } = require('hardhat');

async function main() {
    console.log('Deploying ConfessionContract to Monad...');
    
    // Get the ContractFactory
    const ConfessionContract = await ethers.getContractFactory('ConfessionContract');
    
    // Deploy the contract
    const confessionContract = await ConfessionContract.deploy();
    
    // Wait for deployment to complete
    await confessionContract.waitForDeployment();
    
    const contractAddress = await confessionContract.getAddress();
    
    console.log('ConfessionContract deployed to Monad at:', contractAddress);
    
    // Verify deployment by calling a view function
    const confessionCount = await confessionContract.confessionCount();
    console.log('Initial confession count:', confessionCount.toString());
    
    // Save deployment info
    const deploymentInfo = {
        contractAddress: contractAddress,
        network: 'monad',
        chainId: network.name === 'monadTestnet' ? 10143 : 10143,
        deployer: await confessionContract.runner?.getAddress(),
        timestamp: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber()
    };
    
    console.log('Monad deployment info:', JSON.stringify(deploymentInfo, null, 2));
    
    
    return contractAddress;
}

main()
    .then((address) => {
        console.log('Deployment to Monad completed successfully!');
        console.log('Contract address:', address);
        process.exit(0);
    })
    .catch((error) => {
        console.error('Monad deployment failed:', error);
        process.exit(1);
    });
