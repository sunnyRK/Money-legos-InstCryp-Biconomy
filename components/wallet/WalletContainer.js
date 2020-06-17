import React, { Component } from 'react';
import { toast } from 'react-toastify';

import Wallet from './Wallet';
import { getERCContractInstance, getWalletContractInstance } from './wallet-helper/walletinstance';
import web3 from '../../biconomyProvider/web3Biconomy';
import { Router } from '../../routes';
import biconomy from '../../biconomyProvider/biconomy';
import permitDai from './wallet-helper/permitDai';

import {
  transferErc20,
  transferFromTokens,
  biconomyLogin,
  // addTransaction,
} from './wallet-helper/walletfunctions';
import { addTransaction } from './wallet-helper/walletapi';

class WalletContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenBalanceSymbol: 'DAI',
      tokenSymbol: 'DAI',
      sendLoanding: false,
      recipientAddress: '',
      value: '',
      metamaskAddress: 'Not Logged in',
      biconomyAddress: 'Not Logged in',
      biconomyLoginLoading: false,
      transactionLoading: false,
      checkBalanceLoading: false,
      tokenBalance: '',
    };
  }

  handleState = (key, value) => {
    this.setState({ [key]: value });
  }

  onBiconomyLogin = async () => {
    try {
      this.setState({ biconomyLoginLoading: true });
      const accounts = await web3.eth.getAccounts();
      const walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
      const contractInstance = getWalletContractInstance(web3, walletAddress);
      let responseAddress;

      const response = await biconomy.login(accounts[0]);
      if (response && response.transactionHash) {
        console.log('Please wait...');
        console.log(response);
        const response2 = await biconomy.login(accounts[0]);
        console.log(response2);
        alert('Login Successful...');
        responseAddress = response2.userContract;
        const bAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
        if (bAddress === '0x0000000000000000000000000000000000000000' || bAddress === '') {
          alert('You are new biconomy user so press ok to register address in instcryp wallet');

          await biconomyLogin(web3, contractInstance, responseAddress);
          this.setState({
            biconomyAddress: responseAddress,
            metamaskAddress: accounts[0],
          });
        } else {
          this.setState({
            biconomyAddress: bAddress,
            metamaskAddress: accounts[0],
          });
        }
      } else if (response && response.userContract) {
        console.log('Successfully logged in...');
        console.log(response.userContract);
        responseAddress = response.userContract;
        alert('Login Successful...');

        const bAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
        if (bAddress == '0x0000000000000000000000000000000000000000' || bAddress == '') {
          alert('You are new biconomy user so press ok to register address in instcryp wallet');
          await biconomyLogin(web3, contractInstance, responseAddress);
          this.setState({
            biconomyAddress: responseAddress,
            metamaskAddress: accounts[0],
          });
        } else {
          this.setState({
            biconomyAddress: bAddress,
            metamaskAddress: accounts[0],
          });
        }
      }

      toast.success('You are logged in !', {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({ biconomyLoginLoading: false });
    } catch (error) {
      this.setState({ biconomyLoginLoading: false });
      alert('Error');
      console.log(error);
    }
  };

  onTransactionHistory = async (event) => {
    event.preventDefault();
    try {
      this.setState({ transactionLoading: true });
      Router.pushRoute('/transactionHistory');
    } catch (err) {
      alert(err);
      this.setState({ transactionLoading: false });
    }
  };

  checkBalance = async (event) => {
    event.preventDefault();
    const { tokenBalanceSymbol } = this.state;
    try {
      this.setState({ checkBalanceLoading: true });
      const accounts = await web3.eth.getAccounts();
      const _inst = await getERCContractInstance(web3, tokenBalanceSymbol);
      const balance = await _inst.methods.balanceOf(accounts[0]).call();
      const balanceinether = balance / 1000000000000000000;
      const tokenBalanceLine = `$${balanceinether.toFixed(2)}(${balance} in wei) ${tokenBalanceSymbol}`;
      this.setState({
        checkBalanceLoading: false,
        tokenBalance: tokenBalanceLine,
      });
    } catch (err) {
      console.log(err);
      this.setState({ checkBalanceLoading: false });
    }
  };

  handleChangeTokenSymbol = (e, { value }) => this.setState({ tokenSymbol: value });

  handleChangeTokenSymbolBalance = (e, { value }) => this.setState({ tokenBalanceSymbol: value });

  onSubmit = async (event) => {
    event.preventDefault();
    try {
      this.setState({ sendLoanding: true });
      const { recipientAddress } = this.state;
      const { value, tokenSymbol } = this.state;
      const walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
      // var walletAddress = '0xD873e8f6ca19ec11960FBc43b78991ca2CdA2626';
      // spender address ropsten

      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      // DAI 0x4441490000000000000000000000000000000000000000000000000000000000
      // TKN 0x544b4e0000000000000000000000000000000000000000000000000000000000
      const contractInstance = getWalletContractInstance(web3, walletAddress);
      const biconomyAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();

      if (tokenSymbol === 'DAI') {
        const _inst = await getERCContractInstance(web3, tokenSymbol);

        const daiBalance = await _inst.methods.balanceOf(accounts[0]).call();
        if (parseInt(daiBalance) >= parseInt(value)) {
          const permitBalance = await _inst.methods.allowance(accounts[0], walletAddress).call();
          if (parseInt(permitBalance) >= parseInt(value)) {
            const hash = await transferFromTokens(web3, walletAddress, tokenSymbol, recipientAddress, parseInt(value));
            if (hash !== undefined) {
              toast.success(`You have transferred ${value} DAI !`, {
                position: toast.POSITION.TOP_RIGHT,
              });
              // const addHash =
              await addTransaction(accounts[0], biconomyAddress, tokenSymbol, recipientAddress, parseInt(value), hash);
              // if(addHash != "undefined") {
              //     toast.success("Transaction added to transaction history !", {
              //         position: toast.POSITION.TOP_RIGHT
              //     });
              //     toast.success("Transaction Hash: "+ addHash, {
              //         position: toast.POSITION.TOP_RIGHT
              //     });
              // } else {
              //     toast.error("Transaction is not added in Transaction history!!", {
              //         position: toast.POSITION.TOP_RIGHT
              //     });
              // }
            } else {
              toast.error('Transfer Failed!!', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
          } else {
            alert('You need to first give permit to access your balance to wallet.');
            await permitDai(web3, accounts[0], walletAddress, recipientAddress, parseInt(value), contractInstance, biconomyAddress);
          }
        } else {
          toast.error('Insufficient Balance.', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        if (biconomyAddress != '0x0000000000000000000000000000000000000000' || biconomyAddress != '') { // eslint-disable-line
          const _inst = await getERCContractInstance(web3, tokenSymbol);
          const biconomyAddressBalance = await _inst.methods.balanceOf(biconomyAddress).call();
          if (parseInt(biconomyAddressBalance) >= parseInt(value)) {
            const hash = await transferErc20(web3, _inst, recipientAddress, parseInt(value)); // transfer
            if (hash[0]) {
              toast.success(`You have transferred ${value} ${tokenSymbol}`, {
                position: toast.POSITION.TOP_RIGHT,
              });

              // const addHash =
              await addTransaction(accounts[0], biconomyAddress, tokenSymbol, recipientAddress, parseInt(value), hash[1]);
              // if(addHash != undefined || addHash != "undefined") {
              //     toast.success("Transaction added to transaction history !", {
              //         position: toast.POSITION.TOP_RIGHT
              //     });
              //     toast.success("Transaction Hash: "+ addHash, {
              //         position: toast.POSITION.TOP_RIGHT
              //     });
              // } else {
              //     toast.error("Transaction is not added in Transaction history!!", {
              //         position: toast.POSITION.TOP_RIGHT
              //     });
              // }
            } else {
              toast.error('Transfer Failed!!', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
          } else {
            toast.error('Not Enough Deposit crypto in biconomy account address. Plase deposit crypto by Deposit section.', {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } else {
          toast.error('Please first login to biconomy using above biconomy button.', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        // try{
        //     let response = await biconomy.login(accounts[0]);
        //     if(response && response.transactionHash) {
        //         console.log("Please wait...");
        //     } else if (response && response.userContract) {

        //         console.log("Successfully logged in...");
        // console.log(response);
        // const _inst = await getERCContractInstance(web3, this.state.tokenSymbol);
        // console.log(_inst);

        // const walletInstance = await getWalletContractInstance(web3, walletAddress);
        // await approve(web3, _inst, walletAddress, parseInt(value));
        // await transferTokens(web3, walletAddress, this.state.tokenSymbol, recipientAddress, parseInt(value)); // transferFrom
        // await transferErc20(web3, _inst, recipientAddress, parseInt(value)); //transfer
        // await addTransaction(web3, contractInstance, tokenSymbol, recipientAddress, parseInt(value));
        // console.log("Done");
        //     }
        // } catch(error) {
        // console.log(`Error Code: ${error.code} Error Message: ${error.message}`);
        // }
      }
      this.setState({ sendLoanding: false });
    } catch (err) {
      this.setState({ sendLoanding: false });
      alert(err);
    }
  };

  render() {
    const {
      biconomyLoginLoading, metamaskAddress, biconomyAddress,
      transactionLoading, tokenBalanceSymbol, tokenSymbol, recipientAddress,
      tokenBalance, value, sendLoanding, checkBalanceLoading,
    } = this.state;
    return (
      <Wallet
        onBiconomyLogin={this.onBiconomyLogin}
        biconomyLoginLoading={biconomyLoginLoading}
        metamaskAddress={metamaskAddress}
        biconomyAddress={biconomyAddress}
        transactionLoading={transactionLoading}
        tokenBalanceSymbol={tokenBalanceSymbol}
        tokenSymbol={tokenSymbol}
        recipientAddress={recipientAddress}
        tokenBalance={tokenBalance}
        value={value}
        sendLoanding={sendLoanding}
        onTransactionHistory={this.onTransactionHistory}
        handleChangeTokenSymbol={this.handleChangeTokenSymbol}
        handleChangeTokenSymbolBalance={this.handleChangeTokenSymbolBalance}
        onSubmit={this.onSubmit}
        checkBalance={this.checkBalance}
        handleState={this.handleState}
        checkBalanceLoading={checkBalanceLoading}
      />
    );
  }
}

export default WalletContainer;
