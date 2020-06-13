import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Input, Dropdown,
} from 'semantic-ui-react';

import Liquidity from './liquidity/LiquidityContainer';

const Uniswap = ({
  swapExactTokensForTokens, tradePairTokens, tagOptions,
  handlePairs, pairTokens, handlePairTokens, amountSwapDesired,
  handleInputPrice, tradeLoading,
}) => (
  <div className="uniswap">
    <div className="card balance">
      <h4>For Traders</h4>
      <div className="form-field">
        <Dropdown
          placeholder="Please Select"
          fluid
          selection
          // value={tradePairTokens}
          options={tagOptions}
          className="pair-options form-control"
          // value={tokenBalanceSymbol}
          onChange={handlePairs}
        />
      </div>
      <div className="form-field">
        <Input
          className="pair-input form-control"
          label={(
            <Dropdown
              options={pairTokens}
              onChange={handlePairTokens}
              className="pair-input-dropdown form-control"
              placeholder="Select"
            />
          )}
          labelPosition="left"
          color="teal"
          type="input"
          fluid
          // labelPosition="right"
          placeholder="Add value in Wei"
          value={amountSwapDesired}
          onChange={handleInputPrice}
        />
      </div>
      <div className="form-field trade-footer">
        <Button
          color="blue"
          bsStyle="primary"
          type="submit"
          loading={tradeLoading}
          onClick={(event) => swapExactTokensForTokens(event)}
        >
          Trade
        </Button>
      </div>
    </div>
    <div className="liquidity">
      <Liquidity />
    </div>
  </div>
);

Uniswap.propTypes = {
  swapExactTokensForTokens: PropTypes.func,
  tradePairTokens: PropTypes.func,
  handlePairs: PropTypes.func,
  tagOptions: PropTypes.func,
  pairTokens: PropTypes.func,
  handlePairTokens: PropTypes.func,
  amountSwapDesired: PropTypes.func,
  handleInputPrice: PropTypes.func,
  tradeLoading: PropTypes.func,
};

Uniswap.defaultProps = {
  swapExactTokensForTokens: () => {},
  tradePairTokens: () => {},
  handlePairs: () => {},
  tagOptions: () => {},
  pairTokens: () => {},
  handlePairTokens: () => {},
  amountSwapDesired: () => {},
  handleInputPrice: () => {},
  tradeLoading: () => {},
};

export default Uniswap;
