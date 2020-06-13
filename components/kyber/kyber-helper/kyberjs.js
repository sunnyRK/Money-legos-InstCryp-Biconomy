import {
   NETWORK, KYBER_NETWORK_PROXY_ADDRESS, convertInWei, TokenInfoArray,
    KYBER_NETWORK_PROXY_CONTRACT, getSrcTokenContract, REF_ADDRESS
} from '../../../config/kyberconfig/config';

// Function to obtain conversion rate between src token and dst token
export async function getRates(SRC_TOKEN_ADDRESS,DST_TOKEN_ADDRESS,SRC_QTY_WEI) {
    return await KYBER_NETWORK_PROXY_CONTRACT.methods
      .getExpectedRate(SRC_TOKEN_ADDRESS, DST_TOKEN_ADDRESS, SRC_QTY_WEI)
      .call();
}
  
// Function to convert src token to dst token
export async function trade(
    srcTokenAddress,
    srcQtyWei,
    dstTokenAddress,
    dstAddress,
    maxDstAmount,
    minConversionRate,
    walletId, 
    SRC_TOKEN,
    DST_TOKEN, 
    Qty
   ) {
      console.log(`Converting ${SRC_TOKEN} to ${DST_TOKEN}`);

      const bal0 = await getSrcTokenContract("0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa").methods
         .balanceOf("0x48845392F5a7c6b360A733e0ABE2EdcC74f1F4d6").call();
      console.log(bal0);

      let txData = await KYBER_NETWORK_PROXY_CONTRACT.methods
         .trade(
         srcTokenAddress,
         srcQtyWei,
         dstTokenAddress,
         dstAddress,
         maxDstAmount,
         minConversionRate,
         walletId
         ).send({
            from: "0x48845392F5a7c6b360A733e0ABE2EdcC74f1F4d6"
         })
      
      const bal1 = await getSrcTokenContract("0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa").methods
         .balanceOf("0x48845392F5a7c6b360A733e0ABE2EdcC74f1F4d6").call();
      console.log(bal1);
}
  
// // Function to approve KNP contract
export async function approveContract(allowance, srcTokenAddress) {
   console.log("Approving KNP contract to manage my KNC");
   let txData = await getSrcTokenContract(srcTokenAddress).methods
      .approve(KYBER_NETWORK_PROXY_ADDRESS, allowance).send({
         from: '0x48845392F5a7c6b360A733e0ABE2EdcC74f1F4d6'
      });
}