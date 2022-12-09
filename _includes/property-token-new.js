//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}
//set the factory address
//note : we want to move this to the env var
let factoryContractAbi;
if (network == "testnet") {
    //testnet abi
    factoryContractAbi = [{
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
} else {
    //note 
    //do the live abi
    factoryContractAbi = [{
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
}

//set up web3
let web3 = new Web3(Web3.givenProvider || RPCUrl);
//set an account variable
let currentAccount = "";

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
    //get the accounts
    currentAccount = await getAccounts();
    //checj that there are some accounts
    if (currentAccount === undefined) {
        //no accounts show connect account button
        showAlert('Please connect Metamask', 1, 0);
        document.getElementById('btn-token-connect-metamask').classList.remove('d-none');
        //set connectiont to false
        conn = false;
    } else {
        //show the deploy button
        document.getElementById('btn-token-deploy').classList.remove('d-none');
        //set connection to true
        conn = true;
    }
    return conn;
}

//this function check we are connected
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

async function deployIt() {
    try {
        //get the values
        let _name = document.getElementById('inp-name').value;
        let _symbol = document.getElementById('inp-contractSymbol').value;
        let _totalSupply = document.getElementById("inp-totalSupply").value;
        //show the alert
        showAlert("Deploying contract please wait", 1, 0);
        //set the salt
        let _salt = web3.utils.fromAscii(cryptoSalt);
        //set the contract
        const DeployContract = new web3.eth.Contract(factoryContractAbi, factoryContractAddress);
        //call the deploy contract function
        let res = await DeployContract.methods.deploy(_name, _symbol, _totalSupply, _salt).send({ from: currentAccount });
        //store the address
        let tmpAddress = res.events[0].address;
        //update the details
        document.getElementById("inp-isDeployed").value = "1"
        document.getElementById("inp-contractAddress").value = `${blockExplorer}token/${tmpAddress}`;
        document.getElementById("btn-token-deploy").classList.add('d-none');
        document.getElementById("btn-create").classList.remove('d-none');
        showAlert("Contract deployed", 1, 1);
    } catch (e) {
        document.getElementById('btn-token-deploy').disabled = false;
        showAlert(e.message, 2);
        //console.error(e);
    } finally {}

}

let skipDeploy = () => {
    var checkBox = document.getElementById("skipDeploy");
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
        document.getElementById("inp-isDeployed").value = "1"
        document.getElementById("btn-token-deploy").classList.add('d-none');
        document.getElementById("btn-create").classList.remove('d-none');
    } else {
        document.getElementById("inp-isDeployed").value = "0"
        document.getElementById("btn-token-deploy").classList.remove('d-none');
        document.getElementById("btn-create").classList.add('d-none');
    }
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
    //set table name
    document.getElementById('formTableName').value = theTable;




});