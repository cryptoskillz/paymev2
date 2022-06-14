/*

TODO 

check the send email works for forogot password
update all the  alert messages to user showALert
add profile page
add forgot password page

notes

*/

//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    //logout
    let urlParam = getUrlParamater('logout')
    if (urlParam != "") {
        clearCache(1);
        showAlert('You are now logged out', 1, 0)
    }
    //this function checks if an element exists
    let checkElement = (element) => {
        let checkedElement = document.getElementById(element);
        //If it isn't "undefined" and it isn't "null", then it exists.
        if (typeof(checkedElement) != 'undefined' && checkedElement != null) {
            return (true)
        } else {
            return (false)
        }
    }

    if (checkElement("btn-profile-update") == true) {
        document.getElementById('btn-profile-update').addEventListener('click', function() {
            //set the valid var
            let valid = 1;
            let username = document.getElementById('inp-username');
            //reset errors
            let alert = document.getElementById('accountsAlert')
            alert.innerHTML = ""
            alert.classList.add('d-none')
            document.getElementById('accountsSuccess').classList.add('d-none')

            if (username.value == "") {
                //error with the password
                valid = 0;
                let error = document.getElementById('error-username')
                error.innerHTML = 'Username cannot be blank'
                error.classList.remove('d-none')
            }

            if (valid == 1) {
                //build the json
                let bodyobj = {
                    username: username.value,
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let profileUpdateDone = () => {
                    let success = document.getElementById('accountsSuccess')
                    success.innerHTML = "Update done"
                    success.classList.remove('d-none')
                    let updateUser = { "username": username.value, "email": user.email, "loggedin": 1 }
                    window.localStorage.user = JSON.stringify(updateUser);
                    user = updateUser;
                    document.getElementById('user-account-header').innerHTML = user.username

                }
                //call the create account endpoint
                xhrcall(4, "users/" + user.id, bodyobjectjson, "json", "", profileUpdateDone, token)
            }
        })
    }

    if (checkElement("btn-reset-password") == true) {
        document.getElementById('btn-reset-password').addEventListener('click', function() {
            //set the valid var
            let valid = 1;

            //get the details
            let password1 = document.getElementById('inp-password1');
            let password2 = document.getElementById('inp-password2');

            //reset errors
            let alert = document.getElementById('accountsAlert')
            alert.innerHTML = ""
            alert.classList.add('d-none')
            document.getElementById('accountsSuccess').classList.add('d-none')
            document.getElementById('accountsAlert').classList.add('d-none')
            document.getElementById('error-password1').classList.add('d-none')
            document.getElementById('error-password2').classList.add('d-none')

            //validate the password
            if (password1.value == "") {
                //error with the password
                valid = 0;
                let error = document.getElementById('error-password1')
                error.innerHTML = 'Password cannot be blank'
                error.classList.remove('d-none')
            } else {
                //check the passwords match
                if (password1.value != password2.value) {
                    //password error
                    valid = 0;
                    let error = document.getElementById('error-password2')
                    error.innerHTML = 'Passwords do not match.'
                    error.classList.remove('d-none')

                }

            }

            if (valid == 1) {
                //todo : get the private code

                let privateCode = "12345"

                //build the json
                let bodyobj = {
                    code: privateCode,
                    password: password1.value,
                    passwordConfirmation: password2.value,
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let resetPasswordDone = () => {
                    let alert = document.getElementById('accountsAlert')
                    alert.innerHTML = "Password has been reset"
                    alert.classList.remove('d-none')
                }
                //call the create account endpoint
                xhrcall(0, "auth/reset-password", bodyobjectjson, "json", "", resetPasswordDone)



            }


        })
    }

    if (checkElement("btn-forgot-password") == true) {
        document.getElementById('btn-forgot-password').addEventListener('click', function() {
            //set the valid var
            let valid = 1;
            //get the details
            let email = document.getElementById('inp-email');
            //reset errors
            let alert = document.getElementById('accountsAlert')
            alert.innerHTML = ""
            alert.classList.add('d-none')
            document.getElementById('accountsSuccess').classList.add('d-none')
            document.getElementById('accountsAlert').classList.add('d-none')
            document.getElementById('error-email').classList.add('d-none')
            //validate the email
            if (validateEmail(email.value)) {
                //its valid we don't really have to do anything but we may extend this so no harm done leaving it.
                valid = 1;
            } else {
                //error with the email
                valid = 0;
                //set the error
                let error = document.getElementById('error-email');
                error.innerHTML = "Invalid Email Address"
                error.classList.remove('d-none')
            }

            if (valid == 1) {
                //build the json
                let bodyobj = {
                    email: email.value,
                    url: 'http:/localhost:1337/admin/plugins/users-permissions/auth/reset-password',
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let forgotPasswordDone = () => {
                    let alert = document.getElementById('accountsAlert')
                    alert.innerHTML = "you will recieve an email"
                    alert.classList.remove('d-none')
                }
                //call the create account endpoint
                xhrcall(0, "auth/forgot-password", bodyobjectjson, "json", "", forgotPasswordDone)
            }

        });
    }


    if (checkElement("btn-create-account") == true) {
        document.getElementById('btn-create-account').addEventListener('click', function() {
            //set the valid var
            let valid = 1;
            //get the details
            let email = document.getElementById('inp-email');
            let password1 = document.getElementById('inp-password1');
            let password2 = document.getElementById('inp-password2');
            //validate the email
            if (validateEmail(email.value)) {
                //its valid we don't really have to do anything but we may extend this so no harm done leaving it.
                valid = 1;
            } else {
                //error with the email
                valid = 0;
                //set the error
                let error = document.getElementById('error-email');
                error.innerHTML = "Invalid Email Address"
                error.classList.remove('d-none')
            }
            //validate the password
            if (password1.value == "") {
                //error with the password
                valid = 0;
                let error = document.getElementById('error-password1')
                error.innerHTML = 'Password cannot be blank'
                error.classList.remove('d-none')
            } else {
                //check the passwords match
                if (password1.value != password2.value) {
                    //password error
                    valid = 0;
                    let error = document.getElementById('error-password2')
                    error.innerHTML = 'Passwords do not match.'
                    error.classList.remove('d-none');
                }
            }
            //send it.
            if (valid == 1) {
                //build the json
                let bodyobj = {
                    username: email.value,
                    email: email.value,
                    password: password1.value,
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let registerDone = () => {
                    window.location = "/login/"
                }
                //call the create account endpoint
                xhrcall(0, "api/register", bodyobjectjson, "json", "", registerDone)
            }
        });
    }


    if (checkElement("btn-login") == true) {
        //this function handles the login
        document.getElementById('btn-login').addEventListener('click', function() {
            /*
            todo : 
            */
            //valid variable
            let valid = 1;
            //get the inputs
            let email = document.getElementById('inp-email');
            let password1 = document.getElementById('inp-password1');

            //validate the email
            if (validateEmail(email.value)) {
                //no error, not necessary but we may extend this in the future
                valid = 1;
                //document.getElementById('valid-email-icon').classList.remove('d-none')
            } else {
                //error with the email
                valid = 0;
                document.getElementById('error-email').classList.remove('d-none')
            }
            //validate the password
            if (password1.value == "") {
                //password is blank
                valid = 0;
                let error = document.getElementById('error-password1')
                error.innerHTML = 'Password cannot be blank'
                error.classList.remove('d-none')
            }
            //send it.
            if (valid == 1) {
                //login done function
                let loginDone = (response) => {
                    //get the repsonse
                    let res = JSON.parse(response)
                    //get the JWT
                    let token = res.jwt
                    //set the user object
                    let user = { "username": res.user.username, "email": res.user.email, "loggedin": 1, "secret": res.user.secret, "datacount": res.user.datacount }
                    //clear the caches 
                    clearCache();
                    //set the local storage
                    window.localStorage.token = token;
                    window.localStorage.user = JSON.stringify(user);
                    //direct the redirect URL
                    window.location.href = "/dashboard/"
                }
                //build the json
                let bodyobj = {
                    identifier: email.value,
                    password: password1.value,
                }
                //string it
                var bodyobjectjson = JSON.stringify(bodyobj);
                //call the login endpoint
                xhrcall(0, "api/login/", bodyobjectjson, "json", "", loginDone)
            }
        })
    }

    //maybe this is better in profile.js
    if (window.location.pathname == "/profile/") {
        document.getElementById('inp-username').value = user.username;
    }

});