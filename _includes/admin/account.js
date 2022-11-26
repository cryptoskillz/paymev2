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
            }
            else
            {
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


    //check if the create account button exists
    if (checkElement("btn-create-account") == true) {
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
                    if (response.status == "ok")
                    {
                        window.location = "/login/"
                    }
                    else
                    {
                         showAlert("Error creating account please try again", 2)
                    }
                }
                //call the create account endpoint
                url = adminUrl + "admin/account"
                xhrcall(0, url, bodyobjectjson, "json", "", registerDone)
            }
        });
    }



})