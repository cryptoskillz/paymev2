async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json());
    } else if (contentType.includes('application/text')) {
        return response.text();
    } else if (contentType.includes('text/html')) {
        return response.text();
    } else {
        return response.text();
    }
}

export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    try {
        const { searchParams } = new URL(request.url)
        //set a limit
        let limit = 1;
        //get the secret
        let xpub = searchParams.get('x');
        //https://xpubaas.herokuapp.com/xpub/?xpub=xpub6CatWdiZiodmUeTDp8LT5or8nmbKNcuyvz7WyksVFkKB4RHwCD3XyuvPEbvqAQY3rAPshWcMLoP2fMFMKHPJ4ZeZXYVUhLv1VMrjPC7PW6V&network=ffff&biptype=84&newaddresscheck=1&startaddress=0&numberofaddresses=10&randomaddress=0
        //https://xpubaas.herokuapp.com/xpub/?xpub=xpub67yMUMbr2gAnBgnYvXcbJq8iUBe54Ev2dbUYKGN8jGY21AHJFeR7mnZqhbUNze4UbpRE9S1fWvmFCsFN4EvU1rWdqegW7dzoa7vZmYCLAAy&network=ffff&biptype=84&newaddresscheck=1&startaddress=0&numberofaddresses=10&randomaddress=0
        let url = `https://xpubaas.herokuapp.com/xpub/?xpub=${xpub}&network=ffff&biptype=84&newaddresscheck=1&startaddress=0&numberofaddresses=10&randomaddress=1`
        //console.log(url)
        const response = await fetch(url);
        const results = await gatherResponse(response);
        //console.log(results)
        return new Response(results, { status: 200 });


    } catch (error) {
        return new Response(error, { status: 400 });
    }
}