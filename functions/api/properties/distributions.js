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
    let id = searchParams.get('id');
    //check if there is a property id.
    if (id == null)
        return new Response(JSON.stringify({ error: "no property id" }), { status: 400 });

    const costs = context.env.DB.prepare(`SELECT SUM(amountInternational) as total from rental_cost where propertyId = '${id}'`);
    const costResults = await costs.first();
    const payments = context.env.DB.prepare(`SELECT SUM(amountInternational) as total from rental_payment where propertyId = '${id}'`);
    const paymentResults = await payments.first();
    const dist = context.env.DB.prepare(`SELECT SUM(amountInternational) as total from property_distribution where propertyId = '${id}'`);
    const distResults = await dist.first();
    //get the token for the property
    const token = context.env.DB.prepare(`SELECT * from property_token where propertyId = ${id}`);
    const tokenResult = await token.first();
    //get the property owners
    const owners = context.env.DB.prepare(`SELECT property_owner.id,property_owner.tokenAmount,user.name,user.email,user.cryptoAddress from property_owner LEFT JOIN user ON property_owner.userId = user.id where property_owner.propertyTokenId = ${tokenResult.id}`);
    const ownersResult = await owners.all();
    let totalLeft = (paymentResults.total,+costResults.total)-distResults.total;
    let result = { "totalCosts": costResults.total, "totalPayments": paymentResults.total,"totalDistributions":distResults.total,"totalLeft":totalLeft, 'token': tokenResult, "owners": ownersResult.results }
    return new Response(JSON.stringify(result), { status: 200 });

}