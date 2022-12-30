//http://127.0.0.1:8787/?orderId=0d4e2f3d-1a24-919c-e8ef-915b4e598d7f&type=payment&url=http://localhost:8788&amount=5000&name=thename&network=test
//https://stripe.cryptoskillz.workers.dev/?orderId=0d4e2f3d-1a24-919c-e8ef-915b4e598d7f&type=payment&url=http://localhost:8788&amount=5000&name=thename&network=test
const Stripe = require("stripe");

async function handleRequest(request) {
    //get the url paramaters
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const network = searchParams.get('network');
    const name = searchParams.get('name');
    const amount = searchParams.get('amount');
    const url = searchParams.get('url');

    //set the correct network 
    if (network == "test")
        stripeApiKey = STRIPEAPIKEYTEST
    else
        stripeApiKey = STRIPEAPIKEYLIVE
    const stripe = Stripe(stripeApiKey, {
        httpClient: Stripe.createFetchHttpClient()
    });

    //create a session
    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: name,
                },
                unit_amount: amount,
            },
            quantity: 1,
        }],
        payment_method_types: [
            'card',
        ],
        mode: 'payment',
        success_url: `${url}payment?orderId=${orderId}&payment=success`,
        cancel_url: `${url}payment?orderId=${orderId}&payment=cancel`,
    });
    //redirect
    return Response.redirect(session.url)
}

addEventListener('fetch', event => {
        
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});