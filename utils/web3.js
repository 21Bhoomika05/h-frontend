import Web3 from "web3";

const CONTRACT_ADDRESS = process.env.REACT_APP_AID_DISTRIBUTION_CONTRACT;
const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

if (!CONTRACT_ADDRESS) {
  console.error("❌ Smart contract address is missing! Check your .env file.");
}

const ABI = [/* Your Contract ABI Here */];

const getWeb3 = async () => {
  if (window.ethereum) {
    console.log("🔗 Connecting to MetaMask...");
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_accounts" }); // Use `eth_accounts` instead of `eth_requestAccounts`
      console.log("✅ MetaMask connected.");
      return web3;
    } catch (error) {
      console.error("❌ MetaMask connection error:", error);
      return null;
    }
  } else if (window.web3) {
    console.log("🔗 Using legacy Web3 provider.");
    return new Web3(window.web3.currentProvider);
  } else {
    console.warn("⚠️ MetaMask not detected! Using Infura fallback.");
    if (!INFURA_PROJECT_ID) {
      console.error("❌ Infura Project ID missing! Add REACT_APP_INFURA_PROJECT_ID in .env");
      return null;
    }
    return new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`));
  }
};

const getContract = async () => {
  const web3 = await getWeb3();
  if (!web3) {
    console.error("❌ Web3 initialization failed.");
    return null;
  }

  try {
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    console.log("✅ Smart contract initialized.");
    return { web3, contract };
  } catch (error) {
    console.error("❌ Error loading smart contract:", error);
    return null;
  }
};

export { getWeb3, getContract };
