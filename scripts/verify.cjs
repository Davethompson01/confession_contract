const { run } = require('hardhat');

async function main() {
    const contractAddress = '0x2AA20552Bc8424ca74142Fb0eA9b3E7d31639839';
    
    console.log('Verifying contract at address:', contractAddress);
    
    try {
        await run('verify:verify', {
            address: contractAddress,
            contract: 'contracts/ConfessionContract.sol:ConfessionContract',
            network: 'monadTestnet',
            sourcify: true
        });
        
        console.log('Contract verified successfully!');
    } catch (error) {
        if (error.message.includes('Already Verified')) {
            console.log('Contract is already verified!');
        } else {
            console.error('Verification failed:', error.message);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 