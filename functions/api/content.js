/*
    notes:


    naming convertion for KV stores.
    <methoddame><payloadname>]<payloadid>
*/

//hold the payload
let payLoad;
//hold the contenttypes
let contentType;
//set data main to whatever is in env for consistency
const datamain = "data2";
let dataSchema = { id: "",name: "", createdAt: "",content:"" }

//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');
//unique uid module
var uuid = require('uuid');
//set up the data schema for the table.
//note we could extend this to have field types and other such nonsense for dynamic  rendering but I don't want to do that and you cannot make me.

//return the date
let getDate = () => {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let formattedDate = `${date_ob.getDate()}/${date_ob.getMonth()+1}/${date_ob.getFullYear()}`
    return (formattedDate)
}

//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}


export async function onRequestPut(context) {
    //const jwt = require('@tsndr/cloudflare-worker-jwt')
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    contentType = request.headers.get('content-type');
    if (contentType != null) {
        //get the payload
        payLoad = await request.json();
        //console.log(payLoad)
        //get the details
        let details = await decodeJwt(request.headers, env.SECRET)
        //set up the kv data
        const KV = context.env.kvdata;
        //get user
        let user = await KV.get("user" + details.payload.username);
        user = JSON.parse(user)
        //get the item
        let theItem = await KV.get(datamain  +"-"+payLoad.level1id+ "]" + payLoad.level2id);
        //console.log(datamain  +"-"+payLoad.level1id+ "]" + payLoad.level2id)
        //console.log(theItem)
        theItem = JSON.parse(theItem)
        if (theItem != null) {
            theItem.content = payLoad.content;
            //console.log(theItem);
            await KV.put(datamain  +"-"+payLoad.level1id+ "]" + payLoad.level2id, JSON.stringify(theItem));
            return new Response(JSON.stringify({ message: "Item updated", data: JSON.stringify(theItem) }), { status: 200 });
        } else
            return new Response(JSON.stringify({ error: "item not found" }), { status: 400 });

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

    const { searchParams } = new URL(request.url)
    let level1id = searchParams.get('id');
    let level2id = searchParams.get('id2');
    //console.log(datamain+"-"+level1id +"]"+ level2id)
    let details = await decodeJwt(request.headers, env.SECRET)
    //set up the KV
    const KV = context.env.kvdata;
    //get user
    let user = await KV.get("user" + details.payload.username);
    user = JSON.parse(user)
    //console.log(user)
    let pData = await KV.get(datamain+"-"+level1id +"]"+ level2id);
    //console.log("pData")
    //console.log(pData)
    return new Response(JSON.stringify(pData), { status: 200 });
    
}

