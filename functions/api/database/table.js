/*

This is a generic table manager it handles updates, inserts and deletes for any table. It also handles field and whole * returns

notes

It always returns a schema (useful for building add record form dynamically)
It does not delete it uses a field called isdeleted and this is what hides it from frontend, helps if a user is an idiot
It makes assumpations on our usual data strucutres to save some code if you want it more generic then you will have to remove these assumpations



*/


//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');
var uuid = require('uuid');
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

            //           UPDATE users SET name = ?1 WHERE id = ?2
            let theQuery = `UPDATE ${theData.table} SET `
            let theQueryValues = "";
            let theQueryWhere = "";
            //loop through the query data
            for (const key in theData) {
                //check it is not the table name
                //note : we could use a more elegant JSON structure and element this check
                if ((key != "table") && (key != "id")) {
                    //build the fields
                    if (theQueryValues == "")
                        theQueryValues = `${key} = '${theData[key]}' `
                    else
                        theQueryValues = theQueryValues + `,${key} = '${theData[key]}' `

                }
                //check for ad id and add a put.
                if (key == "id")
                    theQueryWhere = ` where id = '${theData[key]}'`
            }
            //compile the query
            theQuery = theQuery + theQueryValues + theQueryWhere;
            console.log(theQuery);
            const info = await context.env.DB.prepare(theQuery)
                .run();


            return new Response(JSON.stringify({ message: "User has been updated" }), { status: 200 });
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

//insert record
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
    //decode the token
    let theToken = await decodeJwt(request.headers, env.SECRET);
    //check they are an admin
    if (theToken.payload.isAdmin == 1) {
        //get the content type
        const contentType = request.headers.get('content-type')
        let theData;
        if (contentType != null) {
            //get the data
            theData = await request.json();
            //check if it is a user table and generate an API id
            let apiSecret = "";
            if (theData.table = "user")
                apiSecret = uuid.v4();
            //build the query
            let theQuery = `INSERT INTO ${theData.table} (`
            let theQueryFields = "";
            let theQueryValues = "";
            //loop through the query data
            for (const key in theData) {
                //check it is not the table name
                //note : we could use a more elegant JSON structure and element this check
                if (key != "table") {
                    //build the fields
                    if (theQueryFields == "")
                        theQueryFields = `'${key}'`
                    else
                        theQueryFields = theQueryFields + `,'${key}'`

                    //build the values
                    if (theQueryValues == "")
                        theQueryValues = `'${theData[key]}'`
                    else
                        theQueryValues = theQueryValues + `,'${theData[key]}'`
                }
            }
            //compile the query
            theQuery = theQuery + theQueryFields + " ) VALUES ( " + theQueryValues + " ); "
            //run the query
            const info = await context.env.DB.prepare(theQuery)
                .run();
            return new Response(JSON.stringify({ message: "User has been added" }), { status: 200 });

        }
        return new Response(JSON.stringify({ error: "server" }), { status: 400 });

    } else {
        return new Response(JSON.stringify({ error: "naughty, you are not an admin" }), { status: 400 });
    }
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
    let theToken = await decodeJwt(request.headers, env.SECRET);
    //check they are an admin
    if (theToken.payload.isAdmin == 1) {
        let query;
        let queryResults;
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the table id
        let tableId = searchParams.get('id');
        //get the table name
        let tableName = searchParams.get('tablename');
        //get the table name
        let fields = searchParams.get('fields');
        //set an array for the results
        let schemaResults = [];
        //create the data array we are going to send back to the frontend.
        let queryFin = {};
        //get the table schema
        query = context.env.DB.prepare(`PRAGMA table_info(${tableName});`);
        //get them all
        queryResults = await query.all();
        //we may only want a few fields and if so then they front end would have passed them up
        let tmp = fields.split(",");
        //check if there are no fields
        if (tmp.length == 1) {
            //set the schema
            queryFin.schema = queryResults.results;
        } else {
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
            //add cheks to the return array
            queryFin.schema = schemaResults;
        }
        //check if they also want the data
        if (searchParams.get('getOnlyTableSchema') == 0) {
            //build the where statement if they sent up and id
            let sqlWhere = "";
            if (tableId != undefined)
                sqlWhere = `where id = ${tableId}`

            //process the fields
            let tmp = fields.split(",");
            //not we dont want to show the isDeleted flag if there. 
            if (tmp.length == 1) {
                //console.log(`SELECT * from ${tableName} ${sqlWhere}`)
                query = context.env.DB.prepare(`SELECT * from ${tableName} ${sqlWhere} `);
            } else {
                let fields = "";
                for (var i = 0; i < tmp.length; ++i) {
                    if (fields == "")
                        fields = tmp[i];
                    else
                        fields = fields + "," + tmp[i]
                }
                //console.log(`SELECT ${fields} from ${tableName} ${sqlWhere}`)
                let sql = `SELECT ${fields} from ${tableName} ${sqlWhere}`
                query = context.env.DB.prepare(sql);
            }

            queryResults = await query.all();
            //console.log(queryResults.results)
            queryFin.data = queryResults.results;
        }



        return new Response(JSON.stringify(queryFin), { status: 200 });
    } else {
        return new Response(JSON.stringify({ error: "naughty, you are not an admin" }), { status: 400 });
    }
}