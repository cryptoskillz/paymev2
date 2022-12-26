 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }

 //order details, get these from the parameters
 let orderDetails = {};
 let companyName = 'OrbitLabs'

 let checkInterval;

 let paymentMethods = [{ "name": "Metamask", "image": "metamask.png", "id": 1, "active": 1 }, { "name": "Cyrpto Currency", "image": "cryptocurrencies.png", "id": 2, "active": 1 }, { "name": "Credit Card", "image": "creditcard.png", "id": 3, "active": 1 }]
 let currencyMethods = [{ "name": "Bitcoin", "code": "bitcoin", "image": "btc.png", "symbol": "BTC", "id": 1, "active": 1, "chainlinkaddress": chainBtcTest, "price": "", "amountToPay": "" }, { "name": "Ethereum", "code": "ethereum", "image": "eth.png", "symbol": "ETH", "id": 2, "active": 1, "chainlinkaddress": chainEthTest, "price": "", "amountToPay": "" }, { "name": "Binance Coin", "code": "binancecoin", "image": "bnb.png", "symbol": "BNB", "id": 3, "active": 1, "chainlinkaddress": chainBnbTest, "price": "", "amountToPay": "" }]
 let paymentAddress = "";
 let paymentSymbol = "";
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
     let theAmountToPay = currencyMethods[methodSelected - paymentMethods.length].amountToPay;
     paymentSymbol = currencyMethods[methodSelected - paymentMethods.length].symbol

     //process the xhr call done
     let addressDone = (response) => {
         paymentAddress = response.data.address
         let updatePaymentDone = (response2, status2) => {
             if (status == 400) {
                 document.getElementById('invalidicon').classList.add('d-none')
                 document.getElementById('payment-invalid').classList.remove('d-none')
                 return
             }
             //start the time
             console.log(paymentDetails)
             if (paymentDetails.useTimer == 1)
                 countDownTimer(15);
             //set the symbol
             document.getElementById('qrcryptosymbol').innerHTML = `${theSymbol}`;
             //set the amount to pay
             document.getElementById('qrcryptoamount').value = theAmountToPay;
             //set the address 
             document.getElementById('qrcryptoaddress').value = paymentAddress;
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
             //udpate the wallet address
             document.getElementById('qrwallet').href = `${paymentSymbol}:${paymentAddress}?amount=${theAmountToPay}`
         }




         let theJson = {
             orderId: orderDetails.orderId,
             amount: theAmountToPay,
             address: response.data.address,
             cryptoUsed: theSymbol
         }

         let bodyObj = {
             table: "crypto_payments",
             tableData: theJson,
         }
         let bodyObjectJson = JSON.stringify(bodyObj);
         //check we have valid data to submit
         //put the record
         let method = `crypto/payment/`
         xhrcall(4, `${apiUrl}${method}`, bodyObjectJson, "json", "", updatePaymentDone);

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
     //update update the payment to paid
     clearInterval(checkInterval);
     setDisabledState("btn-primary", true)
     document.getElementById('payment-qr-code').classList.add('d-none');
     document.getElementById('payment-paidandconfirmed').classList.remove('d-none');
     checkInvoice();

 });

 document.getElementById('checkinvoice').addEventListener('click', function() {



 })

 const checkCryptoLocally = async () => {
     //try {
     let httProviderUrl = "";
     if (paymentSymbol == "ETH") {
         if (network == "testnet")
             httpProviderUrl = ethRpcUrlTest;
         if (network == "mainnet")
             httpProviderUrl = ethRpcUrlMain;
     }



     const web3 = new Web3(new Web3.providers.HttpProvider(httpProviderUrl)); // The address to check
     let transaction;
     let receipt;
     if (paymentSymbol == "ETH") {
         // Get the number of transactions associated with the address
         const transactionCount = await web3.eth.getTransactionCount(paymentAddress);
         // Get the newest transaction by block number and transaction index
         transaction = await web3.eth.getTransactionFromBlock("latest", transactionCount - 1);
         receipt = await web3.eth.getTransactionReceipt(transaction.hash);
     }

     let checkNonBtcDone = (res) => {
         console.log(res);
         let endId = 0;
         //check if it was an old payment this means it was confirmed but we did not have the txid in the database so we added it but this may not be the actual
         //payment we are looking for. 
         if (res.old == true) {
             endIt = 1;
             document.getElementById('paidandconfirmedtext').innerHTML = "Older payment found and added to the database";
             document.getElementById('paidandconfirmed').classList.remove("d-none")
         } else {
             //check if it is confirmed or not
             if (res.confirmed == true) {
                 endIt = 1;
                 document.getElementById('paidandconfirmedtext').innerHTML = "Paid and confirmed";

             } else {
                 document.getElementById('paidandconfirmedtext').innerHTML = "Paid but not confirmed";
             }
         }
         //console.log(endIt)
         if (endIt == 1) {
             clearInterval(checkInterval);
             document.getElementById('paidandconfirmed').classList.remove("d-none")
             document.getElementById("checkinvoice").classList.add('d-none')
         }
     }

     let theJson = {
         orderId: orderDetails.orderId,
         address: paymentAddress,
         symbol: paymentSymbol,
         transaction: transaction,
         receipt: receipt
     }

     let bodyObj = {
         table: "crypto_payments",
         tableData: theJson,
     }
     let bodyObjectJson = JSON.stringify(bodyObj);
     //check we have valid data to submit
     //put the record
     let method = `crypto/check/`
     xhrcall(4, `${apiUrl}${method}`, bodyObjectJson, "json", "", checkNonBtcDone);

 }


 let checkInvoice = () => {
     checkInterval = setInterval(function() {
         //console.log('checking')
         let checkDone = (res) => {
             let endId = 0;
             //check if it was an old payment this means it was confirmed but we did not have the txid in the database so we added it but this may not be the actual
             //payment we are looking for. 
             if (res.old == true) {
                 endIt = 1;
                 document.getElementById('paidandconfirmedtext').innerHTML = "Older payment found and added to the database";
                 document.getElementById('paidandconfirmed').classList.remove("d-none")
             } else {
                 //check if it is confirmed or not
                 if (res.confirmed == true) {
                     endIt = 1;
                     document.getElementById('paidandconfirmedtext').innerHTML = "Paid and confirmed";

                 } else {
                     document.getElementById('paidandconfirmedtext').innerHTML = "Paid but not confirmed";
                 }
             }
             //console.log(endIt)
             if (endIt == 1) {
                 clearInterval(checkInterval);
                 document.getElementById('paidandconfirmed').classList.remove("d-none")
                 document.getElementById("checkinvoice").classList.add('d-none')
             }
             //remove the payment div
             //document.getElementById('paidandconfirmed').classList.remove("d-none")
         }
         //do a xhrcall to get the price 
         if ((paymentSymbol == "BTC") || (paymentSymbol == "BNB")) {
             let method = `crypto/check/?cryptocurrency=${paymentSymbol}&address=${paymentAddress}&orderId=${orderDetails.orderId}`
             xhrcall(1, apiUrl + method, '', '', '', checkDone, '', '');
         } else {
             checkCryptoLocally();

         }

     }, 10000);

 }


 document.getElementById('qrinvalidbutton').addEventListener('click', function() {
     //update update the payment to invalid

     let theTable = "crypto_payments";
     let theFields = "markedInvalid";


     let getTableDone = (res) => {
         console.log(res.status)
         clearInterval(checkInterval);
         setDisabledState("btn-primary", true)
         document.getElementById('payment-qr-code').classList.add('d-none');
         document.getElementById('payment-invalid').classList.remove('d-none');
     }

     let theJson = {
         orderId: orderDetails.orderId,
         markedInvalid: 1

     }

     let bodyObj = {
         table: "crypto_payments",
         tableData: theJson,
     }
     let bodyObjectJson = JSON.stringify(bodyObj);
     //check we have valid data to submit
     //put the record
     let method = `crypto/payment/`
     xhrcall(4, `${apiUrl}${method}`, bodyObjectJson, "json", "", getTableDone);



 });

 document.getElementById('copyAmount').addEventListener('click', function() {
     copyDivToClipboard(document.querySelector("#qrcryptoamount"));
 })

 document.getElementById('copyAddress').addEventListener('click', function() {
     copyDivToClipboard(document.querySelector("#qrcryptoaddress"));
 })


 /* END OF EVENT LISTENERS */


 /* START OF DOM MODIFIERS */

 let countDownTimer = (countdownDuration) => {
     // Get the current time
     const startTime = new Date().getTime();

     // Calculate the countdown end time by adding the duration to the start time
     const endTime = startTime + countdownDuration * 60 * 1000;

     // Update the countdown every 1 second
     checkInterval = setInterval(function() {
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
             clearInterval(checkInterval);
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
     let res = urlParams.get(param)

     console.log(res)
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

 let buildDropdown = (theMethod, theElement, addPrice = 0) => {
     //set the payment methods
     let tmpHtml = "";
     //set the active count so we know if to show the payment methods or not (if there is one we may as well go straight to coin select)
     let activeCount = 0
     //set a tmp amount
     let tmpAmount = "";
     //loop through the payment / currency methods
     for (var i = 0; i < theMethod.length; i++) {
         //check if we want to add a price
         if (addPrice == 1) {
             tmpAmount = theMethod[i].amountToPay
         }
         //add it
         if (theMethod[i].active == 1) {
             activeCount++;
             tmpHtml = tmpHtml + `
                                <li class="list-group-item d-flex justify-content-between align-items-center ml-3 mr-3 mt-2 mb-2" onclick="javascript:changeMethod(this)">
                                    <div>
                                    <img src="/assets/images/${theMethod[i].image}" alt="" class="icon-sm">
                                    <span class="display-4 t-x2 align-middle">${theMethod[i].name}</span>
                                </div>
                                <span class="display-4 t-x2" id="${theElement}-${i}">${tmpAmount}</span>
                                </li>
                                
                            `
         }
     }
     //update the element
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

 const flashInputBorder = (input, colour) => {
     // Get the original border color
     const originalBorderColor = input.style.borderColor;
     // Set the border color to the desired color
     input.style.borderColor = colour;
     // Set a timer to reset the border color after 1 second
     setTimeout(() => {
         input.style.borderColor = originalBorderColor;
     }, 3000);
 }

 let copyDivToClipboard = (input) => {
     // Set the value of the input element to the clipboard
     console.log(input.value)
     input.select();
     document.execCommand("copy");
     flashInputBorder(input, "green")
 }


 /* END OF DOM MODIFIERS */


 /* START OF WEB 3 */

 const ethRequest = async () => {
     try {
         //ask meta mask for the accounts
         let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
         //return them 
         return (accounts[0])
     } catch (e) {
         //show the error (usually user hitting the reject button on metamask)
         //showAlert(e.message, 2);\
         console.log(e.message);
     }

 }

 let getPriceFromChainLink = async () => {
     console.log('trying to get current prices from chainlink')
     let web3 = new Web3(Web3.givenProvider || rpcUrl);

     const aggregatorV3InterfaceABI = [{
             inputs: [],
             name: "decimals",
             outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
             stateMutability: "view",
             type: "function",
         },
         {
             inputs: [],
             name: "description",
             outputs: [{ internalType: "string", name: "", type: "string" }],
             stateMutability: "view",
             type: "function",
         },
         {
             inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
             name: "getRoundData",
             outputs: [
                 { internalType: "uint80", name: "roundId", type: "uint80" },
                 { internalType: "int256", name: "answer", type: "int256" },
                 { internalType: "uint256", name: "startedAt", type: "uint256" },
                 { internalType: "uint256", name: "updatedAt", type: "uint256" },
                 { internalType: "uint80", name: "answeredInRound", type: "uint80" },
             ],
             stateMutability: "view",
             type: "function",
         },
         {
             inputs: [],
             name: "latestRoundData",
             outputs: [
                 { internalType: "uint80", name: "roundId", type: "uint80" },
                 { internalType: "int256", name: "answer", type: "int256" },
                 { internalType: "uint256", name: "startedAt", type: "uint256" },
                 { internalType: "uint256", name: "updatedAt", type: "uint256" },
                 { internalType: "uint80", name: "answeredInRound", type: "uint80" },
             ],
             stateMutability: "view",
             type: "function",
         },
         {
             inputs: [],
             name: "version",
             outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
             stateMutability: "view",
             type: "function",
         },
     ]
     //set the contract address

     try {
         let addr = "";
         for (var i = 0; i < currencyMethods.length; i++) {
             if (currencyMethods[i].active == 1) {
                 let priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, currencyMethods[i].chainlinkaddress);
                 //get the latest price
                 let roundData = await priceFeed.methods.latestRoundData().call();
                 //get the decimals (didn't mention this in the docs anywhere did you)
                 let decimals = await priceFeed.methods.decimals().call();
                 //convert the stupid big number
                 let thePrice = Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2));
                 currencyMethods[i].price = thePrice
                 let tmpPay = paymentDetails.amountUsd / thePrice;
                 tmpPay = tmpPay.toFixed(8)
                 currencyMethods[i].amountToPay = tmpPay
             }

         }
         console.log('got prices from chainlink')
         const theCount = buildDropdown(paymentMethods, "payment-method-ul");
         const theCount2 = buildDropdown(currencyMethods, "payment-currency-ul", 1);
         //check if we show the payment types or go straight to currency
         if (theCount == 1) {
             document.getElementById('payment-select-currency').classList.remove('d-none');
         } else {
             document.getElementById('payment-select-method').classList.remove('d-none');
         }
         document.getElementById("spinner").classList.add('d-none');


     } catch (error) {
         console.log(error)
         console.log('got prices from api')
         //process the xhr call done
         let priceDone = (result2) => {
             //todo update the price in the currency methods. 
             for (let crypto in result2) {
                 //get the price
                 //note: we would have to loop this if we want to do more than one fiat currency but for now we do not want to do this. 
                 let thePrice = result2[crypto].usd;
                 let tmpPay = paymentDetails.amountUsd / thePrice;
                 tmpPay = tmpPay.toFixed(8);
                 //update the currency json object
                 for (var i = 0; i < currencyMethods.length; i++) {
                     if (currencyMethods[i].code == crypto) {
                         currencyMethods[i].price = thePrice;
                         currencyMethods[i].amountToPay = tmpPay;
                     }
                 }
             }
             //build the dropdowns
             const theCount = buildDropdown(paymentMethods, "payment-method-ul");
             const theCount2 = buildDropdown(currencyMethods, "payment-currency-ul", 1);
             //check if we show the payment types or go straight to currency
             if (theCount == 1) {
                 document.getElementById('payment-select-currency').classList.remove('d-none');
             } else {
                 document.getElementById('payment-select-method').classList.remove('d-none');

             }
             document.getElementById("spinner").classList.add('d-none');
         }
         let cryptocurrencies = "";
         for (var i = 0; i < currencyMethods.length; i++) {
             if (cryptocurrencies == "")
                 cryptocurrencies = currencyMethods[i].code;
             else
                 cryptocurrencies = cryptocurrencies + "," + currencyMethods[i].code;
             //console.log(currencyMethods[i].code);
         }
         let method = `crypto/price/?cryptocurrencies=${cryptocurrencies}&fiatcurrencies=usd`
         //do a xhrcall to get the price 
         xhrcall(1, apiUrl + method, '', '', '', priceDone, '', '');
     }


 }



 /* END OF WEB 3 */

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
         setClassHtml("order-detail", `Order #${paymentDetails.orderId} <br>${paymentDetails.name}`)
         setClassHtml("order-amount", `${paymentDetails.amountCurrency}${paymentDetails.amountUsd}`)
         setClassHtml("divcompanyname", companyName)
         //try to get the price using web3
         getPriceFromChainLink();
     }
     //show the spinner
     const orderId = getUrlParamater('orderId')
     if (orderId == "") {
         document.getElementById('invalidicon').classList.add('d-none')
         document.getElementById('payment-invalid').classList.remove('d-none')
     } else {
         orderDetails.orderId = orderId;
         document.getElementById("spinner").classList.remove('d-none');
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
     };
     xhr.onload = function() {
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
                 eval(callback(res, status));
             }

         }



     }
 };


 whenDocumentReady(isReady = () => {
     init();
 });