//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    document.getElementById('btn-edit').addEventListener('click', function() { //api call done
        let xhrDone = (res) => {
            res = JSON.parse(res)
            //store the settings
            storeSettings(res.data)
            //show the message
            showAlert(res.message, 1)
        }
        //check there is data to submit
        let bodyJson = {
            btcaddress: document.getElementById('inp-btcaddress').value,
            xpub: document.getElementById('inp-xpub').value,
            companyname: document.getElementById('inp-companyname').value
        }
        bodyJson = JSON.stringify(bodyJson);
        //call it
        xhrcall(4, `api/settings/`, bodyJson, "json", "", xhrDone, token);
    })

    //note: we could move this to app as its used in dashboard as well
    let settingsDone = (res) => {
        //if (update == 1)
        storeSettings(res)  
        res = JSON.parse(res)
        console.log(res.btcaddress)
        document.getElementById('inp-btcaddress').value = res.btcaddress
        document.getElementById('inp-xpub').value = res.xpub
        document.getElementById('inp-companyname').value = res.companyname
    }
    //get the settings
    let settings = getSettings();
    //check if we have it store locally
    if ((settings != "") && (settings != undefined)) {
        settingsDone(settings,0);
    }
    else
    {
        
        xhrcall(1, "api/settings/", "", "json", "", settingsDone, token)
    }
});
