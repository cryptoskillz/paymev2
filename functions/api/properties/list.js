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
    //get the property
    const property = context.env.DB.prepare(`SELECT * from property`);
    const propertyresult = await property.all();
    return new Response(JSON.stringify(propertyresult.results), { status: 200 });
}