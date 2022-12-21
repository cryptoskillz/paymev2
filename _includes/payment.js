 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }

 //order details, get these from the parameters
 let orderDetails = {};
 let amountToPay = [];
 let companyName = 'OrbitLabs'
 let network = 'mainnet';

 let paymentMethods = [{ "name": "Metamask", "image": "metamask.png", "id": 1, "active": 1 }, { "name": "Cyrpto Currency", "image": "cryptocurrencies.png", "id": 2, "active": 1 }, { "name": "Credit Card", "image": "creditcard.png", "id": 3, "active": 1 }]
 let currencyMethods = [{ "name": "Bitcoin", "image": "btc.png", "symbol": "BTC", "id": 1, "active": 1 }, { "name": "Ethereum", "image": "eth.png", "symbol": "ETH", "id": 2, "active": 1 }]
 /*
     0 = wallet connected
     1 = crypto currency 
     2 = credit card 
 */
 let methodSelected = 0;

 /* START OF EVENT LISTENERS */


 document.getElementById('btn-currency-submit').addEventListener('click', function() {
     let theSymbol = currencyMethods[methodSelected - paymentMethods.length].symbol;
     let theImage = currencyMethods[methodSelected - paymentMethods.length].image
     let theAmountToPay = amountToPay[methodSelected - paymentMethods.length];
     //process the xhr call done
     let addressDone = (response) => {
         let updatePaymentDone = (response2, status2) => {
             if (status == 400) {
                 document.getElementById('invalidicon').classList.add('d-none')
                 document.getElementById('payment-invalid').classList.remove('d-none')
                 return
             }
             //start the time
             countDownTimer(15);
             //set the symbol
             document.getElementById('qrcryptosymbol').innerHTML = `${theSymbol}`;
             //set the amount to pay
             document.getElementById('qrcryptoamount').value = theAmountToPay;
             //set the address 
             document.getElementById('qrcryptoaddress').value = response.data.address;
             //set the icon
             setClassImgSrc("qrcryptoicon", `/assets/images/${theImage}`)
             //set the qr code
             let theQr = document.getElementById('qrcryptoimage');
             theQr.src = response.data.qrUrl;
             theQr.classList.remove('d-none');
             //disable the buttons
             setDisabledState("btn-primary", true);
             //hide the curenncy modal
             document.getElementById('payment-select-currency').classList.add('d-none');
             //show the QR modal 
             document.getElementById('payment-qr-code').classList.remove('d-none');
         }


         let bodyObj = {
             orderId: orderDetails.orderId,
             amount: theAmountToPay,
             address: response.data.address,
             cryptoUsed: theSymbol
         }

         let bodyObjectJson = JSON.stringify(bodyObj);
         //console.log("bodyObjectJson")
         //check we have valid data to submit
         //set the api vars
         let method = `crypto/payment/`
         //do a xhrcall to get the price 
         xhrcall(4, `${apiUrl}${method}`, bodyObjectJson, "json", "", updatePaymentDone)

     }
     //set the api vars
     let method = `crypto/address/?id=${theSymbol}`
     //do a xhrcall to get the price 
     xhrcall(1, apiUrl + method, '', '', '', addressDone, '', '');
 });

 document.getElementById('btn-method-submit').addEventListener('click', function() {
     switch (methodSelected) {
         case 0:
             alert('to do ');
             break;
         case 1:
             setDisabledState("btn-primary", true)
             document.getElementById('payment-select-method').classList.add('d-none');
             document.getElementById('payment-select-currency').classList.remove('d-none');
             break;
         case 2:
             alert('to do ');
             break;
     }
 });

 document.getElementById('qrpaidbutton').addEventListener('click', function() {
     clearInterval();
     setDisabledState("btn-primary", true)
     document.getElementById('payment-qr-code').classList.add('d-none');
     document.getElementById('payment-paidandconfirmed').classList.remove('d-none');

 });


 document.getElementById('qrinvalidbutton').addEventListener('click', function() {
     clearInterval();
     setDisabledState("btn-primary", true)
     document.getElementById('payment-qr-code').classList.add('d-none');
     document.getElementById('payment-invalid').classList.remove('d-none');
 });








 /* END OF EVENT LISTENERS */


 /* START OF DOM MODIFIERS */

 let countDownTimer = (countdownDuration) => {
     // Get the current time
     const startTime = new Date().getTime();

     // Calculate the countdown end time by adding the duration to the start time
     const endTime = startTime + countdownDuration * 60 * 1000;

     // Update the countdown every 1 second
     setInterval(function() {
         // Get the current time
         const currentTime = new Date().getTime();

         // Calculate the elapsed time
         const elapsedTime = currentTime - startTime;

         // Calculate the remaining time
         const remainingTime = endTime - currentTime;

         // Calculate the minutes and seconds from the remaining time
         const minutes = Math.floor(remainingTime / (1000 * 60));
         let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
         if (seconds < 10)
             seconds = "0" + seconds;
         // Update the countdown display
         document.getElementById("countdown").innerHTML = minutes + ":" + seconds;

         // If the countdown is finished, stop the interval and display a message
         if (remainingTime < 0) {
             clearInterval();
             document.getElementById('payment-qr-code').classList.add('d-none');
             document.getElementById('payment-expired').classList.remove('d-none');
         }
     }, 1000);

 }

 //get the url paramater
 let getUrlParamater = (param) => {
     //get the query string
     const queryString = window.location.search;
     //get the paramaters
     const urlParams = new URLSearchParams(queryString);
     //gtt the paramter we are looking 
     const res = urlParams.get(param)
     //check it exists. 
     if (res == null)
         res = "";
     return (res)
 }


 let guidGenerator = () => {
     var S4 = function() {
         return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
     };
     return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
 }



 let setClassImgSrc = (theElement, theSrc) => {
     let theItems = document.getElementsByClassName(theElement);
     for (var i = 0; i < theItems.length; i++) {
         theItems[i].src = theSrc
     }
 }

 let setClassHtml = (theElement, theText) => {
     let theItems = document.getElementsByClassName(theElement);
     for (var i = 0; i < theItems.length; i++) {
         theItems[i].innerHTML = theText
     }
 }

 let setDisabledState = (theElement, disabled = true) => {
     let theItems = document.getElementsByClassName(theElement);
     for (var i = 0; i < theItems.length; i++) {
         theItems[i].disabled = disabled
     }
 }


 let changeMethod = (theElement) => {
     //check if active has already been applied and if so remove it. 
     if (theElement.classList.contains('active') == true) {
         theElement.classList.remove('active');
         //disable the pay button
         setDisabledState("btn-primary", true)
     } else {
         //remove the active states from all list items
         var theItems = document.getElementsByClassName("list-group-item");
         for (var i = 0; i < theItems.length; i++) {
             theItems[i].classList.remove('active')
         }
         //add the active
         theElement.classList.add('active');
         //remove the active states from all list items
         methodSelected = 0;
         for (var i = 0; i < theItems.length; i++) {
             if (theItems[i].classList.contains('active') == true) {
                 methodSelected = i;
             }
         }
         //console.log("cm"+methodSelected)
         //enable the button
         setDisabledState("btn-primary", false)
     }

 }

 let buildDropdown = (theMethod, theElement) => {
     //set the payment methods
     let tmpHtml = "";
     let activeCount = 0
     for (var i = 0; i < theMethod.length; i++) {
         if (theMethod[i].active == 1) {
             activeCount++;
             tmpHtml = tmpHtml + `
                                <li class="list-group-item d-flex justify-content-between align-items-center ml-3 mr-3 mt-2 mb-2" onclick="javascript:changeMethod(this)">
                                    <div>
                                    <img src="/assets/images/${theMethod[i].image}" alt="" class="icon-sm">
                                    <span class="display-4 t-x2 align-middle">${theMethod[i].name}</span>
                                </div>
                                <span class="display-4 t-x2" id="${theElement}-${i}"></span>
                                </li>
                                
                            `
         }
     }

     document.getElementById(theElement).innerHTML = tmpHtml;
     return (activeCount);
 }

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

 /* END OF DOM MODIFIERS */

 let init = () => {

     //set the order info 


     let paymentDone = (result, status) => {
         //console.log(status);
         paymentDetails = result;
         if (status == 400) {
             document.getElementById('invalidicon').classList.add('d-none')
             document.getElementById('payment-invalid').classList.remove('d-none')
             return
         }
                      //set the payment Id
         setClassHtml('paymentId', `Payment ID ${paymentDetails.paymentId}`);
         setClassHtml("order-detail", `Order #${paymentDetails.orderId} <br>${paymentDetails.productName}`)
         setClassHtml("order-amount", `${paymentDetails.amountCurrency}${paymentDetails.amountUsd}`)
         setClassHtml("divcompanyname", companyName)
         //process the xhr call done
         let priceDone = (result2) => {

             const theCount = buildDropdown(paymentMethods, "payment-method-ul");
             const theCount2 = buildDropdown(currencyMethods, "payment-currency-ul");
             //set a counter to zero
             let i = 0;
             //loop through the response
             for (let crypto in result2) {
                 //get the price
                 //note: we would have to loop this if we want to do more than one fiat currency but for now we do not want to do this. 
                 let thePrice = result2[crypto].usd;
                 //inc the counter
                 //convert the currency 
                 let tmpPay = paymentDetails.amountUsd / thePrice;
                 tmpPay = tmpPay.toFixed(8)
                 //add it to the payment amount array
                 amountToPay.push(tmpPay);
                 //set the price to pay in the UL
                 document.getElementById(`payment-currency-ul-${i}`).innerHTML = tmpPay;
                 i++;
             }
             //check if we show the payment types or go straight to currency
             if (theCount == 1) {
                 document.getElementById('payment-select-currency').classList.remove('d-none');
             } else {
                 document.getElementById('payment-select-method').classList.remove('d-none');

             }

         }

         //set the api vars
         //note: move this to the env var 
         //let apiUrl = "http://localhost:8788/api/"
         let method = "crypto/price/?cryptocurrencies=bitcoin,ethereum&fiatcurrencies=usd"
         //do a xhrcall to get the price 
         xhrcall(1, apiUrl + method, '', '', '', priceDone, '', '');

     }

     const orderId = getUrlParamater('orderId')
     if (orderId == "") {
         document.getElementById('payment-invalid').classList.remove('d-none')
     } else {
         const method = `crypto/payment?orderId=${orderId}`;
         xhrcall(1, apiUrl + method, '', '', '', paymentDone, '', '');
     }

 }

 /*
  * AJAX Call function
  */
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
        let status = xhr.status
        let errorMessage = "";


        //check if it was ok.
        if (xhr.status == 200) {
            //check if a redirecr url as passed.
            if (redirectUrl != "") {
                window.location = redirectUrl
            } else {
                //console.log(res)
                res = JSON.parse(res)
                //console.log(res)
                eval(callback(res,status));
            }

        }



    }
};


 whenDocumentReady(isReady = () => {
     init();
 });