/*
    todo:
    trap the gets / puts etc
    check the password is valid as well as the email 

*/
export async function onRequestPost(context) {
    try {
        //include the toekn
        const jwt = require('@tsndr/cloudflare-worker-jwt');
        //init
        const {
            request, // same as existing Worker API
            env, // same as existing Worker API
            params, // if filename includes [id] or [[path]]
            waitUntil, // same as ctx.waitUntil in existing Worker API
            next, // used for middleware or to fetch assets
            data, // arbitrary space for passing data between middlewares
        } = context;
        //get the content type
        const contentType = request.headers.get('content-type');
        //set a credentials var
        let credentials;
        //check if we have a content type
        if (contentType != null) {
            //get the login credentials
            credentials = await request.json();
            //console.log(credentials);
            //check they are valid (may be overkill)
            if ((credentials.identifier == undefined) || (credentials.password == undefined))
                return new Response(JSON.stringify({ error: "invalid login" }), { status: 400 });
        } else
            return new Response(JSON.stringify({ error: "invalid login" }), { status: 400 });

        //prepare the query
        const query = context.env.DB.prepare(`SELECT user.name,user.email,user.phone,user.id,userAccess.foreignId,user.apiSecret from user LEFT JOIN userAccess ON user.id = userAccess.userId where user.username = '${credentials.identifier}' and user.password = '${credentials.password}'`);
        //get the result
        //note : we could make this return first and not all 
        const queryResult = await query.all();
        //check the length
        if (queryResult.results.length > 0) {
            //set the user
            let user = queryResult.results[0];
            //sign the token
            const token = await jwt.sign({ password: credentials.password, username: credentials.identifier }, env.SECRET)
            // Verifing token
            const isValid = await jwt.verify(token, env.SECRET)
            //check it is true
            if (isValid == true) {
                return new Response(JSON.stringify({ "jwt": token, "user": { "username": credentials.identifier, "email": credentials.identifier, "secret": user.Apisecret } }), { status: 200 });
            } else {
                return new Response(JSON.stringify({ error: "invalid login" }), { status: 400 });

            }
        } else {
            return new Response(JSON.stringify({ error: "username  / password issue" }), { status: 400 });
        }
    
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}