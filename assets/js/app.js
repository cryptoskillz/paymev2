let redirectUrl = ""; // hold the redcirect URL
let token;
let user;
var table // datatable

let dataSchema = '{ "id": "", "name": "", "address 1": "", "address 2": "", "address 3": "", "address 4": "", "address 5": "", "address 6": "","bathrooms":"","bedrooms":"","local_currency":"","imageurl":"","taxes":"","suggested_rental_price":"","cost":"","tokenId":"","rentalId":"", "createdAt": "" }'
dataSchema = JSON.parse(dataSchema);
//add this to the settings page
let settingsSchema = '{"btcaddress":"","xpub":"","compnanyname":""}'
settingsSchema = JSON.parse(settingsSchema);

//TODO: replace this with plain js
(function($) {
    "use strict"; // Start of use strict

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

//this function checks if an element exits
let checkElement = (element) => {
    let checkedElement = document.getElementById(element);
    //If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof(checkedElement) != 'undefined' && checkedElement != null) {
        return (true)
    } else {
        return (false)
    }
}

/*
START OF TABLE PROCESSING FUCNTIONS
*/

let getFormData = (smartValidate = 0) => {
    //clear the errors
    let theErrors = document.getElementsByClassName('text-danger')
    for (var i = 0; i < theErrors.length; ++i) {
        theErrors[i].classList.add("d-none");
    }
    //build the json
    let theJson = "{";
    //get the form elements (this is built by the checkElement function )
    let theElements = document.getElementsByClassName('form-control-user');
    //loop through the elements
    let valid = 1;
    for (var i = 0; i < theElements.length; ++i) {
        //get the element name
        let elementName = theElements[i].id;
        //check if its blank
        if (theElements[i].value == "") {
            //set the error id
            let errorId = elementName.replace("inp", 'error');
            //remove the error
            document.getElementById(errorId).classList.remove('d-none');
            //set valid to false
            valid = 0;
        }
        //check if we want to smart validation 
        if (smartValidate == 1) {
            //chekc if the field type is an email
            if (elementName == "inp-email") {
                console.log("validate email")
            }

            //check if its an integer field

            //check if its a password field 


        }
        //build the json
        let sqlName = elementName.replace("inp-", "")
        if (theJson == "{")
            theJson = theJson + `"${sqlName}":"${theElements[i].value}"`
        else
            theJson = theJson + `,"${sqlName}":"${theElements[i].value}"`
    }
    let theTable = document.getElementById('formTableName').value;
    //check is isAdmin and the it is one of the tables we want to add attach to the admin
    if ((user.isAdmin == 1) && (theTable == "user")) {
        theJson = theJson + `,"table":"${theTable}"`
        //note we should check there is an admin Id.
        theJson = theJson + `,"adminId":"${user.id}" }`
    } else {
        theJson = theJson + `,"table":"${theTable}" }`
    }
    console.log(theJson);
    if (valid == 1)
        return (theJson)
    else
        return (false)

}



/*
This function handles the input of a create form
*/
if (checkElement("btn-create") == true) {
    document.getElementById('btn-create').addEventListener('click', function() {
        //process the API call
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res);
            //show the message
            showAlert(res.message, 1, 0);
            //clear the header
            document.getElementById('data-header').innerHTML = "";
            //hide the create button
            //note : we could also clear the fields and let them add another if it flows better.
            document.getElementById('btn-create').classList.add("d-none");

        }
        //get the form data
        let bodyJson = getFormData(1);
        //check we have valid data to submit
        if (bodyJson != false) {
            //post the record
            xhrcall(0, `api/database/table/`, bodyJson, "json", "", xhrDone, token)
        }

    })
}

/*
This funtion handles the building of the form
*/

let buildFormElement = (theData, theValue = "") => {
    //captalise the element
    const theTitle = theData.name.charAt(0).toUpperCase() + theData.name.slice(1);
    //built the element
    let inpHtml = `<div class="form-group">
                        <label>${theTitle}</label>
                        <input type="text" class="form-control form-control-user" id="inp-${theData.name}" aria-describedby="${theData.name}" placeholder="Enter ${theData.name}" value="${theValue}">
                        <span class="text-danger d-none" id="error-${theData.name}">${theData.name} cannot be blank</span>  
                    </div>`
    //return it
    return (inpHtml)
}


/*
END OF TABLE PROCESSING FUNCTIONS
*/


/*
START OF LOCAL CACHE FUNCTIONS
*/

let clearCache = (clearUser = 0) => {
    window.localStorage.currentdataitem = ""
    //window.localStorage.data = ""

    window.localStorage.level1data = ""
    window.localStorage.level2data = ""
    window.localStorage.level1selecteditem = ""
    window.localStorage.level1selecteditem = ""
    window.localStorage.level1selectedid = ""
    window.localStorage.level2selectedid = ""
    if (clearUser == 1) {
        window.localStorage.token = ""
        window.localStorage.user = ""
        window.localStorage.settings = ""
    }
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
let tableName = "";
//check the password
/*
note this this the password checker curently it checks to the following rule set.
To check a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter

*/
let checkPassword = (str) => {
    if (complexPassword == 0) {
        return true;
    } else {
        var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(str);
    }
}



let showPassword = (elementName, eyeNumber) => {
    let theElement = document.getElementById(elementName);
    if (theElement.type === "password") {
        theElement.type = "text";
        document.getElementById('show-password' + eyeNumber).classList.add("d-none");
        document.getElementById('hide-password' + eyeNumber).classList.remove("d-none");
    } else {
        theElement.type = "password";
        document.getElementById('hide-password' + eyeNumber).classList.add("d-none");
        document.getElementById('show-password' + eyeNumber).classList.remove("d-none");
    }
}


//checkElement = document.getElementById("confirmation-modal-delete-button");
if (checkElement("confirmation-modal-delete-button") == true) {
    //if (typeof(checkElement) != 'undefined' && checkElement != null) {
    document.getElementById('confirmation-modal-delete-button').addEventListener('click', function() {
        $('#confirmation-modal').modal('toggle')
        let xhrDone = (res) => {
            // console.log(deleteMethod)
            //parse the response
            showAlert('Item has been deleted', 1)
            table.row('#' + tableRowId).remove().draw()
            //console.log(deleteMethod)
            if (deleteMethod == 'api/' + level1name + '/') {
                removeDataItem(1, deleteId)

            }
            if (deleteMethod == 'api/' + level2name + '/') {
                removeDataItem(2, deleteId, 0)

            }

        }

        let bodyobj = {
            id: deleteId,
            tableName: tableName
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the delete table record endpoint
        xhrcall(3, `${deleteMethod}`, bodyobjectjson, "json", "", xhrDone, token)

    })
}


let deleteTableItem = (dId, method, tTableName) => {
    deleteId = dId;
    tableRowId = dId;
    deleteMethod = method;
    tableName = tTableName;
    $('#confirmation-modal').modal('toggle')
}

//todo : make this work with multipile fields and values.
let updateTableItem = (dId, method, tTableName, tFields, tValues, toggleBtns = 0) => {
    let bodyobj = {
        id: dId,
        tableName: tTableName,
        fields: tFields,
        values: tValues,
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    let xhrDone = (res) => {
        //console.log(bodyobjectjson)
        //console.log(`off-${tFields}-${dId}`)

        //check if the element is there before we try an update
        if (checkElement(`off-${tFields}-${dId}`) == true) {
            //this is redundant now so we may remove it
            if (toggleBtns == 1) {
                //check the value
                if (tValues == 0) {
                    //show the on state
                    document.getElementById(`off-${tFields}-${dId}`).classList.add('d-none');
                    document.getElementById(`on-${tFields}-${dId}`).classList.remove('d-none');
                    document.getElementById(`text-${tFields}-${dId}`).innerHTML = "No";

                } else {
                    //show the off state
                    document.getElementById(`off-${tFields}-${dId}`).classList.remove('d-none');
                    document.getElementById(`on-${tFields}-${dId}`).classList.add('d-none');
                    document.getElementById(`text-${tFields}-${dId}`).innerHTML = "Yes"
                }


            }
        }
    }
    //call a put to update the fields
    xhrcall(4, `${method}`, bodyobjectjson, "json", "", xhrDone, token)
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

            //check admin stuff
            if (user.isAdmin == 1) {
                let element = document.getElementById('btn-create-cy');
                if (typeof(element) != 'undefined' && element != null) {
                    element.style.visibility = "visible"
                }
                document.getElementById("navadmin").classList.remove("d-none")
            }
            //check the user is logged in some one could spoof this so we could do a valid jwt check here 
            //but i prefer to do it when we ping the api for the data for this user. 
            if (user.loggedin != 1) {
                window.location = '/login'
            } else {
                //clear the cache 
                clearCache();
                //set the jwt and user
                getToken();
                if (checkElement("user-account-header") == true) {

                    //if (typeof(checkElement) != 'undefined' && checkElement != null) {
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

    //checkElement = document.getElementById("spinner");
    if (checkElement("spinner") == true) {
        //if (typeof(checkElement) != 'undefined' && checkElement != null) {
        document.getElementById("spinner").classList.remove("d-none");
    }
    let url = method;
    let result = method.includes("http");
    if (result == false)
        url = apiUrl + method;
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
    //check for a generic error this is usualy CORRS or something like it.
    xhr.onerror = function() {
        //console.log(xhr.status)
        //console.log(xhr.response)
        if (xhr.status == 0)
            document.getElementById("spinner").classList.add("d-none");
    };
    xhr.onload = function() {
        if (checkElement("confirmation-modal-delete-button") == true) {

            //checkElement = document.getElementById("confirmation-modal-delete-button");
            //if (typeof(checkElement) != 'undefined' && checkElement != null) {
            document.getElementById("spinner").classList.add("d-none");
        }
        //check if its an error
        let res = xhr.response;
        let errorMessage = "";

        //check for errors
        if ((xhr.status == 400) || (xhr.status == 403) || (xhr.status == 500)) {
            document.getElementById("spinner").classList.add("d-none");
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