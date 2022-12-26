async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return await response.json();
    }
    return response.text();
}

async function updateDb(orderId, address, context, paymentResponse, transactionJson, symbol) {
    //check if the payment is confirmed
    //console.log(paymentResponse)
    transactionJson = JSON.stringify(transactionJson)
    if (paymentResponse.confirmed == false) {
        //update the database with the txId
        let theQuery = `UPDATE crypto_payments SET confirmed = 0,txId='${paymentResponse.txid}',updatedAt = CURRENT_TIMESTAMP WHERE orderId='${orderId}'`
        const info = await context.env.DB.prepare(theQuery).run();
    } else {
        //check if we have it in the databae if not it is a new payment to us so we update.
        const txIdCount = context.env.DB.prepare(`SELECT count() as total from crypto_payments where txId = '${paymentResponse.txid}'`);
        const txIdResults = await txIdCount.first();
        //check if we have this txid in the database or not
        if (txIdResults.total == 0) {
            //we could check the amount matches here. 
            let theQuery = `UPDATE crypto_payments SET confirmed = 1,txId='${paymentResponse.txid}',updatedAt = CURRENT_TIMESTAMP, txResponse='${transactionJson}' WHERE orderId='${orderId}'`
            const info = await context.env.DB.prepare(theQuery).run();
        } else {
            //it was already in the database so for some reason this is an old payment.
            paymentResponse.old = true;
        }
    }
    return (paymentResponse)
}

async function processETH(theData, context) {
    //console.log(theData)
    let paymentResponse = {};
    paymentResponse.txid = theData.transaction.hash;
    if (theData.receipt.blockNumber)
        paymentResponse.confirmed = true;
    else
        paymentResponse.confirmed = false;
    //set the old to false.
    paymentResponse.old = false;
    paymentResponse = await updateDb(theData.orderId, theData.address, context, paymentResponse, theData.transaction, "ETH");
    //console.log(paymentResponse)
    return paymentResponse;
}


async function processBNB(orderId, address, context) {
    //check whihc netowkr we are on. 
    let blockExplorer;
    let theResponse;
    let results;
    let paymentResponse = {};
    if (context.env.NETWORK == "mainnet")
        blockExplorer = context.env.BNBAPIMAIN
    else
        blockExplorer = context.env.BNBAPITEST
    const BNBApiToken = context.env.BNBAPITOKEN
    const theUrl = `${blockExplorer}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${BNBApiToken}`
    const init = {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    };
    try {
        //call block stream to check the transaction
        theResponse = await fetch(theUrl, init);
        //console.log(theResponse)
        results = await gatherResponse(theResponse);
        paymentResponse.txid = results.result[0].blockHash;
        return new Response(JSON.stringify({ "url":theUrl,"results": results.result[0] }), { status: 400 });

                //console.log(results.result[0])
        if (results.result[0].txreceipt_status == 1)
            paymentResponse.confirmed = true;
        else
            paymentResponse.confirmed = false;
        //set the old to false.
        paymentResponse.old = false;
        paymentResponse = await updateDb(orderId, address, context, paymentResponse, results.result[0], "BNB");
        return paymentResponse;

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ "error": error }), { status: 400 });
    }
}


async function processBTC(orderId, address, context) {
    //check whihc netowkr we are on. 
    let blockExplorer;
    let theResponse;
    let results;
    let paymentResponse = {};

    if (context.env.NETWORK == "mainnet")
        blockExplorer = context.env.BTCBLOCKEXPLORERMAIN
    else
        blockExplorer = context.env.BTCBLOCKEXPLORERTEST
    let theUrl = `${blockExplorer}/address/${address}/txs`
    const init = {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    };
    //call block stream to check the transaction
    theResponse = await fetch(theUrl, init);
    results = await gatherResponse(theResponse);
    //build a blank payment response
    //console.log(results[0])
    //build the payment result
    //note we are making an assumpation that it will be in element 0, we can make this more roboust.
    paymentResponse.txid = results[0].txid;
    paymentResponse.confirmed = results[0].status.confirmed
    //set the old to false.
    paymentResponse.old = false;
    paymentResponse = await updateDb(orderId, address, context, paymentResponse, results[0], "BTC");
    //console.log(paymentResponse)
    return paymentResponse;
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

    try {

        const { searchParams } = new URL(request.url);
        //get the tables cryptocurrencies 
        const cryptocurrency = searchParams.get('cryptocurrency');
        //get the address we want to check
        const address = searchParams.get('address');
        //get the order id
        const orderId = searchParams.get('orderId');
        //console.log(cryptocurrency)
        if (cryptocurrency == "BTC") {
            const paymentResponse = await processBTC(orderId, address, context);
            return new Response(JSON.stringify(paymentResponse), { status: 200 });
        }

        if (cryptocurrency == "BNB") {
            const paymentResponse = await processBNB(orderId, address, context);
            return new Response(JSON.stringify(paymentResponse), { status: 200 });
        }

        return new Response(JSON.stringify({ "message": "code not found" }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ "error": error }), { status: 400 });
    }

}

export async function onRequestPut(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    const contentType = request.headers.get('content-type')
    let theData;
    if (contentType != null) {
        theData = await request.json();
        //if (theData.)
        //console.log(theData);
        if (theData.tableData.symbol == "ETH") {
            const paymentResponse = await processETH(theData.tableData, context);
            return new Response(JSON.stringify(paymentResponse), { status: 200 });
        }
    }

}





/*

check eth 


*/