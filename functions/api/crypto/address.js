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
        //set the backup address to mainnet or testnet
        //console.log(context.env)
        if (context.env.NETWORK == "mainnet")
        {
            //console.log('dd')
            theResponse.address = context.env.BTCBACKUPADDRESSMAIN
        }
        else
        {
            //console.log('ee')
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
        theResponse.network = context.env.NETWORK
    }
    return new Response(JSON.stringify({ "data": theResponse }), { status: 200 });
}

