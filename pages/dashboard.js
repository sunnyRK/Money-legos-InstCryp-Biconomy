import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import WalletContainer from '../components/wallet/WalletContainer';
import KyberContainer from '../components/kyber/KyberContainer';
import UniswapContainer from '../components/uniswap/UniswapContainer';
import Sidebar from '../components/Sidebar';
// import ProfileActions from '../components/profile-actions/ProfileActionsContainer';

import web3 from '../biconomyProvider/web3Biconomy';
import { getWalletContractInstance } from '../components/wallet/wallet-helper/walletinstance';
import biconomy from '../biconomyProvider/biconomy';
import { biconomyLogin } from '../components/wallet/wallet-helper/walletfunctions';

const menuItems = [
  {
    icon: 'home',
    label: 'Wallet',
    content: <WalletContainer />,
    showTransactionHistory: true,
  },
  {
    icon: 'gamepad',
    label: 'Kyber',
    content: <KyberContainer />,
    showTransactionHistory: true,
  },
  {
    icon: 'camera',
    label: 'Uniswap',
    content: <UniswapContainer />,
    showTransactionHistory: true,
  },
];

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      biconomyAddress: '',
      biconomyLoginLoading: false,
      metamaskAddress: 'Not Logged In',
    };
  }

  onMenuItemClick = (index) => {
    this.setState({ activeIndex: index });
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
      } else if (response && response.userContract) {
        console.log('Successfully logged in...');
        console.log(response.userContract);
        responseAddress = response.userContract;
        alert('Login Successful...');

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

  render() {
    const {
      activeIndex, biconomyAddress, biconomyLoginLoading, metamaskAddress,
    } = this.state;
    return (
      <div className="dashboard">
        <ToastContainer />
        <Sidebar
          onMenuItemClick={this.onMenuItemClick}
          activeIndex={activeIndex}
          menuItems={menuItems}
          onBiconomyLogin={this.onBiconomyLogin}
          biconomyAddress={biconomyAddress}
          biconomyLoginLoading={biconomyLoginLoading}
          metamaskAddress={metamaskAddress}
        />
        {/* <ProfileActions /> */}
      </div>
    );
  }
}

export default Index;
