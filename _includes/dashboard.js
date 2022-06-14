//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {



    let updateDashboard = (theSettings) => {
        theSettings = JSON.parse(theSettings);
        //console.log(theSettings)
        //if theSettings have not been added then show the prompt
        if (theSettings.btcaddress == "") {
            document.getElementById('paymentlinkcard').classList.add('d-none')
            document.getElementById('settingscard').classList.remove('d-none')
        }
        document.getElementById('generic-payment-link').innerHTML = `<a  href="${paymentWorkerUrl}?s=${theUser.secret}" target="_blank">View</a>`
        //show the page
        document.getElementById('showBody').classList.remove('d-none')
        //add the amount of data enteries they have added
        let theData = getData();
        if (theData != false)
            document.getElementById("dashboardcounter").innerHTML = theData.data.length;
        else
            document.getElementById("dashboardcounter").innerHTML = 0;
 
    }
    let SettingsDone = (res) => {
        storeSettings(res)
        //res = JSON.parse(res)
        //console.log(res.btcaddress);
        updateDashboard(res)
    }
    //get the theSettings
    let theSettings = getSettings();
    //the the user
    let theUser = getUser(1);
    //check if we have it store locally
    if ((theSettings != "") || (theSettings != undefined) || (theSettings == null)) {
        xhrcall(1, "api/settings/", "", "json", "", SettingsDone, token)
    } else {
        updateDashboard(theSettings);
    }
});