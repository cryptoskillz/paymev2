async function getCryptocurrencyPrice(cryptocurrency) {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrency}&vs_currencies=usd`);
    const data = await response.json();
    return data[cryptocurrency].usd;
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
    try {
        const { searchParams } = new URL(request.url);
        //get the tables cryptocurrencies 
        const cryptocurrencies = searchParams.get('cryptocurrencies');
        const fiatcurrencies = searchParams.get('fiatcurrencies');
        let theUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrencies}&vs_currencies=${fiatcurrencies}`
        const theResponse = await fetch(theUrl);
        const price = await theResponse.json();
        return new Response(JSON.stringify(price), { status: 200 });
    } catch (error) {
        theJson = {"error":`${error}`,"url":`${theUrl}`,"response":`${theResponse}`}
        return new Response(JSON.stringify(theJson), { status: 400 });
    }

}