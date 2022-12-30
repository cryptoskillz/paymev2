async function processBNB(address) {
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
        //return theUrl
        //call block stream to check the transaction
        theResponse = await fetch(theUrl, init);
        //console.log(theResponse)
        results = await gatherResponse(theResponse);
        paymentResponse.txid = results.result[0].blockHash;
        //console.log(results.result[0])
        if (results.result[0].txreceipt_status == 1)
            paymentResponse.confirmed = true;
        else
            paymentResponse.confirmed = false;
        //set the old to false.
        paymentResponse.old = false;
        return paymentResponse;

    } catch (error) {
        console.log(error);
        //return new Response(JSON.stringify({ "error": error }), { status: 400 });
        return (error)
    }
}

export default {
    async fetch(request, env) {
        let paymentResult = []
        let theJson = {}
        let theSQL = `SELECT name,address,paymentType from crypto_payments where confirmed = 0 `
        console.log(theSQL)
        //run it
        let query = env.DB.prepare(theSQL);
        const queryResult = await query.all();
        console.log(queryResult.results)
        for (var i = 0; i < queryResult.results.length; i++) {
            let addIt = 1;
            let theData = queryResult.results[i];
            if (theData.address == null) {
                //check the tyoe
                addIt = 0
            }

            if (theData.paymentType == null) {
                //check the tyoe
                addIt = 0
            }

            if (theData.paymentType == "USD") {
                //check the tyoe
                addIt = 0
            }
            //debug
            //addIt = 1;

            if (addIt == 1) {
                switch (theData.paymentType) {
                    case "BTC":
                        alert('y')
                        break;
                    case "ETH":
                        alert('y')
                        break;
                    case "BNB"
                        alert('y')
                        break;
                }

                paymentResult.push(theData)
            }
            //console.log(theData);

        }
        theJson.results = paymentResult
        //return the response
        return new Response(JSON.stringify(theJson));
    },
};