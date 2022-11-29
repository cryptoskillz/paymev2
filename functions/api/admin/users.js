/*
    This endpoint deals with users
    note: we could move login into here and  possible register

*/
//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');

//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}


//set the UUID 
var uuid = require('uuid');
export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    //get the token
    let theToken = await decodeJwt(request.headers, env.SECRET);
    if (theToken.payload.isAdmin == 1) {
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the user id
        let userId = searchParams.get('id');
        //run the query
        //we want all the user (excluding ourselves) that we manage, it is unlikley we will have another admin id but we may go multi tenent at some point
        const query = context.env.DB.prepare(`SELECT * from user where id != '${userId}' and adminId='${userId}'`);
        const queryResults = await query.all();
        return new Response(JSON.stringify(queryResults), { status: 200 });
    } else {
        return new Response(JSON.stringify({ error: "naughty, you are not an admin" }), { status: 400 });
    }

}