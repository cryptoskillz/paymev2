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
let contentSchema = {"String": "add content"}
let dataSchema = { id: "",name: "", createdAt: "",content:contentSchema }


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
        console.log(payLoad)
        //get the details
        let details = await decodeJwt(request.headers, env.SECRET)
        //get user

        //set up the kv data
        const KV = context.env.kvdata;
                let user = await KV.get("user" + details.payload.username);
        user = JSON.parse(user)
        //get the item
        let theItem = await KV.get(datamain  +"-"+payLoad.level1id+ "]" + payLoad.id);
        //console.log(datamain  +"-"+payLoad.level1id+ "]" + payLoad.id)
        //console.log(theItem)
        //console.log(datamain+  payLoad.oldname+"]" +payLoad.id)
        //parse it
        theItem = JSON.parse(theItem)
        //console.log(theItem)
        //check that they sent up the data
        //note : we could make this simplier by just parsing the payload array.
        if (theItem != null) {
            if (payLoad.name != undefined)
                theItem.name = payLoad.name;
            //console.log(datamain + payLoad.id)
            //delete the old one
            //await KV.delete(datamain + payLoad.oldname + "]" + payLoad.id);
            //put the new one.
            //console.log(datamain  +"-"+user.user.secret+  payLoad.id)
            //console.log(theItem)
            await KV.put(datamain  +"-"+payLoad.level1id + "]"+payLoad.id, JSON.stringify(theItem));
            return new Response(JSON.stringify({ message: "Item updated", data: JSON.stringify(theItem) }), { status: 200 });
        } else
            return new Response(JSON.stringify({ error: "item not found" }), { status: 400 });

    }

}


export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    let payLoad;
    const contentType = request.headers.get('content-type')
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
        //console.log(payLoad)
    }
    //decode jwt
    let details = await decodeJwt(request.headers, env.SECRET)
    const KV = context.env.kvdata;
    //get user
    let user = await KV.get("user" + details.payload.username);
    user = JSON.parse(user)

    let theCheck = await KV.list({ prefix: datamain+"-"+payLoad.level1id  });
    //console.log(theCheck)
    let exists = 0;
    let id = uuid.v4();
    if (theCheck.keys.length > 0) {
        for (var i = 0; i < theCheck.keys.length; ++i) {
            let tmp = theCheck.keys[i].name.split(']')
            //console.log("new id :"+id)
            //console.log("list id :"+tmp[1])
            
            if (id == tmp[1])
            {
                //console.log('exists ')
                exists = 1;
            }
            else
            {
                //console.log('does not exist')
            }
        }
    }

    if (exists == 1)
        return new Response(JSON.stringify({ error: "data name already exists" }), { status: 400 });
    else {

        let fDate = getDate()
        let theData = dataSchema;
        theData.id = id;
        theData.name  = payLoad.name;
        theData.createdAt = fDate;
        //console.log(theData)
        //console.log(datamain + payLoad.name + "]" + id)
        await KV.put(datamain+"-"+payLoad.level1id+ "]" + id, JSON.stringify(theData));
        //await KV.put("content-"+id,JSON.stringify(contentSchema))
        return new Response(JSON.stringify({ message: "Item added", data: JSON.stringify(theData) }), { status: 200 });

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
    //todo : pass up the level 2 id for editing single items.
    let level2id="";
    let details = await decodeJwt(request.headers, env.SECRET)
    //set up the KV
    const KV = context.env.kvdata;
    //get user
    let user = await KV.get("user" + details.payload.username);
    user = JSON.parse(user)
    //console.log(user)
    //get the projects based on the name
    let theData = await KV.list({ prefix: datamain+"-"+level1id  });
    //console.log(datamain+"-"+level1id)
    //console.log(theData)
    let theDataArray = { data: [] }
    //console.log(datamain+"-"+dataid )
    if ((level2id != null) && (level2id != "")) {
        let pData = await KV.get(datamain+"-"+level1id +"]"+ level2id);
        theDataArray.data.push(JSON.parse(pData))
    } else {
        if (theData.keys.length > 0) {
            for (var i = 0; i < theData.keys.length; ++i) {
                //get the item
                let pData = await KV.get(theData.keys[i].name);
                pData = JSON.parse(pData)
                //console.log(pData)
                //debug for easy clean up
                //console.log(theData.keys[i].name);
                //await KV.delete(theData.keys[i].name);
                theDataArray.data.push(pData)
            }
        }
    }
    return new Response(JSON.stringify(theDataArray), { status: 200 });
}

export async function onRequestDelete(context) {

    /*
    todo

    */
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    //return new Response({message:"delete"}, { status: 200 });
    contentType = request.headers.get('content-type');
    if (contentType != null) {
        //get the login credentials
        payLoad = await request.json();
        //console.log(payLoad)
        let details = await decodeJwt(request.headers, env.SECRET)
        const KV = context.env.kvdata;
        let user = await KV.get("user" + details.payload.username);
        user = JSON.parse(user)
        //console.log(payLoad)
        //console.log(datamain  "]" + payLoad.deleteid)
        await KV.delete(datamain+"-"+payLoad.level1id+ "]" + payLoad.deleteid);
        return new Response(JSON.stringify({ message: "item deleted" }), { status: 200 });
    }
}