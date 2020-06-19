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
  },
  {
    key: 'weth',
    text: (
      <div>
        <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
        WETH
      </div>
    ),
    value: 'WETH',
  },
  {
    key: 'bat',
    text: (
      <div>
        <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
        BAT
      </div>
    ),
    value: 'BAT',
  },{
    key: 'knc',
    text: (
      <div>
        <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
        KNC
      </div>
    ),
    value: 'KNC',
  },
  {
    key: 'zil',
    text: (
      <div>
        <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
        ZIL
      </div>
    ),
    value: 'ZIL',
  },
  {
    key: 'tkn',
    text: (
      <div>
        <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
        TKN
      </div>
    ),
    value: 'TKN',
  },
];

const ProfileActions = ({
  onBiconomyLogin, biconomyAddress, biconomyLoginLoading,
  metamaskAddress, onDeposit, collateralUploadLoading, 
  handleCollateralValue, handleChangeCollateralTokenSymbol,
  onWithdraw, removeCollateralUploadLoading,
  handleremoveCollateralValue, handleChangeremoveCollateralTokenSymbol,
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
          onChange={handleCollateralValue}
          label={(
            <Dropdown
              options={options}
              defaultValue={options[0].value}
              className="form-control"
              onChange={handleChangeCollateralTokenSymbol}
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
          loading={collateralUploadLoading}
          onClick={() => onDeposit()}
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
          onChange={handleremoveCollateralValue}
          label={(
            <Dropdown
              options={options}
              defaultValue={options[0].value}
              className="form-control"
              onChange={handleChangeremoveCollateralTokenSymbol}
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
          loading={removeCollateralUploadLoading}
          onClick={() => onWithdraw()}
        >
          Withdraw
        </Button>
      </div>
    </div>
  </div>
);

export default ProfileActions;
