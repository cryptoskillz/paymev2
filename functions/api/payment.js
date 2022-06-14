//hold the payload
let payLoad;
//hold the contenttypes
let contentType;
const datamain = "data";

//array for the data
let theDataArray = []
//payment response object
let paymentResponse = { "id": "", "paid": "", "confirmations": "", "paymentAddress": "", "paymentUrl": "" }

//add to the data array
let  addToDataArray = (pData) => {

    //console.log(queueData[i].kv)
    ///console.log(pData)
    //parse it
    pData = JSON.parse(pData);
    //build the   object
    paymentResponse.id = pData.id;
    paymentResponse.paid = pData.paid;
    paymentResponse.confirmations = "0";
    paymentResponse.paymentAddress = pData.paymentAddress;
    paymentResponse.paymentUrl = "";
    //add to the array
    theDataArray.push(paymentResponse)
}

async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json());
    } else if (contentType.includes('application/text')) {
        return response.text();
    } else if (contentType.includes('text/html')) {
        return response.text();
    } else {
        return response.text();
    }
}

export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    try {
        theDataArray = []
        //set a valid flag
        let valid = 1;
        //set an error message
        let _errormessage = "";
        //get the paramates
        const { searchParams } = new URL(request.url)
        //set a limit
        let limit = 1;
        //get the secret
        let secret = searchParams.get('s');
        //get the payment id
        let paymentid = searchParams.get('i')
        //check if a limit was passed
        let tmp = searchParams.get('l');
        if ((tmp != undefined) && (tmp != "") && (tmp != null))
            limit = tmp;
        //debug
        //console.log(secret);
        //console.log(paymentid);
        //console.log(limit)
        //set up the KV
        const KV = context.env.kvdata;
        //get the settings based on the name
        if ((secret != undefined) && (secret != "") && (secret != null)) {
            let queueData = await KV.get("paymentqueue");
            //console.log(queueData)
            //check  we have a payment queue
            if ((queueData != undefined) && (queueData != "") && (queueData != null)) {
                //parse the queue
                queueData = JSON.parse(queueData);
                ///console.log(queueData)
                let counter = 1;
                let addedIt = 0;
                //loop  it
                for (var i = 0; i < queueData.length; ++i) {
                    //check for an id 
                    if ((paymentid != undefined) && (paymentid != "") && (paymentid != null)) {
                        if (addedIt == 0) {
                            //check if the id matches and checks
                            //get the object
                            console.log(datamain + "-" + secret + "]" + paymentid)
                            let pData = await KV.get(datamain + "-" + secret + "]" + paymentid);
                           
                            pData = JSON.parse(pData)
                            //console.log(pData)
                            addedIt = 1;
                            //get the balance
                            //bc1qxphczudn8retcx0umz3pf2xuwpaxwmeslwugvm
                            let url = `https://blockchain.info/q/addressbalance/${pData.paymentAddress}`
                           // console.log(url)
                            const response = await fetch(url);
                            const results = await gatherResponse(response);
                            //console.log(results)
                            if (parseInt(results) > 0)
                            {
                               //todo add the other payment data
                                pData.paid = 1  
                                addToDataArray(JSON.stringify(pData))   
                               //update the payment ky object
                            }
                            await KV.put(datamain + "-" + secret + "]" + paymentid,JSON.stringify(pData));
                        }
                    } else {
                        if (limit >= counter) {
                            console.log(counter)
                                //get the object
                            let pData = await KV.get(queueData[i].kv);
                            addToDataArray(pData)
                            counter++;
                        }
                    }
                }
            } else {
                valid = 0;
                _errormessage = 'id not found'
            }
        } else {
            valid = 0;
            _errormessage = 'id not set'
        }
        if (valid == 1)
        {
            console.log(theDataArray)
            return new Response(JSON.stringify(theDataArray), { status: 200 });
        }
        else
            return new Response(JSON.stringify({ error: _errormessage }), { status: 400 });
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}