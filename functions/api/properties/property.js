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
    let fDate = getDate()
    let theData = dataSchema;

    const info = await context.env.DB.prepare('INSERT INTO property (name ) VALUES (?1)')
                    .bind( payLoad.name )
                    .run()

	console.log(info);


    return new Response(JSON.stringify({ message: "Item added", data: JSON.stringify(theData) }), { status: 200 });


}