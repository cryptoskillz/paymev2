//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');

//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

export async function onRequestPut(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //decode the token
    let theToken = await decodeJwt(request.headers, env.SECRET);
    //check they are an admin
    if (theToken.payload.isAdmin == 1) {
        //get the content type
        const contentType = request.headers.get('content-type')
        let theData;
        if (contentType != null) {
            theData = await request.json();
            let theFields = theData.fields;
            let theValues = theData.values;
            //debug
            console.log("debug")
            console.log(theData);
            console.log(`UPDATE ${theData.tableName} SET ${theFields} = ${theValues} WHERE id = ${theData.id}`)
            const info = await context.env.DB.prepare(`UPDATE ${theData.tableName} SET ${theFields} = ${theValues}  WHERE id = ${theData.id}`)
                .run()
            return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
        }
        return new Response(JSON.stringify({ error: "server" }), { status: 400 });
    } else {
        return new Response(JSON.stringify({ error: "naughty, you are not an admin" }), { status: 400 });
    }
}

export async function onRequestDelete(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //decode the token
    let theToken = await decodeJwt(request.headers, env.SECRET);
    //check they are an admin
    if (theToken.payload.isAdmin == 1) {
        //get the content type
        const contentType = request.headers.get('content-type')
        let theData;
        if (contentType != null) {
            theData = await request.json();
            //debug
            //console.log("debug")
            //console.log(theData);
            //console.log(`UPDATE ${theData.tableName} SET isDeleted = 1 WHERE id = ${theData.id}`)
            const info = await context.env.DB.prepare(`UPDATE ${theData.tableName} SET isDeleted = ?1 WHERE id = ?2`)
                .bind(1, theData.id)
                .run();
            return new Response(JSON.stringify({ status: "ok" }), { status: 200 });

        }
        return new Response(JSON.stringify({ error: "server" }), { status: 400 });

    } else {
        return new Response(JSON.stringify({ error: "naughty, you are not an admin" }), { status: 400 });
    }
}

export async function onRequestPost(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    return new Response(sql, { status: 200 });
}

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
    let theToken = await decodeJwt(request.headers, env.SECRET);
    //check they are an admin
    if (theToken.payload.isAdmin == 1) {
        let query;
        let queryResults;
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the table name
        let tableName = searchParams.get('tablename');
        //get the table name
        let fields = searchParams.get('fields');
        //set an array for the results
        let schemaResults=[];
        //check if we want the table schema or table results
        if (searchParams.get('getTableSchema') == 1) {
            //get the table schema
            query = context.env.DB.prepare(`PRAGMA table_info(${tableName});`);
            //get them all
            queryResults = await query.all();
            //we may only want a few fields and if so then they front end would have passed them up
            let tmp = fields.split(",");
            //check if there are no fields
            if (tmp.length == 1)
            {
                //return the query results (the full schema)
               return new Response(JSON.stringify(queryResults.results), { status: 200 });
            }
            else
            {
                //loop through the fields that where passed up
                for (var i = 0; i < tmp.length; ++i) {
                    //loop through the query results
                    for (var i2 = 0; i2 < queryResults.results.length; ++i2) {
                        //check if it is a match
                        if (queryResults.results[i2].name == tmp[i])
                            //add it to the array
                            schemaResults.push(queryResults.results[i2])
                    }
                }

            }
            //return the query result
            return new Response(JSON.stringify(schemaResults), { status: 200 });
            
        } else {
            
            let tmp = fields.split(",");
            if (tmp.length == 1) {
                query = context.env.DB.prepare(`SELECT * from ${tableName} where isDeleted = 0`);
            } else {
                let fields = "";
                for (var i = 0; i < tmp.length; ++i) {
                    if (fields == "")
                        fields = tmp[i];
                    else
                        fields = fields + "," + tmp[i]
                }
                let sql = `SELECT ${fields} from ${tableName} where isDeleted = 0`
                query = context.env.DB.prepare(sql);
            }

            queryResults = await query.all();
        }
        return new Response(JSON.stringify(queryResults.results), { status: 200 });
    } else {
        return new Response(JSON.stringify({ error: "naughty, you are not an admin" }), { status: 400 });
    }
}