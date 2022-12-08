/*

    As this page interacts with the block chain it does a lot more than the standard table insert to we have to override it with its own 
    new.js to stop the core insert from becoming to bloated. 


*/

let privateKey = "";
let tempHardcodedPrivKey = "<ADD PRIVATE KEY HERE>";
let web3 = new Web3(Web3.givenProvider || contractUrl);
//set the contract address
let currentAccount = "";

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

/*


const getAccounts = async () => {
    account = "";
    if(privateKey === "") {
        account = await web3.eth.getAccounts((error, result) => {
            if (error) {
                console.log(error);
            } else {
                return result;
            }
        });
    } else {
        let result = await web3.eth.accounts.privateKeyToAccount(privateKey);
        account = result.address;
        return account;
    }

    return account[0];
}

const isConnected = async () => {
    let conn = false;

    if(!window.ethereum) {
        return false;
    }

    currentAccount = await getAccounts();
    console.log(currentAccount);
    if(currentAccount === undefined) {
        conn = false;
    } else {
        conn = true;
    }

    if(!web3.currentProvider.isMetaMask) {
        conn = false;
        web3 = new Web3("https://data-seed-prebsc-1-s2.binance.org:8545/");
    } else {
        web3 = new Web3(Web3.givenProvider);
    }

    //console.log(currentAccount);
    walletConnected = conn
    return conn;
}

let res2 = isConnected(); //checkWallet();


*/

const getAccounts = async () => {
    accounts = await web3.eth.getAccounts((error, result) => {
            if (error) {
                console.log(error);
            } else {
                return result;
            }
        });
    return (accounts);
}

const isConnected = async () => {
    acccounts = await getAccounts();
    console.log(accounts)
    return(accounts);
}


// useless async here
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
        showAlert(e.message, 2, 0);
        //console.error(e);
    } finally {}

}




//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //show the body div
    document.getElementById('showBody').classList.remove('d-none');
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






    //(async () => {
   
    //})();


    document.getElementById('btn-token-deploy').addEventListener('click', function() {

        //(async () => {
        //    res = await deployIt();
        //})();


    })

});


     let accounts = isConnected(); //checkWallet();
     /*
        console.log(accounts.length);
        console.log(accounts)
        if (accounts.length == 0) {
            showAlert("Please connect meta mask", 2, 1);
        } else {

            currentAccount = accounts[0];
            document.getElementById("btn-token-deploy").disabled = false;

        }
    */