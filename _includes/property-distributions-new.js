//set up web3
let web3 = new Web3(Web3.givenProvider || RPCUrl);

let currentAccountAddress;
let currentBalance = 0;
let property;

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
        showAlert('Payment address does not match connected Metamask', 2, 0);
        return conn;
    } else {
        //check we have a current account
        if (currentAccountAddress === undefined) {
            //no accounts show connect account button
            showAlert('Please connect Metamask', 1, 0);
            //set connectiont to false
            conn = false;
        } else {
            //get the balance from Metamask
            let balance = await web3.eth.getBalance(currentAccountAddress);
            //convert it to something useful
            currentBalance = await web3.utils.fromWei(balance, 'ether');
            //set the contract address
            const addr = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526";
            //set the price contract
            const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
            //get the latest price
            let roundData = await priceFeed.methods.latestRoundData().call();
            //get the decimals (didn't mention this in the docs anywhere did you)
            let decimals = await priceFeed.methods.decimals().call();
            //convert the stupid big number
            let currentPrice = Number((roundData.answer.toString() / Math.pow(10, decimals)).toFixed(2));
            //get the value of the crypto in USD
            //note : make this the default currency from the settings
            let cyrptoValue = currentPrice / 100 * currentBalance * 100
            //update the values
            document.getElementById('inp-balance').value = currentBalance;
            document.getElementById('inp-balanceUSD').value = Number(cyrptoValue.toFixed(2));
            document.getElementById('data-header').innerHTML = `Current BNB Price $${currentPrice}`;
            ///hide the spinner
            document.getElementById("spinner").classList.add("d-none");
        }
        //set connection to true
        conn = true;
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
    showAlert('Please be patient we doing Blockchain stuff',1)
    document.getElementById("spinner").classList.remove("d-none");
    property = JSON.parse(window.localStorage.currentDataItem);

    if (typeof window.ethereum !== 'undefined') {
        //console.log('MetaMask is installed!');
        let res = isConnected();
        document.getElementById('showBody').classList.remove('d-none');
    } else {
        showAlert('Please connect Metamask', 2, 1);
    }



});