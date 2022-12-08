require('dotenv').config();


let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();
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
    CONTRACTURL: process.env.CONTRACTURL,
    BLOCKCHAINNETWORK: process.env.BLOCKCHAINNETWORK,
    CONTRACTADDRESS: process.env.CONTRACTADDRESS,
    CRYPTOSALT: process.env.CRYPTOSALT
}