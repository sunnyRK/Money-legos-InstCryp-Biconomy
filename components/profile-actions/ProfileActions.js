import React from 'react';
import { Button, Input, Dropdown } from 'semantic-ui-react';

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

const ProfileActions = ({
  onBiconomyLogin, biconomyAddress, biconomyLoginLoading,
  metamaskAddress,
}) => (
  <div className="login-info">
    <div className="metamask-info card">
      <h4>Metamask address</h4>
      <div className="address">{metamaskAddress}</div>
    </div>
    <div className="biconomy-info card">
      <h4>Biconomy address</h4>
      {
        !biconomyAddress ? (
          <div className="form-field biconomy-login-wrapper">
            <Button
              bsStyle="primary"
              type="submit"
              className="biconomy-login form-control"
              loading={biconomyLoginLoading}
              onClick={() => onBiconomyLogin()}
              primary
            >
              Biconomy Login +
            </Button>
          </div>
        ) : (
          <div className="address">{biconomyAddress}</div>
        )
      }
    </div>
    <div className="transact-wrapper card">
      <h4>Deposit</h4>
      <div className="form-field">
        <Input
          fluid
          width={16}
          className="form-control"
          placeholder="EnterValue"
          label={(
            <Dropdown
              options={options}
              defaultValue={options[0].value}
              className="form-control"
              // onChange={() => handleDeposit()}
            />
          )}
          labelPosition="left"
        />
      </div>
      <div className="form-field transact-button-wrapper">
        <Button
          bsStyle="primary"
          type="submit"
          className="transact-button form-control"
          primary
        >
          Deposit
        </Button>
      </div>
    </div>
    <div className="transact-wrapper card">
      <h4>Withdraw</h4>
      <div className="form-field">
        <Input
          fluid
          width={16}
          className="form-control"
          placeholder="Enter value"
          label={(
            <Dropdown
              options={options}
              defaultValue={options[0].value}
              className="form-control"
              // onChange={() => handleWithdraw)}
            />
          )}
          labelPosition="left"
        />
      </div>
      <div className="form-field transact-button-wrapper">
        <Button
          bsStyle="primary"
          type="submit"
          className="transact-button form-control"
          primary
        >
          Withdraw
        </Button>
      </div>
    </div>
  </div>
);

export default ProfileActions;
