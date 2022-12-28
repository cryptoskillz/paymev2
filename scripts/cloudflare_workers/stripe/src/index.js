/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
//http://127.0.0.1:8787/?orderId=0d4e2f3d-1a24-919c-e8ef-915b4e598d7f&type=payment&url=http://localhost:8788&amount=5000&name=thename&network=test
//https://stripe.cryptoskillz.workers.dev/?orderId=0d4e2f3d-1a24-919c-e8ef-915b4e598d7f&type=payment&url=http://localhost:8788&amount=5000&name=thename&network=test
const Stripe = require("stripe");

async function handleRequest(request) {

     const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const network = searchParams.get('network');
        const name = searchParams.get('name');
        const amount = searchParams.get('amount');
        const url = searchParams.get('url');
        
        //let stripeApiKey = "";
        if (network == "test")
            stripeApiKey = STRIPEAPIKEYTEST
        else
            stripeApiKey =STRIPEAPIKEYLIVE
        const stripe = Stripe(stripeApiKey, {
            httpClient: Stripe.createFetchHttpClient()
        });

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

        return Response.redirect(session.url)
}

addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});

