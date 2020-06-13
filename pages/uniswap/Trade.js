import React, { Component } from 'react';
import { Button, Form, Input, Grid, Dropdown, Message, Tab, Segment, Icon, Label, Divider } from 'semantic-ui-react';
import web3 from '../../biconomyProvider/realweb3';
import web3Biconomy from '../../biconomyProvider/web3Biconomy';
import biconomy from '../../biconomyProvider/biconomy';
import Axios from 'axios';
import {
    getUniswapV2Pair, 
    getUniswapV2Router, 
    getUniswapV2Library, 
    getERCContractInstance,
    TokenInfoArray,
    PairInfoArray,
    tagOptions
} from '../../config/swapconfig/contractinstances';

class Trade extends Component {
    state = {
        tradeLoading: false,
        addLiquidityLoading: false,
        removeLiquidityLoading: false,
        updateLoading: false,
        amountSwapDesired: '',
        amountOut: '',
        pairTokens: [],
        token0: '',
        token1: '',
        minValue: 0, 
        shouldSwap: false,
        pairAddress: '',
        routeraddress: '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a',
    }

    swapExactTokensForTokens = async () => {
        event.preventDefault();
        try {
            this.setState({tradeLoading: true});
            
            const accounts = await web3.eth.getAccounts();

            let acc;
            let response = await biconomy.login(accounts[0]);
            if(response && response.transactionHash) {
            } else if (response && response.userContract) {
                console.log(response.userContract)
                acc = response.userContract;
            }

            const erc20ContractInstance2 = await getERCContractInstance(web3Biconomy, this.state.token0);

            // let allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
            // if(parseInt(allowance) < parseInt(this.state.amountSwapDesired)) {
                await erc20ContractInstance2.methods.approve(
                this.state.routeraddress, // Uniswap router address
                this.state.amountSwapDesired
                ).send({
                    from: accounts[0]
                });
                // allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
            // }

            

            const biconomyAddressBalance = await erc20ContractInstance2.methods.balanceOf(acc).call();
            let allowance1 = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
            let allowance2 = await erc20ContractInstance2.methods.allowance(acc, this.state.routeraddress).call();
            console.log(accounts[0])
            console.log(acc)
            console.log("allownace: ", allowance1)
            console.log("allownace: ", allowance2)
            console.log("balance: ", biconomyAddressBalance)

            const pairInstance = await getUniswapV2Pair(web3, this.state.pairAddress);
            const reserves = await pairInstance.methods.getReserves().call();
            console.log(reserves)

            const routeContractInstance = await getUniswapV2Router(web3Biconomy);
            // console.log(web3Biconomy);
            console.log(this.state.amountSwapDesired)
            console.log(this.state.minValue)
            console.log([TokenInfoArray[0][this.state.token0].token_contract_address, TokenInfoArray[0][this.state.token1].token_contract_address])
            console.log(acc)
            // console.log(Math.floor(new Date().getTime()/1000) + 86400)
            const transactionHash = await routeContractInstance.methods.swapExactTokensForTokens(
                parseInt(this.state.amountSwapDesired),
                parseInt(this.state.minValue),
                [TokenInfoArray[0][this.state.token0].token_contract_address, TokenInfoArray[0][this.state.token1].token_contract_address],
                accounts[0],
                Math.floor(new Date().getTime()/1000) + 86400
            ).send({
                from: accounts[0]
            });
            this.setState({tradeLoading: false});
        } catch (error) {
            this.setState({tradeLoading: false});
            console.log(error);
        }
    };

    handlePairs =  (e, { value }) => {
        const pair = [
          {
            key: PairInfoArray[0][value].token0,
            text: PairInfoArray[0][value].token0,
            value: PairInfoArray[0][value].token0,
            label: { color: 'red', empty: true, circular: true },
          },
          {
            key: PairInfoArray[0][value].token1,
            text: PairInfoArray[0][value].token1,
            value: PairInfoArray[0][value].token1,
            label: { color: 'blue', empty: true, circular: true },
          }
        ];
        
        this.setState({ 
            tradePairTokens: value, 
            pairTokens: pair, 
            token0: PairInfoArray[0][value].token0, 
            token1: PairInfoArray[0][value].token1, 
            pairAddress: PairInfoArray[0][value].pairaddress,
        });
    }; 
      
    handlePairTokens  =  (e, { value }) => {
        let tempToken2;
        if(value != this.state.token0) {
        tempToken2 = this.state.token0;
        } else {
        tempToken2 = this.state.token1;
        }
        this.setState({ token0: value, token1: tempToken2 });
    }; 
    
    handleInputPrice = async (e,{ value }) => {
        if(this.state.token0 != "") {  
            this.setState({
                amountSwapDesired: event.target.value,
                amountOut: "Wait...",
                slippage: "Wait..."
            })    
            // const amountOut = await this.getAmountOutValue();    
        } else {
            alert("Please select token among pair.")
        }
    }

    render() {
        return(
            <Tab.Pane attached={false}>
                <Label as="a" tag color="blue">
                    For Traders
                </Label>
                <Segment color="blue" textAlign='center'>    
                    <Message color="blue">
                        <Message.Header>Automate Trade</Message.Header>
                    </Message>
                    <Form onSubmit={this.swapExactTokensForTokens}>
                        <Form.Field>
                            <Dropdown
                                placeholder="Select pair tokens.."
                                value={this.state.tradePairTokens} 
                                options={tagOptions}
                                onChange={this.handlePairs} 
                                fluid selection     
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                label={
                                    <Dropdown
                                        options={this.state.pairTokens}
                                        onChange={this.handlePairTokens} 
                                    />
                                }
                                color="teal"
                                type = "input"
                                labelPosition="right"
                                placeholder="Add value in Wei"
                                value={this.state.amountSwapDesired}
                                onChange={this.handleInputPrice}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Button 
                                color="blue"
                                bsStyle="primary" 
                                type="submit"
                                loading={this.state.tradeLoading}
                                style={{width:"280px", height:"40px"}}> 
                                <Icon name="american sign language interpreting"></Icon>
                                Trade
                            </Button>
                        </Form.Field>
                    </Form>
                </Segment>
            </Tab.Pane>
        );
    }

};

export default Trade; 