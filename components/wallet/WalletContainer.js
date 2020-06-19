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
        toast.success(`Login Successful...`, {
          position: toast.POSITION.TOP_RIGHT,
        });
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
        toast.success(`Login Successful...`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        const bAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
        if (bAddress == '0x0000000000000000000000000000000000000000' || bAddress == '') {

          // Don't delete this alert
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
      console.log(error);
    }
  };

  onTransactionHistory = async (event) => {
    event.preventDefault();
    try {
      this.setState({ transactionLoading: true });
      Router.pushRoute('/transactionHistory');
    } catch (err) {
      console.log(err);
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
      const balance2 = await _inst.methods.balanceOf("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c").call();
      console.log("bal1, ", balance);
      console.log("bal11, ", balance/1000000000000000000);

      console.log("bal2, ", balance2);
      console.log("bal22, ", balance2/1000000000000000000);
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

      const accounts = await web3.eth.getAccounts();
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
              toast.success("Transaction Hash: "+ hash, {
                position: toast.POSITION.TOP_RIGHT
              });
    
              // Transaction added to transaction history
              await addTransaction(accounts[0], biconomyAddress, tokenSymbol, recipientAddress, parseInt(value), hash);
    
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
          console.log(biconomyAddressBalance)
          console.log(value)
          if (parseInt(biconomyAddressBalance) >= parseInt(value)) {
            const hash = await transferErc20(web3, _inst, recipientAddress, value); // transfer
            if (hash[0]) {
              toast.success(`You have transferred ${value} ${tokenSymbol}`, {
                position: toast.POSITION.TOP_RIGHT,
              });
              toast.success("Transaction Hash: "+ hash, {
                  position: toast.POSITION.TOP_RIGHT
              });
              
              // Transaction added to transaction history
              await addTransaction(accounts[0], biconomyAddress, tokenSymbol, recipientAddress, parseInt(value), hash[1]);
            
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
      }
      this.setState({ sendLoanding: false });
    } catch (err) {
      this.setState({ sendLoanding: false });
      console.log(err);
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
