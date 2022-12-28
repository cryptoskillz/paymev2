const Stripe = require('stripe')

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

    const { searchParams } = new URL(request.url);
    //get the tables cryptocurrencies 
    const orderId = searchParams.get('orderId');
    let query;
    let theSQL = `SELECT name,amountUsd,amountCurrency,paid,paymentId,useTimer from crypto_payments where orderId = '${orderId}'`
    //console.log(theSQL)
    //run it
    query = context.env.DB.prepare(theSQL);
    const result = await query.first();

    let stripeApiKey = "";
    let returnUrl = ""
    if (context.env.NETWORK == "testnet")
    {
        returnUrl = context.env.STRIPERETURNURLTEST
        stripeApiKey = context.env.STRIPEAPIKEYTEST;
    }
    else
    {
        returnUrl = context.env.STRIPERETURNURLMAIN
        stripeApiKey = context.env.STRIPEAPIKEYMAIN;
    }


    const stripe = Stripe(stripeApiKey, {
        httpClient: Stripe.createFetchHttpClient()
    });

    let tmpAmount = result.amountUsd+'00';

    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: result.name,
                },
                unit_amount: tmpAmount,
            },
            quantity: 1,
        }],
        payment_method_types: [
            'card',
        ],
        mode: 'payment',
        success_url: `${returnUrl}/payment/?orderId=${orderId}&payment=success`,
        cancel_url: `${returnUrl}/?orderId=${orderId}&payment=cancel`,
    });

    return Response.redirect(session.url)


}