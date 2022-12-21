async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json());
    }
    return response.text();
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
    let theUrl = "";
    let theResponse;
    let theJson;
    let results;
    try {
        const { searchParams } = new URL(request.url);
        //get the tables cryptocurrencies 
        const cryptocurrencies = searchParams.get('cryptocurrencies');
        const fiatcurrencies = searchParams.get('fiatcurrencies');
        theUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrencies}&vs_currencies=${fiatcurrencies}`
        theResponse = await fetch(theUrl);
        //price = await theResponse.json();
        results = await gatherResponse(theResponse);
        return new Response(results, { status: 200 });

    } catch (error) {
        theJson = { "url": `${theUrl}`, "response": `${results}` }
        return new Response(JSON.stringify(theJson), { status: 400 });
    }

}