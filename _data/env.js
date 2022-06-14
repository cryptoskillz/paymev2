require('dotenv').config();


let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();
module.exports = {
    YEAR: _YEAR,
    TITLE: "PAYME ADMIN",
    APIURL: process.env.API,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    SECRET: process.env.SECRET,
    DATAMAIN: "data",
    ITEMSDATAMAIN: "items",
    DASHBOARDSTRAP: "Welcome to the content editor.",
    PAYWORKERURL:process.env.PAYWORKERURL
}