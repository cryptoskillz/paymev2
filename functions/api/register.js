/*
    this function creates a new user

*/
//settings schema
let settingsSchema = '{"btcaddress":"","xpub":"","companyname":""}'
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
    const contentType = request.headers.get('content-type')
    let registerData;
    if (contentType != null) {
        //get the login credentials
        registerData = await request.json();
        //set up the KV
        const KV = context.env.kvdata;
        //see if the user exists
        let secretid = uuid.v4();
        let json = JSON.stringify({ "jwt": "", "user": {  "username": registerData.username, "email": registerData.username,"password":registerData.password,"secret":secretid,datacount:"0" } })
        //check if user exist
        const user = await KV.get("user" + registerData.username);
        if (user == null)
        {
            //create a KV with the username and secret that we can use for any of the export functions.  If you are not going to have give you users API access then you will 
            //not require this.
            //await KV.put("user" + registerData.username+"]"+secretid,  JSON.stringify({username:registerData.username}));
            await KV.put("user" + registerData.username, json);
            //create the settings file
            await KV.put("settings" + secretid, settingsSchema);
            return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
        }
        else
            return new Response(JSON.stringify({ error: "email exists" }), { status: 400 });

    }
    else
        return new Response(JSON.stringify({ error: "register error" }), { status: 400 });
}