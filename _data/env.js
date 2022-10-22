require('dotenv').config();


let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();
module.exports = {
    YEAR: _YEAR,
    TITLE: "YACE ADMIN",
    APIURL: process.env.API,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    SECRET: process.env.SECRET,
    LEVEL1NAME: "site",
    LEVEL2NAME: "page",
    ITEMSDATAMAIN: "items",
    DASHBOARDSTRAP: "Welcome to the content editor."
}