//import swan.
/*

//note because --node-compat does not work on production I will have to move this to a worker until it has been resolved
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

    const { searchParams } = new URL(request.url);
    //get the tables
    const id = searchParams.get('id');
    const network = searchParams.get('network');
    let theResponse ={};
    if (id == "BTC")
    {
        let address =  swan.addressFromExtPubKey({ extPubKey: context.env.XPUB, network: context.env.NETWORK})
        //console.log(address.address)
        theResponse.address = address.address
        theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
        theResponse.path = address.path;
        theResponse.network = context.env.NETWORK
        //console.log(theResponse)
    }
    else
    {
        //it is not BTC so just return the address
        theResponse.address = context.env.CRYPTOADDRESS
        theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
        theResponse.path = "";
    }
    return new Response(JSON.stringify({ "data": theResponse }), { status: 200 });
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
    const network = searchParams.get('network');
    let theResponse ={};
    if (id == "BTC")
    {
        let address =  "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu"
        //console.log(address.address)
        theResponse.address = address;
        theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
        theResponse.path = address.path;
        theResponse.network = context.env.NETWORK
        //console.log(theResponse)
    }
    else
    {
        //it is not BTC so just return the address
        theResponse.address = context.env.CRYPTOADDRESS
        theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
        theResponse.path = "";
    }
    return new Response(JSON.stringify({ "data": theResponse }), { status: 200 });
}