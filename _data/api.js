/*
    Note we dont actually call any API as we dont actually build any static pages with 11.ty this is here incase we want to extend it in the 
    future. 
*/
require('dotenv').config();
const superagent = require('superagent');

//async function to get the posts
getData = async () => {
    let method = "test-endpoint/"
    var res = await superagent.get(`${process.env.API}${method}`).query({});
    return (res.body)
}


module.exports = async () => {
    //set an array 
    let resArray = []
    //call the get get Data fuction
    //if (resArray.length === 0) resArray = await getData();

    return {
        resArray: resArray
    }

}