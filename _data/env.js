require('dotenv').config();


let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();

//get this one working  
//FACTORYCONTRACTABI:process.env.FACTORYCONTRACTABI,

module.exports = {
    YEAR: _YEAR,
    TITLE: "Building block ADMIN",
    APIURL: process.env.APIURL,
    ADMINURL: process.env.ADMINURL,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    SECRET: process.env.SECRET,
    LEVEL1NAME: "properties",
    LEVEL2NAME: "property",
    ITEMSDATAMAIN: "items",
    DASHBOARDSTRAP: "Welcome to the content editor.",
    CANCREATEACCOUNT: process.env.CANCREATEACCOUNT,
    COMPLEXPASSWORD: process.env.COMPLEXPASSWORD,
    RPCURL: process.env.RPCURL,
    BLOCKCHAINNETWORK: process.env.BLOCKCHAINNETWORK,
    FACTORYCONTRACTADDRESS: process.env.FACTORYCONTRACTADDRESS,
    CRYPTOSALT: process.env.CRYPTOSALT,
    BLOCKEXPLORER: process.env.BLOCKEXPLORER,
    NETWORK: process.env.NETWORK
}