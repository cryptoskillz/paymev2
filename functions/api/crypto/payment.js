var uuid = require('uuid');

    
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

    //get the search paramaters
    const { searchParams } = new URL(request.url);
    //get the id 
    let orderId = searchParams.get('orderId');
    //hold the query
    let query;

    let theSQL = `SELECT orderId,productName,amountUsd,amountCurrency,paid,paymentId from crypto_payments where orderId = '${orderId}'`
    //console.log(theSQL)
    //run it
    query = context.env.DB.prepare(theSQL);
    const result = await query.first();
    if (result) {
        //return the response
        return new Response(JSON.stringify(result), { status: 200 });

    } else {
        //return the response
        return new Response(JSON.stringify({ error: "order not found" }), { status: 400 });
    }


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

    //get the content type
    const contentType = request.headers.get('content-type')
    let theData;
    if (contentType != null) {
        theData = await request.json();
       
        //UPDATE users SET name = ?1 WHERE id = ?2
        let theQuery = `UPDATE crypto_payments SET "amount" = '${theData.amount}', "address" = '${theData.address}',"cryptoUsed"='${theData.cryptoUsed}', updatedAt= CURRENT_TIMESTAMP    WHERE orderId='${theData.orderId}';`
        console.log(theQuery);
        const info = await context.env.DB.prepare(theQuery).run();
        return new Response(JSON.stringify({ message: `payment updated` }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "server" }), { status: 400 });

}


//note 
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

    const contentType = request.headers.get('content-type')
    let theData;
    if (contentType != null) {
        //get the data
        theData = await request.json();
        const orderId = uuid.v4();
        const paymentId = uuid.v4();
        //build the query
        if (theData.key != theKey) {
            return new Response(JSON.stringify({ message: "record not added, it would be terrible opsec to tell you why it failed so good luck" }), { status: 400 });
        } else {
            let theQuery = `INSERT INTO "crypto_payments" ("userId","orderId","productName","amountUsd","amountCurrency","paymentId") VALUES (${theData.userId},'${orderId}','${theData.productName}','${theData.amount}','$','${paymentId}');`
            const info = await context.env.DB.prepare(theQuery).run();
            return new Response(JSON.stringify({ message: `${theData.table} has been added` }), { status: 200 });
        }


    }
    //general error
    return new Response(JSON.stringify({ error: "server" }), { status: 400 });
}