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
    //get the table name
    let tablename = searchParams.get('tablename');
    //get the table name
    let name = searchParams.get('name');
    //get the table description
    let description = searchParams.get('description');
    //get the table amount
    let amount = searchParams.get('amount');
    //get the table date paid
    let date_paid = searchParams.get('date_paid');
    //get the table rental id
    let rentalId = searchParams.get('rentalId');    
    //get the table property id
    let propertyId = searchParams.get('propertyId');    
    let sql = `INSERT INTO "${tablename}" ("name","description","amount","date_paid","rentalId","propertyId") VALUES ('${name}','${description}',${amount},'${date_paid}',${rentalId},${propertyId});`

   
    return new Response(sql, { status: 200 });
}