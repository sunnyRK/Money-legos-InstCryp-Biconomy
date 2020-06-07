import React, { Component } from 'react';
import { Grid, Segment, Form, Message, Input, Dropdown, Button} from 'semantic-ui-react';
import realweb3 from '../../biconomyProvider/realweb3';
import {getERCContractInstance, getWalletContractInstance} from '../wallet/walletinstance'
import {
    transferErc20,
    transferFromTokens,
    biconomyLogin,
    // addTransaction,
} from '../wallet/walletfunctions';

class Collateral extends Component {

    state = {
        collateralTokenSymbol: 'TKN',
        collateralUploadLoading: false,
        collateralValue: '',
    }

    onAddCollateral = async () => {
        event.preventDefault();
        try {
            this.setState({collateralUploadLoading:true});
            var accounts = await web3.eth.getAccounts();
            var walletAddress = '0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B'; // spender address kovan
            const contractInstance = getWalletContractInstance(web3, walletAddress);
            const biconomyAddress = await contractInstance.methods.getBiconomyAddress(accounts[0]).call();
            alert(biconomyAddress);
            if(biconomyAddress != "0x0000000000000000000000000000000000000000" || biconomyAddress != "") {
                var collateralTokenSymbol = this.state.collateralTokenSymbol;
                var collateralValue = this.state.collateralValue;
                const _inst = await getERCContractInstance(realweb3, collateralTokenSymbol);
                const status = await  transferErc20(realweb3, _inst, biconomyAddress, collateralValue); //transfer collateral for meta transaction
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
            this.setState({collateralUploadLoading:false});
        } catch (error) {
            this.setState({collateralUploadLoading:false});
            console.log(error);
        }
    }

    handleChangeCollateralTokenSymbol =  (e, { value }) => this.setState({ collateralTokenSymbol: value }); 
    
    render() {
        const collateralOptions = [
            // { key: 'eth', text: 'ETH', value: 'ETH' },
            // { key: 'bat', text: 'BAT', value: 'BAT' },
            // { key: 'knc', text: 'KNC', value: 'KNC' },
            // { key: 'zil', text: 'ZIL', value: 'ZIL' },
            { key: 'tkn', text: 'TKN', value: 'TKN' },
            { key: 'sai', text: 'SAI', value: 'SAI' },
        ]
        return (
                <Segment>
                    <Grid stackable textAlign='center' style={{margin:"20px"}}>
                        <Grid.Row verticalalign='middle'>
                            <Grid.Column>
                                <Message>
                                    <Message.Header>Deposit Section</Message.Header>
                                    Deposit crypto token in biconomy account address for perform transfer crypto via gasless or meta-transaction.
                                </Message>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row verticalalign='middle'>
                            <Grid.Column>
                                <Form.Field>
                                    <Input
                                        label={
                                            <Dropdown
                                                options={collateralOptions}
                                                value={this.state.collateralTokenSymbol} 
                                                onChange={this.handleChangeCollateralTokenSymbol} 
                                            />
                                        }
                                        type = "input"
                                        labelPosition="right"
                                        placeholder="Add value in Wei"
                                        value={this.state.collateralValue}
                                        onChange={event => 
                                            this.setState({
                                                collateralValue: event.target.value,
                                        })}
                                    style={{width:'300px', height:"40px"}}
                                    />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>   

                        <Grid.Row verticalalign='middle'>
                            <Grid.Column> 
                                <Form onSubmit={this.onAddCollateral}>
                                    <Form.Field>
                                        <Button 
                                            color="black"
                                            bsStyle="primary" 
                                            type="submit"
                                            loading={this.state.collateralUploadLoading}> 
                                            Deposit Crypto for meta transaction
                                        </Button>
                                    </Form.Field>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
        );
    }
}

export default Collateral; 