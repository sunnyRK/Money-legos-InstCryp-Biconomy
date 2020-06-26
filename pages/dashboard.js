import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import WalletContainer from '../components/wallet/WalletContainer';
import KyberContainer from '../components/kyber/KyberContainer';
import UniswapContainer from '../components/uniswap/UniswapContainer';
import Sidebar from '../components/Sidebar';
import realweb3 from '../biconomyProvider/realweb3';
// import ProfileActions from '../components/profile-actions/ProfileActionsContainer';

import web3 from '../biconomyProvider/web3Biconomy';
import { getERCContractInstance, getWalletContractInstance } from '../components/wallet/wallet-helper/walletinstance';
import biconomy from '../biconomyProvider/biconomy';
import { biconomyLogin, transferErc20 } from '../components/wallet/wallet-helper/walletfunctions';

const menuItems = [
  {
    icon: 'google wallet',
    label: 'Wallet',
    content: <WalletContainer />,
    showTransactionHistory: true,
  },
  {
    icon: 'chevron right',
    label: 'Kyber',
    content: <KyberContainer />,
    showTransactionHistory: true,
  },
  {
    icon: 'chevron right',
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

      collateralTokenSymbol: 'TKN',
      collateralUploadLoading: false,
      collateralValue: '',
      
      removeCollateralTokenSymbol: 'TKN',
      removeCollateralUploadLoading: false,
      removeCollateralValue: '',
    };
  }

  async componentDidMount() {
    try {
      await window.ethereum.enable()
      window.web3 = web3  
      const accounts = await web3.eth.getAccounts();
      const walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
      const contractInstance = getWalletContractInstance(web3, walletAddress);
      const bAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
      // alert(bAddress)
      if (bAddress == '0x0000000000000000000000000000000000000000' || bAddress == '') {
        this.setState({
          metamaskAddress: accounts[0],
        });
      } else {
        this.setState({
          biconomyAddress: bAddress,
          metamaskAddress: accounts[0],
        });
      }
    } catch (error) {
      console.log(error)
    }
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
          console.log("biconomy address: ", bAddress);
          this.setState({
            biconomyAddress: bAddress,
            metamaskAddress: accounts[0],
          });
        }
      } else if (response && response.userContract) {
        console.log('Successfully logged in...');
        console.log(response.userContract);
        responseAddress = response.userContract;

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
      console.log(error);
    }
  };

  onDeposit = async () => {
    try {
        this.setState({collateralUploadLoading:true});
        var accounts = await realweb3.eth.getAccounts();
        var walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
        const contractInstance = getWalletContractInstance(realweb3, walletAddress);
        const biconomyAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
        if(biconomyAddress != "0x0000000000000000000000000000000000000000" || biconomyAddress != "") {
            var collateralTokenSymbol = this.state.collateralTokenSymbol;
            var collateralValue = this.state.collateralValue;
            // const _inst = await getERCContractInstance(realweb3, collateralTokenSymbol);
            // alert(biconomyAddress)
            // const status = await  transferErc20(realweb3, _inst, biconomyAddress, collateralValue); //transfer collateral for meta transaction
            // if(status) {
            //     toast.success("You have deposited Crypto for meta transaction !", {
            //         position: toast.POSITION.TOP_RIGHT
            //     });
            // } else {
                // toast.error("Transaction Failed!!", {
                //     position: toast.POSITION.TOP_RIGHT
                // }); 
            // }
        } else {
            toast.warn("Please first login to biconomy using above biconomy button !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        this.setState({collateralUploadLoading:false});
      } catch (error) {
          this.setState({collateralUploadLoading:false});
          console.log(error);
      }
  }


  handleCollateralValue =  (e, { value }) => this.setState({ collateralValue: value }); 
  handleChangeCollateralTokenSymbol =  (e, { value }) => {
    this.setState({ collateralTokenSymbol: value }); 
  };
  handleremoveCollateralValue =  (e, { value }) => this.setState({ removeCollateralValue: value }); 
  handleChangeremoveCollateralTokenSymbol =  (e, { value }) => this.setState({ removeCollateralTokenSymbol: value }); 

  render() {
    const {
      activeIndex, biconomyAddress, biconomyLoginLoading, metamaskAddress, 
      collateralUploadLoading, collateralTokenSymbol, collateralValue, 
      removeCollateralUploadLoading, removeCollateralValue, removeCollateralTokenSymbol,
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

          // onDeposit={this.onDeposit}
          // collateralUploadLoading={collateralUploadLoading}
          // collateralTokenSymbol={collateralTokenSymbol}
          // collateralValue={collateralValue}
          // handleCollateralValue={this.handleCollateralValue}
          // handleChangeCollateralTokenSymbol={this.handleChangeCollateralTokenSymbol}

          onWithdraw={this.onWithdraw}
          removeCollateralUploadLoading={removeCollateralUploadLoading}
          removeCollateralTokenSymbol={removeCollateralTokenSymbol}
          removeCollateralValue={removeCollateralValue}
          handleremoveCollateralValue={this.handleremoveCollateralValue}
          handleChangeremoveCollateralTokenSymbol={this.handleChangeremoveCollateralTokenSymbol}
        />
        {/* <ProfileActions /> */}
      </div>
    );
  }
}

export default Index;
