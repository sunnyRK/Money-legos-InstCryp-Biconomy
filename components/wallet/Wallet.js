import React from 'react';
import {
  Button,
  Form,
  Grid,
  Input,
  Dropdown,
  Segment,
  Message,
} from 'semantic-ui-react';

export default ({
  tokenBalanceSymbol, tokenSymbol, recipientAddress,
  tokenBalance, value, sendLoanding, checkBalance,
  handleChangeTokenSymbolBalance, handleChangeTokenSymbol, onSubmit,
  handleState, checkBalanceLoading,
}) => {
  const options = [
    {
      key: 'dai',
      text: (
        <div>
          <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
          DAI
        </div>
      ),
      value: 'DAI',
      // image: { avatar: true, src: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png' },
    },
    // { key: 'eth', text: 'ETH', value: 'ETH' },
    // { key: 'bat', text: 'BAT', value: 'BAT' },
    // { key: 'knc', text: 'KNC', value: 'KNC' },
    // { key: 'zil', text: 'ZIL', value: 'ZIL' },
    {
      key: 'tkn',
      text: (
        <div>
          <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
          TKN
        </div>
      ),
      value: 'TKN',
      // image: { avatar: true, src: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png' },
    },
    {
      key: 'sai',
      text: (
        <div>
          <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
          SAI
        </div>
      ),
      value: 'SAI',
      // image: { avatar: true, src: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png' },
    },
  ];
  return (
    <div className="wallet">
      {/* <Grid columns={2} divided stackable >
          <Grid.Row verticalalign='middle' style={{margin:'10px'}}>
              <Grid.Column width={8}>
                  <Label color="green" size="large" tag>
                      InstCryp is Defi crypto wallet supported by
                       meta transaction(By Biconomy-Mexa SDK)
                      to transfer erc20 tokens to any address.
                  </Label>
              </Grid.Column>
          </Grid.Row>
      </Grid> */}

      {/* <Segment style={{backgroundColor:"#f5f5f5"}}>
          <Grid columns={2} divided stackable >
              <Grid.Row verticalalign='middle' style={{margin:'10px'}}>
                  <Grid.Column width={8}>
                      <Form onSubmit={onBiconomyLogin}>
                          <Form.Field>
                              <Button
                                  color="black"
                                  bsStyle="primary"
                                  type="submit"
                                  loading={biconomyLoginLoading}>
                                  Biconomy Login +
                              </Button>
                          </Form.Field>
                          <Message info>
                              <Message.Header style={{ overflowWrap: 'break-word'}}>
                              Metamask Address: {metamaskAddress}</Message.Header>
                              <Message.Header style={{ overflowWrap: 'break-word'}}>
                              Biconomy Address: {biconomyAddress}</Message.Header>
                          </Message>
                      </Form>
                  </Grid.Column>
                      <Grid.Column width={8}>
                      <Form onSubmit={onTransactionHistory}>
                          <Form.Field>
                              <Button
                                  color="black"
                                  bsStyle="primary"
                                  type="submit"
                                  loading={transactionLoading}>
                                  Transaction history
                              </Button>
                          </Form.Field>
                          <Message info>
                              Crypto Transaction History within Instcryp
                          </Message>
                      </Form>
                      </Grid.Column>
              </Grid.Row>
          </Grid>
        </Segment> */}

      <div className="card balance">
        <h4>Balance</h4>
        <Form onSubmit={checkBalance}>
          <Dropdown
            placeholder="Please Select"
            fluid
            selection
            options={options}
            className="balance-options"
            // value={tokenBalanceSymbol}
            onChange={handleChangeTokenSymbolBalance}
          />
          {
            tokenBalance && (
              <div className="current-balance">
                <h3>Current Balance</h3>
                <div className="token-balance">{tokenBalance}</div>
              </div>
            )
          }
          <Button
            primary
            className="check-balance-button"
            type="submit"
            loading={checkBalanceLoading}
          >
            Check Balance
          </Button>
        </Form>
      </div>

      <div className="transfer-wrapper card">
        <h4>Transfer</h4>
        <div className="transfer-content">
          <div className="from-content">
            <h3>From :</h3>
            <Input
              label={(
                <Dropdown
                  options={options}
                  defaultValue={options[0].value}
                  className="from-token"
                  onChange={handleChangeTokenSymbol}
                />
              )}
              labelPosition="left"
              placeholder="0 Wei"
              value={value}
              onChange={(event) => handleState('value', event.target.value)}
            />
          </div>
          <div className="middle-content"><i className="transfer_arrow" /></div>
          <div className="to-content">
            <h3>To Address :</h3>
            <Input
              // label={<Dropdown options={options} />}
              labelPosition="left"
              placeholder="0x0de..."
              value={recipientAddress}
              onChange={(event) => handleState('recipientAddress', event.target.value)}
            />
          </div>
        </div>
        <div className="transfer-footer">
          <Button
            // color="black"
            primary
            bsStyle="primary"
            type="submit"
            loading={sendLoanding}
            onClick={(event) => onSubmit(event)}
            className="transfer-button"
          >
            Transfer
          </Button>
        </div>
      </div>

      {/* <Segment style={{ marginTop: '30px' }}>
        <Grid stackable textAlign="center" style={{ margin: '20px' }}>
          <Grid.Row verticalalign="middle">
            <Grid.Column>
              <Message>
                <Message.Header>Transfer Section</Message.Header>
                Transfer crypto token via meta-transaction or gasless on top of Biconomy
              </Message>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row verticalalign="middle">
            <Grid.Column>
              <Form.Field>
                <Input
                  label={(
                    <Dropdown
                      options={options}
                      value={tokenSymbol}
                      onChange={handleChangeTokenSymbol}
                    />
                                )}
                  type="input"
                  labelPosition="right"
                  placeholder="Add recipient address"
                  value={recipientAddress}
                  onChange={(event) => handleState('recipientAddress', event.target.value)}
                  style={{ width: '300px', height: '40px' }}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row verticalalign="middle">
            <Grid.Column>
              <Form.Field>
                <Input
                  type="input"
                  placeholder="Add value in Wei"
                  value={value}
                  onChange={(event) => handleState('value', event.target.value)}
                  style={{ width: '300px', height: '40px' }}
                />
              </Form.Field>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row verticalalign="middle">
            <Grid.Column>
              <Form onSubmit={onSubmit}>
                <Form.Field>
                  <Button
                    color="black"
                    bsStyle="primary"
                    type="submit"
                    loading={sendLoanding}
                  >
                    Send Token!
                  </Button>
                </Form.Field>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment> */}
    </div>
  );
};
