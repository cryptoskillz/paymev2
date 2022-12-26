//note because --node-compat does not work on production I will have to move this to a worker until it has been resolved
/*
const swan = require('@swan-bitcoin/xpub-lib');
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
    console.log(swan.addressFromExtPubKey)
    const { searchParams } = new URL(request.url);
    //get the tables
    const id = searchParams.get('id');
    const network = searchParams.get('network');
    let theResponse = {};
    try {
        if (id == "BTC") {
            console.log(context.env.XPUB)
            let address = swan.addressFromExtPubKey({ extPubKey: context.env.XPUB, network: context.env.NETWORK })
            //console.log(address.address)
            theResponse.address = address.address
            theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
            theResponse.path = address.path;
            theResponse.network = context.env.NETWORK
            //console.log(theResponse)
        } else {
            //it is not BTC so just return the address
            theResponse.address = context.env.CRYPTOADDRESS
            theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
            theResponse.path = "";
        }
        return new Response(JSON.stringify({ "data": theResponse }), { status: 200 });
    } catch (error) {
        //swan has died so we fall back
        if (id == "BTC") {
            //set the backup address to mainnet or testnet
            if (context.env.NETWORK == "mainnet") {
                theResponse.address = context.env.BTCBACKUPADDRESSMAIN
            } else {
                theResponse.address = context.env.BTCBACKUPADDRESSTEST
            }
            theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
            theResponse.path = "";
            theResponse.network = context.env.NETWORK
            //console.log(theResponse)
        } else {
            //it is not BTC so just return the address
            theResponse.address = context.env.CRYPTOADDRESS
            theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
            theResponse.path = "";
        }
        return new Response(JSON.stringify({ "data": theResponse }), { status: 200 });

    }

}
*/

async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return await response.json();
    }
    return response.text();
}
async function processXpub(context) {
    try {
        //set the URL
        let theUrl;
        //set a btc address
        let BTCAddress;
        //set a payment response
        let paymentResponse = {};
        //set it to main or testnet
        if (context.env.NETWORK == "mainnet") {
            //set the btc address and the url
            BTCAddress = context.env.BTCBACKUPADDRESSMAIN
            theUrl = `${context.env.XPUBURL}?network=${context.env.NETWORK}&xpub=${context.env.XPUBMAINNET}`
        } else {
             //set the btc address and the url
            BTCAddress = context.env.BTCBACKUPADDRESSTEST
            theUrl = `${context.env.XPUBURL}?network=${context.env.NETWORK}&xpub=${context.env.XPUBTESTNET}`
        }

        const init = {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        };
        //fetch the url 
        let theResponse = await fetch(theUrl, init);
        //process it
        const results = await gatherResponse(theResponse);
        //debg
        //console.log(theUrl)
        //console.log(results)

        //check if xpub worker threw an error 
        //note : we can make the return better than this.
        if (results == "error code: 1042") { 
            //build the payment response from the back up address
            paymentResponse.address =BTCAddress;
            paymentResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${BTCAddress}"`;
            paymentResponse.path = "";
            paymentResponse.network = context.env.NETWORK;
            //set the type so the dev knows
            paymentResponse.type = "backupadress"

        } else {
            //process the xpub response
            paymentResponse = JSON.parse(results);
            paymentResponse.type = "xpub"
        }
        return (paymentResponse)
    } catch (error) {
        console.log(error);
        return (error)
    }
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
    const { searchParams } = new URL(request.url);
    //get the tables
    const id = searchParams.get('id');
    let theResponse = {};
    if (id == "BTC") {
        theResponse = await processXpub(context);
    } else {
        //it is not BTC so just return the address
        theResponse.address = context.env.CRYPTOADDRESS
        theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
        theResponse.path = "";
        theResponse.network = context.env.NETWORK
    }
    return new Response(JSON.stringify({ "data": theResponse }), { status: 200 });
}