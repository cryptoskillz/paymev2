//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');
//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}
//get the records
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
    //get the token
    let theToken = await decodeJwt(request.headers, env.SECRET);
    //get the search paramaters
    const { searchParams } = new URL(request.url);
    //get the tables
    let theData = searchParams.get('theData');
    //get the id 
    let recordId = searchParams.get('id');
    //get the tables
    let theTables = theData.split(',');
    //hold the SQL
    let theSQL = "";
    //hold the query
    let query;
    //hold the results for the lookups
    let theResults = [];
    //loop through the tables
    for (var i = 0; i < theTables.length; ++i) {
        //build the SQL
        theSQL = `SELECT id,name from ${theTables[i]} where propertyId = '${recordId}'`
        //run it
        query = context.env.DB.prepare(theSQL);
        let queryResults = await query.all();
        //store the results
        let theJson = {"table":theTables[i],"theData": queryResults.results}
        theResults.push(theJson)
    }
    ///return the response
    return new Response(JSON.stringify(theResults), { status: 200 });

}