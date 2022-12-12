//set up web3
let web3 = new Web3(Web3.givenProvider || RPCUrl);

let currentAccountAddress;
let currentBalance = 0;
let property;

//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

//this function gets the list of accounts from metamask
const getAccounts = async () => {
    account = "";
    account = await web3.eth.getAccounts();
    return account[0];
}


//check if we are connected to metamask and if not then show the connect meta button
const isConnected = async () => {
    //set conneciton var
    let conn = false;
    //call ethrequest
    //note this has replaced get accounts
    currentAccountAddress = await ethRequest();
    //check it is the same address as stored for the property.
    let tmpPaymentAddress = property.paymentAddress.toLowerCase();
    currentAccountAddress = currentAccountAddress.toLowerCase();
    if (tmpPaymentAddress != currentAccountAddress) {
        showAlert('Payment address does not match connected Metamask', 2,0);
        return conn;
    } else {
        //check we have a current account
        if (currentAccountAddress === undefined) {
            //no accounts show connect account button
            showAlert('Please connect Metamask', 1, 0);
            //set connectiont to false
            conn = false;
        } else {
            //get the balance
            web3.eth.getBalance(currentAccountAddress, function(error, wei) {
                //check for an error
                if (!error) {
                    currentBalance = web3.utils.fromWei(wei, 'ether');
                    document.getElementById('inp-balance').value = currentBalance;
                }
                else
                {
                    //show the error
                    showAlert(error,2);
                }
            });
            //set connection to true
            conn = true;
        }
    }




}

const ethRequest = async () => {
    try {
        //ask meta mask for the accounts
        let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        //return them 
        return (accounts[0])
    } catch (e) {
        //show the error (usually user hitting the reject button on metamask)
        showAlert(e.message, 2);
    }

}


whenDocumentReady(isReady = () => {
    //get the payment address
    property = JSON.parse(window.localStorage.currentDataItem);

    if (typeof window.ethereum !== 'undefined') {
        //console.log('MetaMask is installed!');
        let res = isConnected();
        document.getElementById('showBody').classList.remove('d-none');
    } else {
        showAlert('Please connect Metamask', 2, 1);
    }



});