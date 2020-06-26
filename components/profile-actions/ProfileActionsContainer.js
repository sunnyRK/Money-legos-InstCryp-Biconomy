import React, { Component } from 'react';
import { toast } from 'react-toastify';

import ProfileActions from './ProfileActions';
import realweb3 from '../../biconomyProvider/realweb3';

// import web3 from '../../biconomyProvider/web3Biconomy';
import { getWalletContractInstance, getERCContractInstance } from '../wallet/wallet-helper/walletinstance';
// import biconomy from '../../biconomyProvider/biconomy';
import { biconomyLogin, transferErc20 } from '../wallet/wallet-helper/walletfunctions';

class ProfileActionsContainer extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   collateralTokenSymbol: 'DAI',
    //   collateralUploadLoading: false,
    //   collateralValue: '',
    // };
  }

  state = {
    collateralTokenSymbol: 'DAI',
    collateralUploadLoading: false,
    collateralValue: ''
  };

  // constructor(props) {
  //   super(props);
    // this.state = {
    //   biconomyAddress: '',
    //   biconomyLoginLoading: false,
    //   metamaskAddress: 'Not Logged In',
    // };
  // }

  // onBiconomyLogin = async () => {
  //   try {
  //     this.setState({ biconomyLoginLoading: true });
  //     const accounts = await web3.eth.getAccounts();
  //     const walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
  //     const contractInstance = getWalletContractInstance(web3, walletAddress);
  //     let responseAddress;

  //     const response = await biconomy.login(accounts[0]);
  //     if (response && response.transactionHash) {
  //       console.log('Please wait...');
  //       console.log(response);
  //       const response2 = await biconomy.login(accounts[0]);
  //       console.log(response2);
  //       alert('Login Successful...');
  //       responseAddress = response2.userContract;
  //       const bAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
  //       if (bAddress == '0x0000000000000000000000000000000000000000' || bAddress == '') {
  //         alert('You are new biconomy user so press ok to register address in instcryp wallet');

  //         await biconomyLogin(web3, contractInstance, responseAddress);
  //         this.setState({
  //           biconomyAddress: responseAddress,
  //           metamaskAddress: accounts[0],
  //         });
  //       } else {
  //         this.setState({
  //           biconomyAddress: bAddress,
  //           metamaskAddress: accounts[0],
  //         });
  //       }
  //     } else if (response && response.userContract) {
  //       console.log('Successfully logged in...');
  //       console.log(response.userContract);
  //       responseAddress = response.userContract;
  //       alert('Login Successful...');

  //       const bAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
  //       if (bAddress === '0x0000000000000000000000000000000000000000' || bAddress === '') {
  //         alert('You are new biconomy user so press ok to register address in instcryp wallet');
  //         await biconomyLogin(web3, contractInstance, responseAddress);
  //         this.setState({
  //           biconomyAddress: responseAddress,
  //           metamaskAddress: accounts[0],
  //         });
  //       } else {
  //         this.setState({
  //           biconomyAddress: bAddress,
  //           metamaskAddress: accounts[0],
  //         });
  //       }
  //     }

  //     toast.success('You are logged in !', {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     this.setState({ biconomyLoginLoading: false });
  //   } catch (error) {
  //     this.setState({ biconomyLoginLoading: false });
  //     alert('Error');
  //     console.log(error);
  //   }
  // };

  
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
            const _inst = await getERCContractInstance(realweb3, collateralTokenSymbol);
            const status = await  transferErc20(realweb3, _inst, biconomyAddress, collateralValue); //transfer collateral for meta transaction
            
            // const status = await _inst.methods.transfer(
            //   biconomyAddress,
            //   web3.utils.toWei(collateralValue,"ether")
            // ).send({
            //     from:accounts[0]
            // })

            if(status) {
                toast.success("You have deposited Crypto for meta transaction !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("Transaction Failed!!", {
                    position: toast.POSITION.TOP_RIGHT
                }); 
            }
        } else {
            toast.warn("Please first login to biconomy using above biconomy button !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        // this.setState({collateralUploadLoading:false});
      } catch (error) {
          this.setState({collateralUploadLoading:false});
          console.log(error);
      }
  }

  handleCollateralValue =  (e, { value }) => this.setState({ collateralValue: value }); 
  handleChangeCollateralTokenSymbol =  (e, { value }) => {
    this.setState({ collateralTokenSymbol: value }); 
  };

  render() {
    const {
      onBiconomyLogin, biconomyAddress, biconomyLoginLoading,
      metamaskAddress, collateralUploadLoading, collateralTokenSymbol, 
      collateralValue,  
    } = this.props;
    return (
      <ProfileActions
        onBiconomyLogin={onBiconomyLogin}
        biconomyAddress={biconomyAddress}
        biconomyLoginLoading={biconomyLoginLoading}
        metamaskAddress={metamaskAddress}
        biconomyLoginLoading={biconomyLoginLoading}
        metamaskAddress={metamaskAddress}

        onDeposit={this.onDeposit}
        collateralUploadLoading={collateralUploadLoading}
        collateralTokenSymbol={collateralTokenSymbol}
        collateralValue={collateralValue}
        handleCollateralValue={this.handleCollateralValue}
        handleChangeCollateralTokenSymbol={this.handleChangeCollateralTokenSymbol}
      />
    );
  }
}

export default ProfileActionsContainer;
