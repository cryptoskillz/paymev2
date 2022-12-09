//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let web3 = new Web3(Web3.givenProvider || "https://data-seed-prebsc-1-s2.binance.org:8545/");
//set the contract abi
let contractAbi = [{
    "inputs": [{
            "internalType": "string",
            "name": "_name",
            "type": "string"
        },
        {
            "internalType": "string",
            "name": "_symbol",
            "type": "string"
        },
        {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
        },
        {
            "internalType": "bytes32",
            "name": "_salt",
            "type": "bytes32"
        }
    ],
    "name": "deploy",
    "outputs": [{
        "internalType": "address",
        "name": "",
        "type": "address"
    }],
    "stateMutability": "payable",
    "type": "function"
}]

let currentAccount = "";

const getAccounts = async () => {
    account = "";
    account = await web3.eth.getAccounts();
    return account[0];
}

const isConnected = async () => {
    let conn = false;
    currentAccount = await getAccounts();
    if (currentAccount === undefined) {
        showAlert('Please connect Metamask', 1);
        document.getElementById('btn-token-connect-metamask').classList.remove('d-none');
        conn = false;
    } else {
        document.getElementById('btn-token-deploy').classList.remove('d-none');
        conn = true;
    }
    return conn;
}

const ethRequest = async () => {
    try {
        let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        return (accounts[0])
    } catch (e) {
        console.log(e);
        showAlert(e.message, 2);
    }

}

async function deployIt() {
    try {
        //debug
        //console.log(_name);
        //console.log(_symbol);
        //console.log(_totalSupply);
        //get the values
        let _name = document.getElementById('inp-name').value;
        let _symbol = document.getElementById('inp-contractSymbol').value;
        let _totalSupply = document.getElementById("inp-totalSupply").value;
        //show the alert
        showAlert("Deploying contract please wait", 1, 0);
        //set the salt
        let _salt = web3.utils.fromAscii(cryptoSalt);
        //set the contract
        const DeployContract = new web3.eth.Contract(contractAbi, contractAddress);
        //call the deploy contract function
        let res = await DeployContract.methods.deploy(_name, _symbol, _totalSupply, _salt).send({ from: currentAccount });
        //store the address
        let tmpAddress = res.events[0].address;
        //update the details
        document.getElementById("inp-isDeployed").value = "1"
        document.getElementById("inp-contractAddress").value = `${blockExplorer}${tmpAddress}`;
        document.getElementById("btn-token-deploy").classList.add('d-none');
        document.getElementById("btn-create").classList.remove('d-none');
        showAlert("Contract deployed", 1, 1);
        console.log(tmpAddress);
    } catch (e) {
        document.getElementById('btn-token-deploy').disabled = false;
        showAlert(e.message, 2, 0);
        //console.error(e);
    } finally {}

}


document.getElementById('btn-token-deploy').addEventListener('click', async function() {


    let res = await isConnected();
    if (res == false) {
        showAlert('Please connect Metamask', 1);
    } else {
        document.getElementById('btn-token-deploy').disabled = true;
        res = await deployIt();
    }



});

document.getElementById('btn-token-connect-metamask').addEventListener('click', async function() {
    let res = await ethRequest();
    if (res != undefined) {
        document.getElementById('btn-token-connect-metamask').classList.add('d-none');
        document.getElementById('btn-token-deploy').classList.remove('d-none');
    } else {
        showAlert('Please connect Metamask', 1);
    }
    console.log("ddd")
    console.log(res)
});



whenDocumentReady(isReady = () => {

    //get the current property
    let dataItem = JSON.parse(window.localStorage.currentDataItem);
    //clean up the name
    let name = dataItem.name.replace(" ", "");
    //get a symbol
    let symbol = name.substring(0, 3);
    //set the token name
    document.getElementById('inp-name').value = name + 'Token';
    //set the token supply
    document.getElementById('inp-totalSupply').value = dataItem.localCost;
    //set the toekn symbol
    document.getElementById('inp-contractSymbol').value = symbol;
    //set the property id
    document.getElementById('inp-propertyId').value = dataItem.id;
    //get the deployed value
    document.getElementById('inp-isDeployed').value = "0";


    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    } else {
        showAlert('Please connect Metamask', 2, 1);
    }

    let res = isConnected();




    //show the body div
    document.getElementById('showBody').classList.remove('d-none');





});