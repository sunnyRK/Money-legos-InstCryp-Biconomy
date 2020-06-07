import React, { Component } from 'react';
import { Dropdown, Form, Button, Grid, Input, Label, Icon, Divider, Header, Segment } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import {getRates, trade, approveContract} from './kyberjs'
const BN = require("bignumber.js");
import {
        MAX_ALLOWANCE, convertInWei,
        REF_ADDRESS, getSrcTokenContract, KYBER_NETWORK_PROXY_ADDRESS, TokenInfoArray
    } from '../../config/kyberconfig/config';

class Swap extends Component {

    state = {
        firstToken: '',
        secondToken: '',
        addQty: 0,
        respectiveQty: 0,
        expectedRate: 0,
        convertBtn: 0,
        swapLoadding: false
    }

    main3 = async (event) => {
        this.setState({
            firstToken: this.state.secondToken,
            secondToken: this.state.firstToken
        });
    }
    main = async (event) => {
        event.preventDefault();
        try {
            this.setState({swapLoadding:true,errorMessage:''});
            if(this.state.firstToken != ""){  
                if(this.state.secondToken != "") {
                    if(this.state.addQty != "") {
                        // alert("Hi");
                        if(this.state.convertBtn == 1) {
                            if(this.state.expectedrate*this.state.addQty > 0){    
                                // Calculate slippage rate
                                let results = await getRates(TokenInfoArray[0][this.state.firstToken].token_contract_address, 
                                    TokenInfoArray[0][this.state.secondToken].token_contract_address, 
                                    convertInWei(this.state.addQty, TokenInfoArray[0][this.state.firstToken].decimals));
                                
                                // Check KyberNetworkProxy contract allowance
                                let contractAllowance = await getSrcTokenContract(TokenInfoArray[0][this.state.firstToken].token_contract_address).methods
                                    .allowance(REF_ADDRESS, KYBER_NETWORK_PROXY_ADDRESS)
                                    .call();
        
                                // // If insufficient allowance, approve else convert KNC to ETH.
                                if (convertInWei() <= contractAllowance) {
                                    await trade(
                                    TokenInfoArray[0][this.state.firstToken].token_contract_address,
                                    convertInWei(this.state.addQty, TokenInfoArray[0][this.state.firstToken].decimals),
                                    TokenInfoArray[0][this.state.secondToken].token_contract_address,
                                    REF_ADDRESS,
                                    MAX_ALLOWANCE,
                                    results.slippageRate,
                                    REF_ADDRESS,
                                    this.state.firstToken,
                                    this.state.secondToken, 
                                    this.state.addQty
                                    );
                                } else {
                                    await approveContract(MAX_ALLOWANCE, 
                                        TokenInfoArray[0][this.state.firstToken].token_contract_address);
                                    await trade(
                                    TokenInfoArray[0][this.state.firstToken].token_contract_address,
                                    convertInWei(this.state.addQty, TokenInfoArray[0][this.state.firstToken].decimals),
                                    TokenInfoArray[0][this.state.secondToken].token_contract_address,
                                    REF_ADDRESS,
                                    MAX_ALLOWANCE,
                                    results.slippageRate,
                                    REF_ADDRESS,
                                    this.state.firstToken,
                                    this.state.secondToken,
                                    this.state.addQty
                                    );
                                }
                                console.log("Done");
                            } else {
                                alert("Platform can not handle your amount this moment. Please reduce your amount.");
                            }
                        } else {
                            alert("Please convert " + this.state.firstToken + " to " + this.state.secondToken + " first by pressing Convert button.");
                        }
                    } else {
                        alert("Please add the add quantity field")
                    }
                } else {
                    alert("Please Select your desire token")
                }
            } else{
                alert("Please Select your token")
            }
        } catch (error) {
            console.log(error)
        }
        this.setState({swapLoadding:false});
    }

    handleChangeforFirstToken =  (e, { value }) => this.setState({ firstToken: value }); 
    handleChangeforSecondToken = (e, { value }) => this.setState({ secondToken: value });

    convert = async () => {
        if(this.state.firstToken != "") {  
            if(this.state.secondToken != "") {
                if(this.state.addQty != "") {
                    let results = await getRates(TokenInfoArray[0][this.state.firstToken].token_contract_address, 
                        TokenInfoArray[0][this.state.secondToken].token_contract_address, 
                        convertInWei(this.state.addQty, TokenInfoArray[0][this.state.firstToken].decimals));
                    const decimal = TokenInfoArray[0][this.state.secondToken].decimals;
                    // alert(new BN(1).times(10 ** decimal));
                    // alert(results.expectedRate + " " + results.slippageRate);
                    const expectedrateFromAPi = parseInt(results.expectedRate)/(new BN(1).times(10 ** decimal));

                    this.setState({
                        expectedrate: expectedrateFromAPi,
                    })

                    // alert(this.state.expectedrate*this.state.addQty)
                    if(expectedrateFromAPi*this.state.addQty > 0){
                        document.getElementById("demo").innerHTML = this.state.addQty + " (" + this.state.firstToken + ") = " +(expectedrateFromAPi*this.state.addQty) + " (" +this.state.secondToken + ")";
                        this.setState({
                            convertBtn: 1
                        })
                    } else {
                        alert("Platform can not handle your amount this moment. Please reduce your amount.");
                    }
                } else {
                    alert("Please add the add quantity field")
                }
            } else {
                alert("Please Select your desire token")
            }
        } else{
            alert("Please Select your token")
        }
    };

    render() {
        const options = [
            { key: 'dai', text: 'DAI', value: 'DAI' },
            { key: 'eth', text: 'ETH', value: 'ETH' },
            { key: 'bat', text: 'BAT', value: 'BAT' },
            { key: 'knc', text: 'KNC', value: 'KNC' },
            { key: 'zil', text: 'ZIL', value: 'ZIL' },
        ]

        return(
            <Segment>
                <Header color="black">
                    <Icon name="genderless"></Icon>Peer to Peer Token Swapping 
                </Header>
                <Grid columns={3} divided stackable>
                    <Grid.Row style={{margin:"10px"}}>
                        <Grid.Column width={7}>
                        <Dropdown
                            search
                            value={this.state.firstToken}
                            onChange={this.handleChangeforFirstToken} 
                            fluid selection options={options}
                            placeholder="Select your token here"/>
                        </Grid.Column>
                        
                        <Grid.Column width={2} >
                            <Form onSubmit={this.main3} >
                                <Button style={{margin: "0 auto", display: "block"}}  basic color="black"><Icon name="exchange"></Icon>Change</Button>
                            </Form>
                        </Grid.Column>

                        <Grid.Column width={7}>
                        <Dropdown
                            search
                            value={this.state.secondToken}
                            onChange={this.handleChangeforSecondToken} 
                            fluid selection options={options}
                            placeholder="Select your desire token"/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{margin:"10px"}}>
                        <Grid.Column width={7}>
                            <Input
                                value={this.state.addQty}
                                width={16}
                                onChange={event => 
                                    this.setState({
                                        addQty: event.target.value,
                                    })}
                                label="Add Quantity" labelPosition="right"/>
                        </Grid.Column>

                        <Grid.Column width={2}>
                            <Form onSubmit={this.convert}>
                                <Button style={{margin: "0 auto", display: "block"}} basic color="black">Convert</Button>
                            </Form>
                        </Grid.Column>
                        
                        <Grid.Column width={7}>
                            <Label id="demo" key='big' size='big'>0</Label>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                
                <Form onSubmit={this.main}>
                    <Button color="black" loading={this.state.swapLoadding} style={{margin: "0 auto", display: "block"}}> <Icon name="american sign language interpreting"></Icon>Swap</Button>
                </Form>
                <Divider horizontal>Warning</Divider>

                
                <Label basic color='red' pointing='left'>
                    This plafform currently is in beta stage. use at your own risk.
                </Label>
            </Segment>
        );
    }
};

export default Swap;