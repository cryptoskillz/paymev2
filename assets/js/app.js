let redirectUrl = ""; // hold the redcirect URL
let token;
let user;
let checkElement
var table // datatable

//create your data schema here for table rendering.
let dataSchema = '{ "id": "","paymentAddress":"", "name": "","amount":"0","paid":"0", "createdAt": "" }'
dataSchema = JSON.parse(dataSchema);
//add this to the settings page
let settingsSchema = '{"btcaddress":"","xpub":"","compnanyname":""}'
settingsSchema = JSON.parse(settingsSchema);

//TODO: replace this with plain js
(function($) {
    "use strict"; // Start of use strictß

    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };

        // Toggle the side navigation when window is resized below 480px
        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });

})(jQuery); // End of use strict

/*
START OF TABLE PROCESSING FUCNTIONS
*/

let getFormData = () => {
    let fields = Object.keys(dataSchema);
    let theJson = "{";
    let sumbmitIt = 1;
    for (var i = 0; i < fields.length; ++i) {
        if ((fields[i] != 'id') && (fields[i] != "createdAt")) {
            //console.log("inp-"+fields[i]);
            let theValue = document.getElementById('inp-' + fields[i]).value;
            if (theValue == "") {
                document.getElementById('error-' + fields[i]).classList.remove('d-none');
                sumbmitIt = 0;
            } else {

                if (theJson == "{")
                    theJson = theJson + `"${fields[i]}":"${theValue}"`
                else
                    theJson = theJson + `,"${fields[i]}":"${theValue}"`
            }

        }
    }
    theJson = theJson + "}"
    if (sumbmitIt == 1)
        return (theJson)
    else
        return (false)

}

let buildForm = (dataitem = "") => {
    let theJson;
    //check if a json object was passed and if not then use the default schema
    if (dataitem == "")
        theJson = dataSchema
    else
        theJson = dataitem
    //get the objects
    let tmpd = Object.values(theJson)
    //get the keys
    let fields = Object.keys(theJson)
    //loop through  the keys
    let inpHtml = "";

    let xpubHtml = "";
    for (var i = 0; i < fields.length; ++i) {
        //console.log(fields[i])
        if ((fields[i] != 'id') && (fields[i] != "createdAt")) {
            //check for a payment adresss
            if (fields[i] == "paymentAddress") {
                let settings = getSettings()
                settings = JSON.parse(settings)
                tmpd[i] = settings.btcaddress;
                if ((settings.xpub != undefined) && (settings.xpub != "") && (settings.xpub != null)) {
                    xpubHtml = ` <label><a href="javascript:generateFromXpub('${settings.xpub}')">Generate a new address from your xPub</a></label>`
                } else {
                    xpubHtml = "";
                }
            }
            else
            {
                xpubHtml = "";
            }

            inpHtml = inpHtml + `<div class="form-group" >
                                <label>${fields[i]}</label>
                                <input type="text" class="form-control form-control-user" id="inp-${fields[i]}" aria-describedby="emailHelp" placeholder="Enter ${fields[i]}" value="${tmpd[i]}">
                                ${xpubHtml}
                                <span class="text-danger d-none" id="error-${fields[i]}">${fields[i]} cannot be blank</span>  
                            </div>`
        }

    }
    //console.log(inpHtml)
    return (inpHtml)
}


/*
END OF TABLE PROCESSING FUNCTIONS
*/

let generateFromXpub = (xpub) => {
    let xhrDone = (res) => {
        //console.log(res)
        if (res.indexOf('error.html') > -1) {
            showAlert("Xpub generation error", 2)
        } else {
            res = JSON.parse(res)
            if ((res.address != undefined) && (res.address != "") && (res.address != null)) {
                document.getElementById('inp-paymentAddress').value = res.address
            }
        }
    }
    //call the xpub endpoint
    xhrcall(1, `api/xpub/?x=${xpub}`, "", "json", "", xhrDone, token)
}

/*
START OF LOCAL CACHE FUNCTIONS
*/

let clearCache = (clearUser = 0) => {
    window.localStorage.currentdataitem = ""
    window.localStorage.data = ""
    window.localStorage.settings = ""

    if (clearUser == 1) {
        window.localStorage.token = ""
        window.localStorage.user = ""
    }
}


//projects

let removeDataItem = (theId, debug = 0) => {
    let theItems = window.localStorage.data
    theItems = JSON.parse(theItems);
    for (var i = 0; i < theItems.data.length; ++i) {
        if (theItems.data[i].id == theId) {
            if (debug == 1) {
                console.log(theItems.data[i])
            }
            //delete theItems.data[i];
            theItems.data.splice(i, 1);
            //update the data
            window.localStorage.data = JSON.stringify(theItems);
            return (true);

        }
    }
    return (false)

}

/*
this function added the newly created item to the local application cache
*/
let addDataItem = (theData, debug = 0) => {
    //parse the response
    let theItems = window.localStorage.data
    theItems = JSON.parse(theItems);
    //parse the data
    theData = JSON.parse(theData);
    if (debug == 1) {
        console.log(theData)
        console.log(theData.data)

    }
    //add it to projects
    let tmp = JSON.parse(theData.data)
    theItems.data.push(tmp);
    window.localStorage.data = JSON.stringify(theItems)
    showAlert(theData.message, 1)
}

let storeData = (theData, debug = 0) => {
    //show debug info
    if (debug == 1) {
        console.log(theData)
    }
    window.localStorage.data = theData;

}

let updateData = (theData = "", debug = 0) => {
    let theItems = window.localStorage.data;
    if (theItems == undefined) {
        if (debug == 1)
            consolel.log("no items");
        return (false)
    } else {
        theItems = JSON.parse(theItems)
        if (debug == 1) {
            console.log(theItems)
        }
        for (var i = 0; i < theItems.data.length; ++i) {
            if (debug == 1) {
                console.log("checking " + theItems.data[i].id + " : " + theData.id)
                console.log(theItems.data[i])
            }
            if (theItems.data[i].id == theData.id) {
                if (debug == 1) {
                    console.log("Found the id " + theData.id)
                    console.log(theItems.data[i])
                }
                //update the project
                theItems.data[i] = theData;
                //update the data
                window.localStorage.currentdataitem = JSON.stringify(theData);
                window.localStorage.data = JSON.stringify(theItems);
                //return (theItems.data[i]);
            }
        }
    }
}

let getData = (theId = "", debug = 0) => {
    let theItems = window.localStorage.data;
    if ((theItems == undefined) || (theItems == "") || (theItems == null)) {
        if (debug == 1)
            consolel.log("no items");
        return (false)
    } else {
        theItems = JSON.parse(theItems)
        if (debug == 1) {
            console.log(theItems)
        }
        //console.log(data)
        if (theId != "") {
            for (var i = 0; i < theItems.data.length; ++i) {
                if (theItems.data[i].id == theId) {
                    if (debug == 1) {
                        console.log("foundit")
                        console.log(theItems.data[i])
                    }
                    //update the data
                    window.localStorage.currentdataitem = JSON.stringify(theItems.data[i]);
                    return (theItems.data[i]);
                }
            }
        } else {
            return (theItems)
        }
    }
}

let getCurrentDataItem = (debug = 0) => {
    if (debug == 1)
        console.log(window.localStorage.currentdataitem);
    let currentdataitem = JSON.parse(window.localStorage.currentdataitem)
    return (currentdataitem)

}

let storeSettings = (theData, debug = 0) => {
    //show debug info
    if (debug == 1) {
        console.log(theData)
    }
    window.localStorage.settings = theData;

}

let getSettings = (debug = 0) => {
    //show debug info
    if (debug == 1) {
        console.log(theData)
    }
    return (window.localStorage.settings)

}

let getUser = (parseIt = 0, debug = 0) => {
    //show debug info
    if (debug == 1) {
        console.log(theData)
    }
    let tmp = window.localStorage.user;
    if (parseIt == 1)
        tmp = JSON.parse(tmp)
    return (tmp)

}




/*
END OF LOCAL CACHE FUNCTIONS
*/

/*
START OF TABLE FUNCTIONS
*/


let deleteId = 0;
let tableRowId = 0;
let deleteMethod = "";

checkElement = document.getElementById("confirmation-modal-delete-button");

if (typeof(checkElement) != 'undefined' && checkElement != null) {
    document.getElementById('confirmation-modal-delete-button').addEventListener('click', function() {
        $('#confirmation-modal').modal('toggle')
        let xhrDone = (res) => {
            // console.log(deleteMethod)
            //parse the response
            showAlert('Item has been deleted', 1)
            table.row('#' + tableRowId).remove().draw()
            console.log(deleteMethod)
            console.log('api/' + dataMainMethod + '/')

            if (deleteMethod == 'api/' + dataMainMethod + '/') {
                removeDataItem(deleteId)

            }
            if (deleteMethod == 'api/' + dataItemsMainMethod + '/') {
                removeDataItems(deleteId, 0)

            }

        }
        let theItem = getData(deleteId);
        let bodyobj = {
            deleteid: deleteId,
            name: theItem.name
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the create account endpoint
        xhrcall(3, `${deleteMethod}`, bodyobjectjson, "json", "", xhrDone, token)

    })
}


let deleteTableItem = (dId, tId, method) => {
    deleteId = dId;
    tableRowId = tId;
    deleteMethod = method;
    $('#confirmation-modal').modal('toggle')
}





/*
END OF TABLE FUNCTIONS
*/

//this fucntion validates an email address.
let validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

let goBack = () => {
    history.back();
}

let showAlert = (message, alertType, timeoutBool = 1) => {
    let alertEl;
    //set the alert type
    if (alertType == 1)
        alertEl = document.getElementById('accountsSuccess');
    if (alertType == 2)
        alertEl = document.getElementById('accountsDanger');
    //set the message
    alertEl.innerHTML = message
    //remove the class
    alertEl.classList.remove('d-none');
    //clear it after 5 seconds
    if (timeoutBool == 1)
        alertTimeout = setTimeout(function() { alertEl.classList.add('d-none') }, 5000);


}

/* 

start of global account stuff

Ideally this should live in accounts.js but seeing as require it on every page we put it here instead otherwise we would have
to include accounts.js and app.js in every page

*/

let getToken = () => {
    token = window.localStorage.token;
    if ((token != "") && (token != undefined)) {
        return (token);
    } else {
        return ("")
    }
}


let logout = () => {
    alert('to do logout')
}


let checkLogin = () => {
    //check if it is not a login page
    if ((window.location.pathname == "/create-account") || (window.location.pathname == "/create-account/") || (window.location.pathname == "login") || (window.location.pathname == "/login/") || (window.location.pathname == "/forgot-password") || (window.location.pathname == "/forgot-password/")) {
        //window.location = '/'
    } else {
        //get the user object
        let tmpUser = window.localStorage.user
        //check it exists
        if (tmpUser != undefined) {
            //decode the json
            user = JSON.parse(window.localStorage.user);
            //check the user is logged in some one could spoof this so we could do a valid jwt check here 
            //but i prefer to do it when we ping the api for the data for this user. 
            if (user.loggedin != 1) {
                window.location = '/login'
            } else {
                //set the jwt and user
                getToken();
                checkElement = document.getElementById("user-account-header");
                if (typeof(checkElement) != 'undefined' && checkElement != null) {
                    if ((user.username != "") && (user.username != undefined))
                        document.getElementById('user-account-header').innerHTML = user.username
                    else
                        document.getElementById('user-account-header').innerHTML = user.email
                }
            }
        } else {
            window.location = '/login/'
        }

    }
}


/* 
end of global account stuff
*/


let getUrlParamater = (param) => {
    let searchParams = new URLSearchParams(window.location.search)
    let res = searchParams.has(param) // true
    if (res != false)
        return (searchParams.get(param))
    else
        return ("");

}



//this function makes the XHR calls.
let xhrcall = (type = 1, method, bodyObj = "", setHeader = "", redirectUrl = "", callback = '', auth = "") => {
    //debug
    //console.log(apiUrl)
    //console.log(bodyObj)
    //console.log(method)
    //console.log(callback)

    /*
      Note if we are not using strai and have a custom URL we can change it here like wise if we want to use 2 we can check the method to select the correct base url
    */

    checkElement = document.getElementById("spinner");

    if (typeof(checkElement) != 'undefined' && checkElement != null) {
        document.getElementById("spinner").classList.remove("d-none");
    }
    let url = apiUrl + method;
    //store the type
    let xhrtype = '';
    switch (type) {
        case 0:
            xhrtype = 'POST';
            break;
        case 1:
            xhrtype = 'GET';
            break;
        case 2:
            xhrtype = 'PATCH';
            break;
        case 3:
            xhrtype = 'DELETE';
            break;
        case 4:
            xhrtype = 'PUT';
            break;
        default:
            xhrtype = 'GET';
            break;
    }

    //set the new http request
    let xhr = new XMLHttpRequest();
    xhr.open(xhrtype, url);

    //set the header if required
    //note (chris) this may have to be a switch
    if (setHeader == "json")
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (auth != "")
        xhr.setRequestHeader("Authorization", "Bearer " + auth);
    //send the body object if one was passed
    if (bodyObj !== '') {
        xhr.send(bodyObj);
    } else {
        xhr.send();
    }
    //result
    //todo (chris) make this eval back to a done function
    xhr.onload = function() {
        checkElement = document.getElementById("confirmation-modal-delete-button");

        if (typeof(checkElement) != 'undefined' && checkElement != null) {
            document.getElementById("spinner").classList.add("d-none");
        }
        //check if its an error
        let res = xhr.response;
        let errorMessage = "";

        //check for errors
        if ((xhr.status == 400) || (xhr.status == 403) || (xhr.status == 500)) {
            //process the response
            res = JSON.parse(res)
            errorMessage = res.error
            if (errorMessage == "")
                errorMessage = "Server Error"
        }
        if (xhr.status == 405) {
            errorMessage = res
        }

        if (xhr.status == 205) {
            errorMessage = res
        }

        if (errorMessage != "") {
            showAlert(errorMessage, 2)
        }


        //check if it was ok.
        if (xhr.status == 200) {
            //check if a redirecr url as passed.
            if (redirectUrl != "") {
                window.location = redirectUrl
            } else {
                //console.log(res)
                //res = JSON.parse(res)
                //console.log(res)
                eval(callback(res));
            }

        }

    }
};

checkLogin()