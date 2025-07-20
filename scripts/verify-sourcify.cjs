const fs = require('fs');
const path = require('path');

async function main() {
    const contractAddress = '0x2AA20552Bc8424ca74142Fb0eA9b3E7d31639839';
    const chainId = 10143; // Monad testnet chain ID
    
    console.log('Verifying contract at address:', contractAddress);
    console.log('Chain ID:', chainId);
    
    // Read the contract source
    const contractPath = path.join(__dirname, '../contracts/ConfessionContract.sol');
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    
    // Read the metadata
    const metadataPath = path.join(__dirname, '../metadata.json');
    const metadata = fs.readFileSync(metadataPath, 'utf8');
    
    // Prepare the verification data
    const verificationData = {
        address: contractAddress,
        chain: chainId.toString(),
        files: {
            'contracts/ConfessionContract.sol': contractSource,
            'metadata.json': metadata
        }
    };
    
    console.log('Sending verification request to Sourcify...');
    
    try {
        const response = await fetch('https://sourcify-api-monad.blockvision.org/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(verificationData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log('✅ Contract verified successfully!');
            console.log('Verification result:', result);
        } else {
            console.log('❌ Verification failed:', result);
        }
    } catch (error) {
        console.error('❌ Error during verification:', error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 