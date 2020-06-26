import { getERCContractInstance, getWalletContractInstance } from '../../wallet/wallet-helper/walletinstance'
import { ToastContainer, toast } from 'react-toastify';

const domainSchema = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" }
];

const approveSchema = [
  { name: "spender", type: "address" },
  { name: "amount", type: "uint256" }
];

export default async (web3, signer, tokenAddress, tokenName) => {
  // const web3 = new Web3(window.web3.currentProvider);
  const domainData = {
    name: tokenName,
    version: "1",
    chainId: 42,
    verifyingContract: tokenAddress // kovan
    // verifyingContract: "0xaD6D458402F60fD3Bd25163575031ACDce07538D" //ropsten
  };

//   const daiInstance = new web3.eth.Contract(
//     Interface.abi,
//     "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
//   );

  console.log(web3)
  const instance = getERCContractInstance(web3, "DAI");
  const walletinstance = getWalletContractInstance(web3, "0xD16AdDBF04Bd39DC2Cb7F87942F904D4a7B8281B");

  await walletinstance.methods

  const balalnce = await instance.methods.balanceOf("0x1a313AF8565cA1d93212bD9255c2868309f012b0").call();
  console.log("balalnce: ", balalnce);

  const allowance0 = await instance.methods.allowance("0x1a313AF8565cA1d93212bD9255c2868309f012b0", "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a").call();
  console.log("allowance0: ", allowance0);
  // let nonce = await instance.methods.nonces(signer).call();
  // console.log("Nonce: ", nonce)
  const message = {
    spender: "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a",
    amount: "2",
    nonce: "18"
  };

  let typedData = JSON.stringify({
    types: {
      EIP712Domain: domainSchema,
      Approve: approveSchema
    },
    primaryType: "Approve",
    domain: domainData,
    message
  });
  web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v3",
      params: [signer, typedData],
      from: "0xE33f4C2306eFE9BF66a64A3c42408d2Fe1Cb890f",
    },
    async function(err, result) {
      const allowance = await instance.methods.allowance("0x1a313AF8565cA1d93212bD9255c2868309f012b0", "0xf164fC0Ec4E93095b804a4795bBe1e041497b92a").call();
      console.log("allowance: ", allowance );
      if (err) return console.error(err);

      toast.success("Please wait for permit.", {
        position: toast.POSITION.TOP_RIGHT
      });

      console.log("PERSONAL SIGNED:" + JSON.stringify(result));
      // const signature = result.result.substring(2);
      // const r = "0x" + signature.substring(0, 64);
      // const s = "0x" + signature.substring(64, 128);
      // const v = parseInt(signature.substring(128, 130), 16);
      // // The signature is now comprised of r, s, and v.
      // console.log("signature: ", signature);

      const txData = await instance.methods
        .approve("0xf164fC0Ec4E93095b804a4795bBe1e041497b92a", "2").encodeABI();

        let rawTx = {
          from: signer,
          to: tokenAddress,
          data: txData,
          
      };
      const txReceipt = await web3.eth.sendTransaction(rawTx);  

      //   .send({ from: "0xE33f4C2306eFE9BF66a64A3c42408d2Fe1Cb890f", gas: 4000000 });
      toast.success("You have given permission to transfer DAI!", {
        position: toast.POSITION.TOP_RIGHT
      });
      
    }
  );
};