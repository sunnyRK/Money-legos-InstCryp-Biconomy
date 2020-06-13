import React from 'react';
import {
  Button,
  Input,
  Dropdown,
  Icon,
  Popup,
} from 'semantic-ui-react';

export default ({
  firstToken, secondToken, addQty, handleChangeforFirstToken,
  main, main3, handleChangeforSecondToken, convert, swapLoadding,
  handleState, convertedValue,
}) => {
  // const options = [
  //   {
  //     key: 'dai',
  //     text: (
  //       <div>
  //         <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
  //         DAI
  //       </div>
  //     ),
  //     value: 'DAI',
  //     // image: { avatar: true, src: 'https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png' },
  //   },
  //   // { key: 'eth', text: 'ETH', value: 'ETH' },
  //   // { key: 'bat', text: 'BAT', value: 'BAT' },
  //   // { key: 'knc', text: 'KNC', value: 'KNC' },
  //   // { key: 'zil', text: 'ZIL', value: 'ZIL' },
  //   {
  //     key: 'tkn',
  //     text: (
  //       <div>
  //         <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
  //         TKN
  //       </div>
  //     ),
  //     value: 'TKN',
  //   },
  //   {
  //     key: 'sai',
  //     text: (
  //       <div>
  //         <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
  //         SAI
  //       </div>
  //     ),
  //     value: 'SAI',
  //   },
  // ];
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
      key: 'eth',
      text: (
        <div>
          <img src="https://cdn4.iconfinder.com/data/icons/crypto-currency-and-coin-2/256/etherium_eth_ethcoin_crypto-512.png" className="ui avatar image" alt="coin" />
          ETH
        </div>
      ),
      value: 'ETH',
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
    },
    {
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
  ];
  return (
    <div className="kyber">
      <div className="transfer-wrapper card">
        <h4>Kyber Swap</h4>
        <div className="transfer-content">
          <div className="from-content">
            <h3>From :</h3>
            <Input
              label={(
                <Dropdown
                  options={options}
                  defaultValue={options[0].value}
                  className="from-token"
                  value={firstToken}
                  onChange={handleChangeforFirstToken}
                />
              )}
              labelPosition="left"
              placeholder="0 Wei"
              // value={addQty}
              onChange={(event) => {
                handleState({ addQty: event.target.value }, () => { convert(); });
              }}
            />
          </div>
          <div
            className="middle-content"
            role="presentation"
            onClick={() => main3()}
          >
            <Popup
              trigger={<i className="change_arrow" />}
              content="Click to swap"
              basic
              // labelPosition="left"
              position="bottom center"
            />
          </div>
          <div className="to-content">
            <h3>To :</h3>
            <Input
              label={(
                <Dropdown
                  options={options}
                  defaultValue={options[1].value}
                  className="from-token"
                  value={secondToken}
                  onChange={handleChangeforSecondToken}
                />
              )}
              labelPosition="left"
              placeholder="0"
              id="demo"
              value={convertedValue}
              // onChange={(event) => handleState('value', event.target.value)}
            />
          </div>
        </div>
        <div className="transfer-footer">
          <Button
            // color="black"
            primary
            bsStyle="primary"
            type="submit"
            loading={swapLoadding}
            onClick={(event) => main(event)}
            className="transfer-button"
          >
            <Icon name="american sign language interpreting" />
            Swap
          </Button>
        </div>
      </div>
    </div>
  );
};
