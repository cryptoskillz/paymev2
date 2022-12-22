require('dotenv').config();


let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();

//get this one working  
//FACTORYCONTRACTABI:process.env.FACTORYCONTRACTABI,

module.exports = {
    YEAR: _YEAR,
    TITLE: "Payme",
    APIURL: process.env.APIURL,
    ADMINURL: process.env.ADMINURL,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    SECRET: process.env.SECRET,
    LEVEL1NAME: "invoices",
    LEVEL2NAME: "invoice",
    ITEMSDATAMAIN: "items",
    DASHBOARDSTRAP: "Welcome to the content editor.",
    CANCREATEACCOUNT: process.env.CANCREATEACCOUNT,
    COMPLEXPASSWORD: process.env.COMPLEXPASSWORD,
    RPCURL: process.env.RPCURL,
    BLOCKCHAINNETWORK: process.env.BLOCKCHAINNETWORK,
    BLOCKEXPLORER: process.env.BLOCKEXPLORER,
    NETWORK: process.env.NETWORK,
    CHAINLINKTESTBTC: process.env.CHAINLINKTESTBTC,
    CHAINLINKTESTETH: process.env.CHAINLINKTESTETH,
    CHAINLINKTESTBNB: process.env.CHAINLINKTESTBNB,
    CHAINLINKMAINBTC: process.env.CHAINLINKMAINBTC,
    CHAINLINKMAINETH: process.env.CHAINLINKMAINETH,
    CHAINLINKMAINBNB: process.env.CHAINLINKMAINBNB,
}