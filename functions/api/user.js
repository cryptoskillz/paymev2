/*
    This endpoin updates a user
    note: we could move login into here and  possible register

*/
var uuid = require('uuid');
export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //set a valid boolean
    let valid = 1;
    //get the content type from the headers
    const contentType = request.headers.get('content-type')
    let registerData;
    //cgeck  we got the correct headers
    if (contentType != null) {
        //get the login credentials
        userData = await request.json();
        //set up the KV
        const KV = context.env.kvdata;
        //see if the user exists
        let secretid = uuid.v4();
        let json = JSON.stringify({ "jwt": "", "user": {  "username": userData.username, "email": userData.username,"secret":secretid,datacount:userData.datacount } })
        //check if user exist
        const user = await KV.get("username" + userData.username);
        if (user == null)
        {
            await KV.put("username" + userData.username, json);
            return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
        }
        else
            return new Response(JSON.stringify({ error: "user exists" }), { status: 400 });

    }
    else
        return new Response(JSON.stringify({ error: "register error" }), { status: 400 });
}