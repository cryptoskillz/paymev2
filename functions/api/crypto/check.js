async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return await response.json();
    }
    return response.text();
}

export async function onRequestGet(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    let theUrl = "";
    let theResponse;
    let theJson;
    let results;
    try {

        const { searchParams } = new URL(request.url);
        //get the tables cryptocurrencies 
        const cryptocurrency = searchParams.get('cryptocurrency');
        //get the address we want to check
        const address = searchParams.get('address');
        //get the order id
        const orderId = searchParams.get('orderId');
        if (cryptocurrency == "BTC") {
            //check whihc netowkr we are on. 
            let blockExplorer;
            if (context.env.NETWORK == "mainnet")
                blockExplorer = context.env.BTCBLOCKEXPLORERMAIN
            else
                blockExplorer = context.env.BTCBLOCKEXPLORERTEST
            theUrl = `${blockExplorer}/address/${address}/txs`
            const init = {
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
            };
            //call block stream to check the transaction
            theResponse = await fetch(theUrl, init);
            results = await gatherResponse(theResponse);
            //build a blank payment response
            let paymentResponse = {};
            //console.log(results[0])
            //build the payment result
            //note we are making an assumpation that it will be in element 0, we can make this more roboust.
            paymentResponse.txid = results[0].txid;
            paymentResponse.status = results[0].status
            //set the old to false.
            paymentResponse.old = false;
            //check if the payment is confirmed
            if (results[0].status.confirmed == false) {
                //update the database with the txId
                let theQuery = `UPDATE crypto_payments SET confirmed = 0,txId='${results[0].txid}',updatedAt = CURRENT_TIMESTAMP WHERE orderId='${orderId}'`
                const info = await context.env.DB.prepare(theQuery).run();
            } else {
                //check if we have it in the databae if not it is a new payment to us so we update.
                const txIdCount = context.env.DB.prepare(`SELECT count() as total from crypto_payments where txId = '${results[0].txid}'`);
                const txIdResults = await txIdCount.first();
                //check if we have this txid in the database or not
                if (txIdResults.total == 0) {
                    //we could check the amount matches here. 
                    let theQuery = `UPDATE crypto_payments SET confirmed = 1,txId='${results[0].txid}',updatedAt = CURRENT_TIMESTAMP WHERE orderId='${orderId}'`
                    const info = await context.env.DB.prepare(theQuery).run();
                } else {
                    //it was already in the database so for some reason this is an old payment.
                    paymentResponse.old = true;
                }
            }
            return new Response(JSON.stringify(paymentResponse), { status: 200 });


        }

        return new Response(JSON.stringify({ "message": "code not found" }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ "error": error }), { status: 400 });
    }

}



/*
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