
//set data main to whatever is in env for consistency
const datamain = "data2";

export async function onRequestGet(context) {
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
    let level1id = searchParams.get('id');
    //set up the KV
    const KV = context.env.kvdata;
    let theData = await KV.list({ prefix: datamain+"-"+level1id  });
    //console.log(theData)
    let theDataArray = { data: [] }
    //loop through the data
    if (theData.keys.length > 0) {
        for (var i = 0; i < theData.keys.length; ++i) {
            let pData = await KV.get(theData.keys[i].name);
            pData = JSON.parse(pData)
            theDataArray.data.push(pData)
        }
    }
    return new Response(JSON.stringify(theDataArray), { status: 200 });

    
}