import request from 'request';

async function checkTransaction(address) {
  return new Promise((resolve, reject) => {
    request.get(`https://blockstream.info/api/address/${address}/txs`, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }

      const txs = JSON.parse(body).txs;
      const hasReceived = txs.some(tx => tx.vin.some(input => input.prevout.address === address));
      resolve(hasReceived);
    });
  });
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const address = request.url.split('/').pop();
  const hasReceived = await checkTransaction(address);
  return new Response(hasReceived ? 'Transaction has been received' : 'Transaction has not been received');
}

/*

check eth 

const Web3 = require('web3');

// Connect to the Ethereum blockchain
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_API_KEY');

// The address to check
const address = '0x123456...';

// Get the balance of the address
web3.eth.getBalance(address).then(balance => {
  console.log(`Balance: ${balance}`);
});

*/