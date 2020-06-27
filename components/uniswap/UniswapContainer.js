import React, { Component } from 'react';
// import Axios from 'axios';
import { toast } from 'react-toastify';

import Uniswap from './Uniswap';
import web3 from '../../biconomyProvider/realweb3';
import web3Biconomy from '../../biconomyProvider/web3Biconomy';
import biconomy from '../../biconomyProvider/biconomy'
let sigUtil = require("eth-sig-util");

import {
  getUniswapV2Pair,
  getUniswapV2Router,
  getERCContractInstance,
  TokenInfoArray,
  PairInfoArray,
  tagOptions,
  MAX_ALLOWANCE
} from '../../config/swapconfig/contractinstances';
import { getWalletContractInstance } from '../wallet/wallet-helper/walletinstance';
const BN = require('bignumber.js');

// // import {config} from "./config"
// const abi = '[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"version","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"bytes","name":"functionSignature","type":"bytes"},{"internalType":"bytes32","name":"sigR","type":"bytes32"},{"internalType":"bytes32","name":"sigS","type":"bytes32"},{"internalType":"uint8","name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]';
// const jsonAbi = JSON.parse(abi);
// const Tokenaddress = "0xDbe8b6dB6AE4d888388961ffFd474e7DEd178d35";

// const domainType = [
//   { name: "name", type: "string" },
//   { name: "version", type: "string" },
//   { name: "chainId", type: "uint256" },
//   { name: "verifyingContract", type: "address" }
// ];

// const metaTransactionType = [
//   { name: "nonce", type: "uint256" },
//   { name: "from", type: "address" },
//   { name: "functionSignature", type: "bytes" }
// ];

// let domainData = {
//   name: "erc20",
//   version: "1",
//   verifyingContract: Tokenaddress
// };

const Tokens = [
  {
    value: 'DAI',
    image: '/static/dai.svg',
  },
  {
    value: 'TRB',
    image: '/static/trb.png',
  },
  {
    value: 'BAT',
    image: '/static/bat.svg',
  },
  {
    value: 'ZRX',
    image: '/static/zrx.svg',
  },
  {
    value: 'WETH',
    image: '/static/eth.svg',
  },
  {
    value: 'KNC',
    image: '/static/knc.svg',
  },
  {
    value: 'ZIL',
    image: '/static/zil.png',
  },
  {
    value: 'TKN',
    image: '/static/sai.svg',
  },
];

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
      console.log(web3Biconomy)
      const walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
      const contractInstance = getWalletContractInstance(web3, walletAddress);
      const biconomyAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();

      const erc20ContractInstance2 = await getERCContractInstance(web3Biconomy, token0);
      let allowance = await erc20ContractInstance2.methods.allowance(biconomyAddress, routeraddress).call();
      console.log(biconomyAddress)
      console.log(allowance)
      console.log(amountSwapDesired)
      if(parseInt(allowance) < parseInt(amountSwapDesired)) {
        let txData = await erc20ContractInstance2.methods.approve(
          routeraddress, 
          amountSwapDesired
        // )
        ).encodeABI();
        // .send({
        //   from: accounts[0],
        //   nonce: BiconomyTxCount
        // });

        await this.broadcastTx(
          accounts[0],
          "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
          txData,
          0, //Ether value to be sent should be zero
          "2000000" //gasLimit,
          
        );

        toast.success("Transaction approved!!", {
          position: toast.POSITION.TOP_RIGHT
        }); 
      }
      const biconomyAddressBalance = await erc20ContractInstance2.methods.balanceOf(biconomyAddress).call();
      const pairInstance = await getUniswapV2Pair(web3, pairAddress);
      const reserves = await pairInstance.methods.getReserves().call();
      console.log(reserves)
      console.log(biconomyAddressBalance)

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
      } else {
        toast.error("Insufficient " + token0 + " balance!!", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      this.setState({ tradeLoading: false });
    } catch (error) {
      this.setState({ tradeLoading: false });
      console.log(error);
    }
  };

  // async broadcastTx(from, to, txData, value, gasLimit) {
  async broadcastTx(from, to, txData, value, gasLimit) {
    let txCount = await web3Biconomy.eth.getTransactionCount(from);
    console.log("txCount ", txCount);
    //Method 1: Use a constant
    let gasPrice = new BN(5).times(10 ** 9); //5 Gwei
  
    let rawTx = {
        from: from,
        to: to,
        data: txData,
      //  nonce: 
    };
    const txReceipt = await web3Biconomy.eth.sendTransaction(rawTx, {
    });

    // Log the tx receipt
    console.log(txReceipt);
    return;
  }

  handlePairs = (e, { value }) => {
    const pair = [
      {
        key: PairInfoArray[0][value].token0,
        text: (
          <div className="align-items">
            <img
              src={
              Tokens.find((token) => token.value === PairInfoArray[0][value].token0).image
              }
              className="ui avatar image"
              alt="coin"
            />
            {PairInfoArray[0][value].token0}
          </div>
        ),
        value: PairInfoArray[0][value].token0,
      },
      {
        key: PairInfoArray[0][value].token1,
        text: (
          <div className="align-items">
            <img
              src={
              Tokens.find((token) => token.value === PairInfoArray[0][value].token1).image
              }
              className="ui avatar image"
              alt="coin"
            />
            {PairInfoArray[0][value].token1}
          </div>
        ),
        value: PairInfoArray[0][value].token1,
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
