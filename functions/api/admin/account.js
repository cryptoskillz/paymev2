/*
    This endpoint deals with users
    note: we could move login into here and  possible register

*/

let createUser = (registerData) => {

}
//set the UUID 
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
        registerData = await request.json();
        //check if we want to create a user
        if (registerData.action == 1)
        {
            const query = context.env.DB.prepare(`SELECT COUNT(*) as total from user where email = '${registerData.email}'`);
            const queryResult = await query.first();
            if (queryResult.total == 0) {
                let apiSecret = uuid.v4();
                const info = await context.env.DB.prepare('INSERT INTO user (username, email,password,apiSecret,confirmed,blocked,isAdmin) VALUES (?1, ?2,?3,?4,?5,?6,?7)')
                    .bind(registerData.username, registerData.email, registerData.password, apiSecret, 0, 0, 0)
                    .run()

                if (info.success == true)
                    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
                else
                    return new Response(JSON.stringify({ error: "error registering" }), { status: 400 });
            } else {
                return new Response(JSON.stringify({ error: "email already exists" }), { status: 400 });
            }
        }
    }


}