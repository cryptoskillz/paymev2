/*
todo 

check if the other fields are there we could do this on the path name
add complex passwords
*/




//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}


whenDocumentReady(isReady = () => {


    //show it.
    //document.getElementById('showBody').classList.remove('d-none')

    //check if the email input exists
    if (checkElement("inp-email") == true) {
        //add a key press listener to the email
        document.getElementById("inp-email").addEventListener('keyup', function() {
            //get the value
            let tmpEmail = this.value;
            //split it on the @ symbol to create the username
            let tmp2 = tmpEmail.split('@');
            //check if there was an @ and if not just add the whole string otherwise add everthing before the @
            if (tmp2.length == 1)
                document.getElementById("inp-username").value = tmpEmail;
            else
                document.getElementById("inp-username").value = tmp2[0];

            //check if it is a valid email so we can hide it if it is. 
            if (validateEmail(this.value)) {
                //hide the error
                let error = document.getElementById('error-email');
                error.innerHTML = ""
                error.classList.add('d-none')
            }
        })


        //add an event listener when the user clicks out the focus button
        document.getElementById("inp-email").addEventListener('focusout', function() {
            //check if it is a valid email and if we have to hide or show the message
            if (validateEmail(this.value)) {
                //hide the error
                let error = document.getElementById('error-email');
                error.innerHTML = ""
                error.classList.add('d-none')
            } else {
                //set the error
                let error = document.getElementById('error-email');
                error.innerHTML = "Invalid Email Address"
                error.classList.remove('d-none')
            }

        });


        //add an event listener when the user clicks out the focus button
        document.getElementById("inp-password2").addEventListener('focusout', function() {
            let password1 = document.getElementById('inp-password1');
            let password2 = document.getElementById('inp-password2');
            if (password1.value != password2.value) {
                //password error
                let error = document.getElementById('error-password2')
                error.innerHTML = 'Passwords do not match.'
                error.classList.remove('d-none');
            } else {
                //no password
                let error = document.getElementById('error-password1')
                error.innerHTML = ''
                error.classList.add('d-none');
                //no error password 2
                error = document.getElementById('error-password2')
                error.innerHTML = ''
                error.classList.add('d-none');
            }
        })

    }


    /*=================================================================================
    START OF THE ACCOUNT FUNCTIONS (LOGIN / REGISTER ETC)
    ==================================================================================*/

    //check if the login button exists
    if (checkElement("btn-login") == true) {
        //this function handles the login
        document.getElementById('btn-login').addEventListener('click', function() {
            /*
            todo : 
            */
            //valid variable
            let valid = 1;
            //get the inputs
            let email = document.getElementById('inp-login-email');
            let password1 = document.getElementById('inp-login-password1');


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
                    let res = JSON.parse(response);
                    //debug
                    //console.log("res")
                    //console.log(res)
                    //get the JWT
                    let token = res.jwt
                    //set the user object
                    let user = res.user;
                    //add a logged in flag
                    user.loggedin = 1;
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
                    email: email.value,
                    password: password1.value,
                    action: "2",
                }
                //string it
                var bodyobjectjson = JSON.stringify(bodyobj);
                //call the login endpoint
                url = apiUrl + "admin/account"
                xhrcall(0, url, bodyobjectjson, "json", "", loginDone)
            }
        })
    }

    //check if the create account button exists
    if (checkElement("btn-create-account") == true) {
        //check if they are allowed
        if (canCreateAccount == 0) {
            window.location = "/login/"
        }

        //add a click event listener
        document.getElementById('btn-create-account').addEventListener('click', function() {
            //set the valid var
            let valid = 1;
            //get the details
            let email = document.getElementById('inp-email');
            let username = document.getElementById('inp-username');
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

            //check if the password is valid
            //note if complex password is set to 0 this function will always return true.
            if (checkPassword(password1.value) == false) {
                valid = 0;
                let error = document.getElementById('error-password1')
                error.innerHTML = 'The password must be at least 8 letter characters, with a symbol, a upper and lower case letter and a number'
                error.classList.remove('d-none')
            }

            //we only want to do the password match if they above is true.
            if (valid == 1) {
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
            }
            //send it.
            if (valid == 1) {
                //build the json
                let bodyobj = {
                    username: username.value,
                    email: email.value,
                    password: password1.value,
                    action: "1",
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let registerDone = (response) => {
                    response = JSON.parse(response);
                    if (response.status == "ok") {
                        window.location = "/login/"
                    } else {
                        showAlert("Error creating account please try again", 2)
                    }
                }
                //call the create account endpoint
                url = apiUrl + "admin/account"
                xhrcall(0, url, bodyobjectjson, "json", "", registerDone)
            }
        });
    }



    if (checkElement("btn-forgot-password") == true) {

        document.getElementById('btn-forgot-password').addEventListener('click', function() {

            //set the valid var
            let valid = 1;
            //get the details
            let email = document.getElementById('inp-forgot-email');
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
                    action: "3",
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let forgotPasswordDone = () => {
                    let alert = document.getElementById('accountsAlert')
                    alert.innerHTML = "you will recieve an email (when we code this part)"
                    alert.classList.remove('d-none');
                }
                url = apiUrl + "admin/account"
                xhrcall(0, url, bodyobjectjson, "json", "", forgotPasswordDone)
            }

        });
    }



    /*=================================================================================
    END OF THE ACCOUNT FUNCTIONS (LOGIN / REGISTER ETC)
    ==================================================================================*/


    //functions to port


    //logout
    let urlParam = getUrlParamater('logout')
    if (urlParam != "") {
        clearCache(1);
        showAlert('You are now logged out', 1, 0)
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

    //maybe this is better in profile.js waht is i?
    if (window.location.pathname == "/profile/") {
        document.getElementById('inp-username').value = user.username;
    }

})