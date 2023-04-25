import { message } from 'antd'

async function switchChain(chainId) {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }],
  });
}

async function addChain({ chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls }) {
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: chainId,
        chainName: chainName,
        nativeCurrency: nativeCurrency,
        rpcUrls: rpcUrls,
        blockExplorerUrls: blockExplorerUrls,
        iconUrls: [''],
      },
    ],
  });
}

async function catchErrorWallet(error) {
  if (
    error?.data?.message ==
    "execution reverted: ERC20: transfer amount exceeds balance"
  ) {
    message.error("Transfer amount exceeds balance");
  }
  if (
    error?.data?.message?.includes("nonce") ||
    error?.message.includes("nonce")
  ) {
    message.error("Please try again!");
  }
  if (
    error?.data?.message?.includes("replacement fee") ||
    error?.message.includes("replacement fee")
  ) {
    message.error("Please try again!");
  }
  if (
    error?.data?.message?.includes("out-of-bounds") ||
    error?.message.includes("out-of-bounds")
  ) {
    message.error("Over allowance amount");
  }
  console.log({ error });
  switch (error.code) {
    case "UNPREDICTABLE_GAS_LIMIT": 
      message.error("Cannot estimate gas fee!");
    break
    case "ACTION_REJECTED":
      message.error("Transaction cancelled!");
      break
    default:
      message.error(error?.message);
      break
  }
}

export { switchChain, addChain, catchErrorWallet };
