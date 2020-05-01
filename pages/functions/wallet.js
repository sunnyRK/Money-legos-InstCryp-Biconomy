import {getWalletContractInstance} from './contractinstance'

export async function approve(web3, contractInstance, spender, value) {
    try{
        const accounts = await web3.eth.getAccounts();
        await contractInstance.methods.approve(
            spender,
            value
        ).send({
            from:accounts[0]
        }).on("transactionHash", (hash) => {
            // alert("Transaction hash: " +  hash);
        }).once("confirmation", (confirmationCount, receipt) => {   
            // alert("Transaction confirmed!")
        }).on("error", (error)=>{
            console.log(error);
        });
    }catch(err){
        console.log(err);
    }
}

export async function transferFromTokens(web3, walletAddress, tokenSymbol, recipientAddress, value) {
    let transactionHash;
    try{
        console.log("Transfer");
        const accounts = await web3.eth.getAccounts();
        const contractInstance = getWalletContractInstance(web3, walletAddress);
        await contractInstance.methods.transferFromTokens(
            accounts[0],
            web3.utils.fromAscii(tokenSymbol),
            recipientAddress,
            parseInt(value)
        ).send({
            from:accounts[0]
        }).on("transactionHash", (hash) => {
            transactionHash = hash;
            // alert("Transaction hash: " +  hash);
        }).once("confirmation", (confirmationCount, receipt) => {
            // alert("Transaction confirmed!")
        }).on("error", (error) => {
            console.log("error");
            console.log(error);
        });
    }catch(err){
        console.log(err);
        return;
    }
    return transactionHash;
}

export async function transferTokens(web3, walletAddress, tokenSymbol, recipientAddress, value) {
    try{
        const accounts = await web3.eth.getAccounts();
        const contractInstance = getWalletContractInstance(web3, walletAddress);
        await contractInstance.methods.transferTokens(
            web3.utils.fromAscii(tokenSymbol),
            recipientAddress,
            parseInt(value)
        ).send({
            from:accounts[0]
        }).on("transactionHash", (hash) => {
            alert("Transaction hash: " +  hash);
        }).once("confirmation", (confirmationCount, receipt) => {
            alert("Transaction confirmed!")
        }).on("error", (error) => {
            console.log("error");
            console.log(error);
        });
    }catch(err){
        console.log(err);
    }
}

export async function biconomyLogin(web3, contractInstance, biconomyAddress) {
    try{
        const accounts = await web3.eth.getAccounts();
        await contractInstance.methods.biconomyLogin(
            accounts[0],
            biconomyAddress
        ).send({
            from:accounts[0]
        }).on("transactionHash", (hash) => {
            alert("Transaction hash: " +  hash);
        }).once("confirmation", (confirmationCount, receipt) => {
            alert("Transaction confirmed!")
        }).on("error", (error) => {
            console.log("error");
            console.log(error);
        });
    }catch(err){
        console.log(err);
    }
}

export async function addTransaction(web3, contractInstance, biconomyAddress, tokenSymbol, to, value, hash) {
    let transactionHash;
    try{
        alert("Transfer Successfull. Now Adding Transaction to transaction history!");
        const accounts = await web3.eth.getAccounts();
        await contractInstance.methods.addTransaction(
            biconomyAddress,
            web3.utils.fromAscii(tokenSymbol), 
            to, 
            value, 
            hash
        ).send({
            from:accounts[0]
        }).on("transactionHash", (hash) => {
            transactionHash = hash
            // alert("Transaction hash: " +  hash);
        }).once("confirmation", (confirmationCount, receipt) => {
            // alert("Transaction confirmed!")
        }).on("error", (error) => {
            console.log("error");
            console.log(error.message);
        });
    }catch(err){
        console.log(err);
        return;
    }
    return transactionHash;
}


export async function transferErc20(web3, contractInstance, to, value) {
    let status;
    try{
        const accounts = await web3.eth.getAccounts();
        await contractInstance.methods.transfer(
            to,
            value
        ).send({
            from:accounts[0]
        }).on("transactionHash", (hash) => {
            // alert("Transaction hash: " +  hash);
        }).once("confirmation", (confirmationCount, receipt) => {   
            // alert("Transaction confirmed!")
            console.log(receipt.status);
            status = receipt.status
        }).on("error", (error)=>{
            console.log(error);
        });
    }catch(err){
        console.log(err);
        return;
    }
    return status;
}

