import React, { Component } from 'react';
import { toast } from 'react-toastify';

import Liquidity from './Liquidity';
import web3 from '../../../biconomyProvider/realweb3';
import web3Biconomy from '../../../biconomyProvider/web3Biconomy';
import {
  getUniswapV2Router,
  getERCContractInstance,
  TokenInfoArray,
  PairInfoArray,
  getUniswapV2Factory,
  tagOptions,
} from '../../../config/swapconfig/contractinstances';

class LiquidityContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addLiquidityLoading: false,
      removeLiquidityLoading: false,
      routeraddress: '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a',
      liquidityToken0: '',
      liquidityToken1: '',
      addLiquidityamount0: '',
      addLiquidityamount1: '',
      removeTokenPair: '',
      removeLiquidityTokenAmount: '',
      minValue: 0,
    };
  }

  createPair = async () => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const factoryInstance = await getUniswapV2Factory(web3);
      const pair = await factoryInstance.methods.getPair(this.state.createToken0, this.state.createToken1).call();
      if (pair == '0x0000000000000000000000000000000000000000') {
        await factoryInstance.methods.createPair(
          this.state.createToken0,
          this.state.createToken1,
        ).send({
          from: accounts[0],
        });
      } else {
        toast.error('This Pair is already exit!!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  selectMax = async () => {
    event.preventDefault();
    try {
      // const factoryInstance = await getUniswapV2Factory(web3);
      // const pair = await factoryInstance.methods.getPair("0xaD6D458402F60fD3Bd25163575031ACDce07538D","0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6").call();
      // console.log(pair);
      if (this.state.removeTokenPair != '') {
        const accounts = await web3.eth.getAccounts();
        const erc20ContractInstance1 = await getERCContractInstance(web3, this.state.removeTokenPair);
        const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf("0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c").call();
        this.setState({
          removeLiquidityTokenAmount: poolTokenBalance,
        });
      } else {
        toast.error('Please select token pair!!', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {

    }
  };

  removeLiquidity = async (event) => {
    event.preventDefault();
    try {
      this.setState({ removeLiquidityLoading: true });
      const accounts = await web3.eth.getAccounts();
      const erc20ContractInstance1 = await getERCContractInstance(web3Biconomy, this.state.removeTokenPair);
      const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf('0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c').call();
      if (parseInt(poolTokenBalance) >= parseInt(this.state.removeLiquidityTokenAmount)) {
        const allowancePair = await erc20ContractInstance1.methods.allowance('0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c', this.state.routeraddress).call();

        if (parseInt(allowancePair) < parseInt(this.state.removeLiquidityTokenAmount)) {
          await erc20ContractInstance1.methods.approve(
            this.state.routeraddress,
            this.state.removeLiquidityTokenAmount,
          ).send({
            from: accounts[0],
          });
        }

        const routeContractInstance = await getUniswapV2Router(web3Biconomy);
        const transactionHash = await routeContractInstance.methods.removeLiquidity(
          TokenInfoArray[0][this.state.liquidityToken0].token_contract_address,
          TokenInfoArray[0][this.state.liquidityToken1].token_contract_address,
          this.state.removeLiquidityTokenAmount,
          this.state.minValue,
          this.state.minValue,
          accounts[0],
          Math.floor(new Date().getTime() / 1000) + 86400,
        ).send({
          from: accounts[0],
        });
        if(transactionHash.transactionHash != undefined && transactionHash.transactionHash != "") {
          toast.success('Successfully removed liquidity!!', {
            position: toast.POSITION.TOP_RIGHT,
          });
          toast.success("Transaction Hash: " + transactionHash.transactionHash, {
            position: toast.POSITION.TOP_RIGHT
          }); 
        } else {
          toast.error("Transaction Failed!!", {
            position: toast.POSITION.TOP_RIGHT
          }); 
        }
        this.setState({ removeLiquidityLoading: false });

      } else {
        toast.error(`You don't have ${this.state.removeLiquidityTokenAmount} liquidity to remove. Please enter valid liquidity!!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      this.setState({ removeLiquidityLoading: false });
    } catch (error) {
      this.setState({ removeLiquidityLoading: false });
      console.log(error);
    }
  };

  addLiquidity = async () => {
    event.preventDefault();
    try {
      this.setState({ addLiquidityLoading: true });
      const accounts = await web3.eth.getAccounts();
      const erc20ContractInstance1 = await getERCContractInstance(web3Biconomy, this.state.liquidityToken0);
      const erc20ContractInstance2 = await getERCContractInstance(web3Biconomy, this.state.liquidityToken1);
      const balance0 = await erc20ContractInstance1.methods.balanceOf('0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c').call();
      const balance1 = await erc20ContractInstance2.methods.balanceOf('0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c').call();

      if (parseInt(balance0) >= parseInt(this.state.addLiquidityamount0) && parseInt(this.state.addLiquidityamount0) > parseInt(this.state.minValue)) {
        if (parseInt(balance1) >= parseInt(this.state.addLiquidityamount1) && parseInt(this.state.addLiquidityamount1) > parseInt(this.state.minValue)) {
          const allowanceToken0 = await erc20ContractInstance1.methods.allowance('0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c', this.state.routeraddress).call();
          const allowanceToken1 = await erc20ContractInstance2.methods.allowance('0x6fC3D06462A5518EA370D0E4Bd1525649CE0fC6c', this.state.routeraddress).call();
          if (parseInt(allowanceToken0) < parseInt(this.state.addLiquidityamount0)) {
            await erc20ContractInstance1.methods.approve(
              this.state.routeraddress,
              parseInt(this.state.addLiquidityamount0),
            ).send({
              from: accounts[0],
            });
          }

          if (parseInt(allowanceToken1) < parseInt(this.state.addLiquidityamount1)) {
            await erc20ContractInstance2.methods.approve(
              this.state.routeraddress,
              this.state.addLiquidityamount1,
            ).send({
              from: accounts[0],
            });
          }
          const routeContractInstance = await getUniswapV2Router(web3Biconomy);
          const transactionHash = await routeContractInstance.methods.addLiquidity(
            TokenInfoArray[0][this.state.liquidityToken0].token_contract_address,
            TokenInfoArray[0][this.state.liquidityToken1].token_contract_address,
            this.state.addLiquidityamount0,
            this.state.addLiquidityamount1,
            this.state.minValue,
            this.state.minValue,
            accounts[0],
            Math.floor(new Date().getTime() / 1000) + 86400,
          ).send({
            from: accounts[0],
          });
          if(transactionHash.transactionHash != undefined && transactionHash.transactionHash != "") {
            toast.success('Successfully added liquidity!!', {
              position: toast.POSITION.TOP_RIGHT,
            });
            toast.success("Transaction Hash: " + transactionHash.transactionHash, {
              position: toast.POSITION.TOP_RIGHT
            }); 
          } else {
            toast.error("Transaction Failed!!", {
              position: toast.POSITION.TOP_RIGHT
            }); 
          }
          this.setState({ addLiquidityLoading: false });
        } else {
          this.setState({ addLiquidityLoading: false });
          toast.error(`Insufficeient ${this.state.liquidityToken0} balance or add valid value in wei!`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        this.setState({ addLiquidityLoading: false });
        toast.error(`Insufficeient ${this.state.liquidityToken1} balance or add valid value in wei!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      this.setState({ addLiquidityLoading: false });
      console.log(error);
    }
  };

  handleLiquidityPairs = (e, { value }) => {
    console.log(PairInfoArray[0][value]);
    this.setState({
      liquidityToken0: PairInfoArray[0][value].token0,
      liquidityToken1: PairInfoArray[0][value].token1,
    });
  };

  handleRemovePairTokens = (e, { value }) => {
    this.setState({
      liquidityToken0: PairInfoArray[0][value].token0,
      liquidityToken1: PairInfoArray[0][value].token1,
      removeTokenPair: value,
    });
  };

  handleState = (value, callback) => {
    this.setState(value, () => {
      if (callback) callback();
    });
  }

  render() {
    const {
      addLiquidityamount0, addLiquidityamount1, addLiquidityLoading,
      removeTokenPair, removeLiquidityTokenAmount, removeLiquidityLoading,
    } = this.state;
    return (
      <Liquidity
        addLiquidity={this.addLiquidity}
        tagOptions={tagOptions}
        handleLiquidityPairs={this.handleLiquidityPairs}
        selectMax={this.selectMax}
        addLiquidityamount0={addLiquidityamount0}
        addLiquidityamount1={addLiquidityamount1}
        addLiquidityLoading={addLiquidityLoading}
        removeTokenPair={removeTokenPair}
        removeLiquidityTokenAmount={removeLiquidityTokenAmount}
        handleRemovePairTokens={this.handleRemovePairTokens}
        removeLiquidity={this.removeLiquidity}
        removeLiquidityLoading={removeLiquidityLoading}
        handleState={this.handleState}
      />
    );
  }
}

export default LiquidityContainer;
