/**

This is a xpub as a service clourflare worker.  

xpub = xpub key (required)

network = bitcoin / testnet (network) defaults to mainnet

biptype = 44,49,84 (address type) defaults to 84

newaddresscheck = 0 / 1 boolean (loop until we get an address with a 0 balance) defaults to 1

startaddress = start address defaults to 0

numberofaddresses = max number of addresses to check defaults to 1000

randomaddress = 0 / 1 boolean (get a random address between paramter 5 and 6 if paramater 4 is 1 then it will use this as the start for the loop) 

http://localhost:8787/?key=test12345&biptype=84&newaddresscheck=1&startaddress=0&numberofaddresses=1&randomaddress=0

 */

import { addressFromExtPubKey } from '@swan-bitcoin/xpub-lib';


async function handleRequest(request) {
    //set up a response object
    let theResponse = {}
    //get the url paramaters
    const { searchParams } = new URL(request.url);
    const xpub = searchParams.get('xpub');
    const network = searchParams.get('network');
    /*
    //note implement each of these url paramaters so it has feature parity with the xpubasaservice
    const key = searchParams.get('key');
    const biptype = searchParams.get('biptype');
    const newaddresscheck = searchParams.get('newaddresscheck');
    const startaddress = searchParams.get('startaddress');
    const numberofaddresses = searchParams.get('numberofaddresses');
    const randomaddress = searchParams.get('randomaddress');
    */
    //call the pubkey method
    const address = addressFromExtPubKey({ extPubKey: xpub, network: network });
    //console.log(address);
    //build the response
    theResponse.address = address.address
    theResponse.qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${theResponse.address}`
    theResponse.path = address.path;
    theResponse.network = network
    //return the response
    return new Response(JSON.stringify(theResponse));

}

addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});
