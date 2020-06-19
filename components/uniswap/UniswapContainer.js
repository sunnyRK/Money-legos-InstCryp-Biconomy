import React, { Component } from 'react';
// import Axios from 'axios';
import { toast } from 'react-toastify';

import Uniswap from './Uniswap';
import web3 from '../../biconomyProvider/realweb3';
import web3Biconomy from '../../biconomyProvider/web3Biconomy';
import {
  getUniswapV2Router,
  getERCContractInstance,
  TokenInfoArray,
  PairInfoArray,
  tagOptions,
  MAX_ALLOWANCE
} from '../../config/swapconfig/contractinstances';
import { getWalletContractInstance } from '../wallet/wallet-helper/walletinstance';

class UniswapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeLoading: false,
      amountSwapDesired: '',
      // amountOut: '',
      pairTokens: [],
      token0: '',
      token1: '',
      minValue: 0,
      // shouldSwap: false,
      pairAddress: '',
      routeraddress: '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a',
    };
  }

    swapExactTokensForTokens = async (event) => {
      event.preventDefault();
      const {
        token0, routeraddress, amountSwapDesired, pairAddress,
        minValue, token1,
      } = this.state;
      try {
        this.setState({ tradeLoading: true });
        const accounts = await web3.eth.getAccounts();

        const walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
        const contractInstance = getWalletContractInstance(web3, walletAddress);
        const acc = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
  
        const erc20ContractInstance2 = await getERCContractInstance(web3Biconomy, token0);
        let allowance = await erc20ContractInstance2.methods.allowance(acc, routeraddress).call();
        console.log(acc)
        console.log(allowance)
        console.log(amountSwapDesired)
        if(parseInt(allowance) < parseInt(amountSwapDesired)) {
          await erc20ContractInstance2.methods.approve(
            routeraddress, 
            MAX_ALLOWANCE
          ).send({
            from: accounts[0]
          });
          toast.success("Transaction approved!!", {
            position: toast.POSITION.TOP_RIGHT
          }); 
        }
        const biconomyAddressBalance = await erc20ContractInstance2.methods.balanceOf(acc).call();
        // const pairInstance = await getUniswapV2Pair(web3, pairAddress);
        // const reserves = await pairInstance.methods.getReserves().call();
        // console.log(reserves)

        const routeContractInstance = await getUniswapV2Router(web3Biconomy);
        // // console.log(Math.floor(new Date().getTime()/1000) + 86400)
        if(parseInt(biconomyAddressBalance) >= parseInt(amountSwapDesired)) {
          const transactionHash = await routeContractInstance.methods.swapExactTokensForTokens(
            parseInt(amountSwapDesired),
            parseInt(minValue),
            [TokenInfoArray[0][token0].token_contract_address, TokenInfoArray[0][token1].token_contract_address],
            accounts[0],
            Math.floor(new Date().getTime() / 1000) + 86400,
          ).send({
            from: accounts[0],
          });
          console.log(transactionHash.transactionHash)
          if(transactionHash.transactionHash != undefined && transactionHash.transactionHash != "") {
            toast.success("Transaction Successfull!!", {
              position: toast.POSITION.TOP_RIGHT
            }); 
            toast.success("Transaction Hash: " + transactionHash.transactionHash, {
              position: toast.POSITION.TOP_RIGHT
            }); 
          } else {
            toast.error("Transaction Failed!!", {
              position: toast.POSITION.TOP_RIGHT
            }); 
          }
        }
        this.setState({ tradeLoading: false });
      } catch (error) {
        this.setState({ tradeLoading: false });
        console.log(error);
      }
    };

    handlePairs = (e, { value }) => {
      const pair = [
        {
          key: PairInfoArray[0][value].token0,
          text: (
            <div>
              <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
              {PairInfoArray[0][value].token0}
            </div>
          ),
          value: PairInfoArray[0][value].token0,
          // label: { color: 'red', empty: true, circular: true },
        },
        {
          key: PairInfoArray[0][value].token1,
          text: (
            <div>
              <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
              {PairInfoArray[0][value].token1}
            </div>
          ),
          value: PairInfoArray[0][value].token1,
          // label: { color: 'blue', empty: true, circular: true },
        },
      ];

      this.setState({
        tradePairTokens: value,
        pairTokens: pair,
        token0: PairInfoArray[0][value].token0,
        token1: PairInfoArray[0][value].token1,
        pairAddress: PairInfoArray[0][value].pairaddress,
      });
    };

    handlePairTokens = (e, { value }) => {
      const { token0, token1 } = this.state;
      let tempToken2;
      if (value !== token0) {
        tempToken2 = token0;
      } else {
        tempToken2 = token1;
      }
      this.setState({ token0: value, token1: tempToken2 });
    };

    handleInputPrice = async (e, { value }) => {
      const { token0 } = this.state;
      if (token0 !== '') {
        this.setState({
          amountSwapDesired: event.target.value,
          // amountOut: "Wait...",
          // slippage: "Wait..."
        });
        // const amountOut = await this.getAmountOutValue();
      } else {
        alert("Please select token among pair.")
      }
    }

    render() {
      const {
        tradePairTokens, pairTokens, amountSwapDesired,
        tradeLoading,
      } = this.state;
      return (
        <Uniswap
          swapExactTokensForTokens={this.swapExactTokensForTokens}
          tradePairTokens={tradePairTokens}
          tagOptions={tagOptions}
          MAX_ALLOWANCE={MAX_ALLOWANCE}
          handlePairs={this.handlePairs}
          pairTokens={pairTokens}
          handlePairTokens={this.handlePairTokens}
          amountSwapDesired={amountSwapDesired}
          handleInputPrice={this.handleInputPrice}
          tradeLoading={tradeLoading}
        />
      );
    }
}

export default UniswapContainer;
