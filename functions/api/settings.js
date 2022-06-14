//hold the payload
let payLoad;
//hold the contenttypes
let contentType;
//settings schema
let settingsSchema = '{"btcaddress":"","xpub":"","companyname":""}'
//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');


//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
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
    let details = await decodeJwt(request.headers, env.SECRET)
    //console.log(details)
    //set up the KV
    const KV = context.env.kvdata;
    //get the settings based on the name
    let user = await KV.get("user" + details.payload.username);
    //console.log(user)
    user = JSON.parse(user)
    //console.log(user)
    let pData = await KV.get("settings" + user.user.secret);
    //console.log(pData)
    if (pData != null)
        return new Response(pData, { status: 200 });
    else
        return new Response(JSON.stringify({ error: "Settings not found" }), { status: 400 });

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
    try {
        contentType = request.headers.get('content-type');
        if (contentType != null) {
            //get the payload
            payLoad = await request.json();
            //console.log(payLoad)
            //get the details
            let details = await decodeJwt(request.headers, env.SECRET)
            //set up the kv data
            const KV = context.env.kvdata;
            let user = await KV.get("user" + details.payload.username);
            //console.log(user)
            user = JSON.parse(user)
            let theItem = settingsSchema;
            theItem = JSON.parse(theItem)
            //console.log(theItem)
            //check that they sent up the data
            //note : we could make this simplier by just parsing the payload array.
            if (theItem != null) {
                if (payLoad.btcaddress != undefined)
                    theItem.btcaddress = payLoad.btcaddress;
                if (payLoad.xpub != undefined)
                    theItem.xpub = payLoad.xpub;
                if (payLoad.companyname != undefined)
                    theItem.companyname = payLoad.companyname;
                //console.log(datamain + details.payload.username + payLoad.id)
                //delete the old one
                let user = await KV.get("user" + details.payload.username);
                user = JSON.parse(user)
                //delete it
                await KV.delete("settings" + user.user.secret);
                //put the new one.
                await KV.put("settings" + user.user.secret, JSON.stringify(theItem));
                return new Response(JSON.stringify({ message: "Settings updated", data: JSON.stringify(theItem) }), { status: 200 });
            } else
                return new Response(JSON.stringify({ error: "Settings not found" }), { status: 400 });

        }
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }

}