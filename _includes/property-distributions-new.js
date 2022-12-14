//set up web3
let web3 = new Web3(Web3.givenProvider || RPCUrl);

let currentAccountAddress;
let currentBalance = 0;
let property;
var disResults;

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

const updateValues = async (disResults, customValue = 0) => {


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
    let cyrptoValue
    if (customValue == 0)
        cyrptoValue = currentPrice / 100 * currentBalance * 100
    else
        cyrptoValue = currentPrice / 100 * customValue * 100


    //update the values
    cryptoValue = Number(cyrptoValue.toFixed(2));
    let cyrptoValuef = formatCurencyUSD(cryptoValue);
    let totalCostsf = formatCurencyUSD(disResults.totalCosts);
    let totalPaymentsf = formatCurencyUSD(disResults.totalPayments);
    let totalDistf = formatCurencyUSD(disResults.totalDistributions);
    let totalLeftf = formatCurencyUSD(disResults.totalLeft);
    let perToLeave = document.getElementById('inp-perLeave').value;
    let totalToPay
    let totalToPayUSD
    if (customValue == 0) {
        totalToPay = currentBalance / 100 * perToLeave;
        totalToPay = currentBalance - totalToPay
        totalToPayUSD = cryptoValue / 100 * perToLeave
        totalToPayUSD = cryptoValue - totalToPayUSD;
    } else {
        totalToPay = customValue / 100 * perToLeave;
        totalToPay = customValue - totalToPay
        totalToPayUSD = cryptoValue / 100 * perToLeave
        totalToPayUSD = cryptoValue - totalToPayUSD;
    }

    if (customValue > currentBalance) {
        updateIt = 0;
        showAlert(`Custom amount cannot be greater than ${currentBalance}`, 2, 1)
        updateValues(disResults)
    } else {
        let totalToPayUSDf = formatCurencyUSD(totalToPayUSD);
        //console.log(totalToPay)
        if (disResults.totalLeft > cryptoValue) {
            showAlert("There is less funds in the account than the total owed so we are going to use the whole balance", 2, 0)
        }
        let table = `<table class="table">`
        table = addTableRow("Current BNB price", formatCurencyUSD(currentPrice), table);
        table = addTableRow("Token", `<a href="${disResults.token.blockExplorerUrl}" target="_blank">${disResults.token.name}</a>`, table);
        table = addTableRow("Available BNB", `${currentBalance} (${cyrptoValuef})`, table);
        table = addTableRow("Total Costs", totalCostsf, table);
        table = addTableRow("Total Payments", totalPaymentsf, table);
        table = addTableRow("Total Distributions", totalDistf, table);
        table = addTableRow("Total Left", totalLeftf, table);
        table = addTableRow("Total To Pay", ` ${totalToPay.toFixed(8)} (${totalToPayUSDf})`, table);
        table = table + "</table>";
        //console.log(table)
        let theTable = document.getElementById("dist-table");
        theTable.innerHTML = table;

        table = $('#owners-table').DataTable();
        table.clear();
        for (var i = 0; i < disResults.owners.length; ++i) {
            let theData = disResults.owners[i];
            let per = theData.tokenAmount / disResults.token.totalSupply;
            per = per * 100
            per = Math.round(per);

            //work out the amount of eth they getting
            let ownerAmount = totalToPay / 100 * per;
            ownerAmount = totalToPay - ownerAmount;

            let ownerToPayUSD = totalToPayUSD / 100 * per
            let ownerToPayUSDf = formatCurencyUSD(ownerToPayUSD);
            //ownerToPayUSD = currentPrice - ownerToPayUSD;
            disResults.owners[i].payAmount = ownerAmount;
            disResults.owners[i].payAmountInternational = ownerToPayUSD;
            //console.log(theData)

            var rowNode = table
                .row.add([theData.name, theData.email, theData.cryptoAddress,
                    `${theData.tokenAmount} (${per}%)`, `${ownerAmount.toFixed(8)} (${ownerToPayUSDf})`
                ])
                .draw()

        }
        table.columns.adjust();

        if (customValue == 0)
            document.getElementById('inp-customAmount').value = totalToPay.toFixed(8);

        window.localStorage.distributions = JSON.stringify(disResults);
    }
}


//check if we are connected to metamask and if not then show the connect meta button
const isConnected = async (disResults) => {
    console.log(disResults)
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
            updateValues(disResults)
            document.getElementById('showBody').classList.remove('d-none');
            document.getElementById("spinner").classList.add("d-none");
            //document.getElementById('btn-pay').disabled = false;
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


const ethRequestSend = async (toAddress, fromAddress, theValue) => {
    try {
        const transactionParameters = {
            from: fromAddress,
            to: toAddress,
            value: theValue,
        };

        // txHash is a hex string
        // As with any RPC call, it may throw an error
        const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        return { "status": "ok", "hash": `${txHash}` };
    } catch (e) {
        //show the error (usually user hitting the reject button on metamask)
        return { "status": "error", "hash": "" };

    }

}


document.getElementById('inp-perLeave').addEventListener('keyup', async function() {

    disResults = window.localStorage.distributions;
    disResults = JSON.parse(disResults)
    updateValues(disResults, document.getElementById('inp-customAmount').value)

})

document.getElementById('inp-customAmount').addEventListener('keyup', async function() {
    console.log(this.value)
    let updateIt = 1;
    if (this.value == 0)
        updateIt = 0

    if (updateIt == 1) {
        disResults = window.localStorage.distributions;
        disResults = JSON.parse(disResults)
        updateValues(disResults, this.value)
    }
})

document.getElementById('btn-pay').addEventListener('click', async function() {
    //document.getElementById('btn-pay').disabled = true;
    currentAccountAddress = await ethRequest();
    //console.log(currentAccountAddress)
    disResults = window.localStorage.distributions;
    disResults = JSON.parse(disResults)
    for (var i = 0; i < disResults.owners.length; ++i) {
        let toAddress = disResults.owners[i].cryptoAddress;
        let theValue = disResults.owners[i].payAmount;

        theValue = await web3.utils.toWei(String(theValue), 'ether');
        theValue = await web3.utils.toHex(theValue)
        //console.log(toAddress)
        //console.log(fromAddress)
        //console.log(theValue)
        let res = await ethRequestSend(toAddress, currentAccountAddress, theValue);
        //console.log(res)
        if (res.hash != "") {
            property = JSON.parse(window.localStorage.currentDataItem);
            theDate = getTodatsDate();
            let theJson = { "name": `${disResults.owners[i].name}`, "amountInternational": `${disResults.owners[i].payAmountInternational}`, "amountCrypto": `${disResults.owners[i].payAmount}`, "hash": `${res.hash}`, "paidBy": 6, "propertyId": property.id, "propertyOwnerId": `${disResults.owners[i].id}`, "datePaid": theDate }
            let bodyObj = {
                table: "property_distribution",
                tableData: theJson,
            }
            let bodyObjectJson = JSON.stringify(bodyObj);

            let xhrDone = (res) => {
                console.log(res)
                showAlert(res.message, 1, 0, 1);
            }
            //post the record
            xhrcall(0, `api/database/table/`, bodyObjectJson, "json", "", xhrDone, token)
        }
    }
    //document.getElementById('btn-pay').disabled = false;

})



whenDocumentReady(isReady = () => {

    //process the data item.
    let getMainTableDone = (disResults) => {
        //store it
        disResults = JSON.parse(disResults);
        //console.log(disResults);
        property = JSON.parse(window.localStorage.currentDataItem);
        if (typeof window.ethereum !== 'undefined') {
            //console.log('MetaMask is installed!');
            let res = isConnected(disResults);

        } else {
            showAlert('Please connect Metamask', 2, 1);
        }
    }
    document.getElementById("spinner").classList.remove("d-none");
    showAlert('Please be patient we doing Blockchain stuff', 1)
    url = adminUrl + `properties/distributions?id=${window.localStorage.currentDataItemId}`
    xhrcall(1, url, "", "json", "", getMainTableDone, token);
});