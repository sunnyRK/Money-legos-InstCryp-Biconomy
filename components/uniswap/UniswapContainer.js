import React, { Component } from 'react';
// import Axios from 'axios';

import Uniswap from './Uniswap';
import web3 from '../../biconomyProvider/realweb3';
import web3Biconomy from '../../biconomyProvider/web3Biconomy';
import biconomy from '../../biconomyProvider/biconomy';
import {
  getUniswapV2Pair,
  getUniswapV2Router,
  // getUniswapV2Library,
  getERCContractInstance,
  TokenInfoArray,
  PairInfoArray,
  tagOptions,
} from '../../config/swapconfig/contractinstances';

class UniswapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tradeLoading: false,
      // addLiquidityLoading: false,
      // removeLiquidityLoading: false,
      // updateLoading: false,
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

        let acc;
        const response = await biconomy.login(accounts[0]);
        if (response && response.transactionHash) {
          console.log('response.transactionHash=====', response.transactionHash);
        } else if (response && response.userContract) {
          console.log(response.userContract);
          acc = response.userContract;
        }

        const erc20ContractInstance2 = await getERCContractInstance(web3Biconomy, token0);

        // let allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
        // if(parseInt(allowance) < parseInt(this.state.amountSwapDesired)) {
        await erc20ContractInstance2.methods.approve(
          routeraddress, // Uniswap router address
          amountSwapDesired,
        ).send({
          from: accounts[0]
        });
        // allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
        // }

        const biconomyAddressBalance = await erc20ContractInstance2.methods.balanceOf(acc).call();
        const allowance1 = await erc20ContractInstance2.methods.allowance(accounts[0], routeraddress).call();
        const allowance2 = await erc20ContractInstance2.methods.allowance(acc, routeraddress).call();
        console.log(accounts[0]);
        console.log(acc);
        console.log('allownace: ', allowance1);
        console.log('allownace: ', allowance2);
        console.log('balance: ', biconomyAddressBalance);

        const pairInstance = await getUniswapV2Pair(web3, pairAddress);
        const reserves = await pairInstance.methods.getReserves().call();
        console.log(reserves)

        const routeContractInstance = await getUniswapV2Router(web3Biconomy);
        // console.log(web3Biconomy);
        console.log(amountSwapDesired);
        console.log(minValue);
        console.log([TokenInfoArray[0][token0].token_contract_address, TokenInfoArray[0][token1].token_contract_address]);
        console.log(acc);
        // console.log(Math.floor(new Date().getTime()/1000) + 86400)
        const transactionHash = await routeContractInstance.methods.swapExactTokensForTokens(
          parseInt(amountSwapDesired),
          parseInt(minValue),
          [TokenInfoArray[0][token0].token_contract_address, TokenInfoArray[0][token1].token_contract_address],
          accounts[0],
          Math.floor(new Date().getTime() / 1000) + 86400,
        ).send({
          from: accounts[0],
        });
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
