import { ethers } from "ethers";
import AidContractABI from "../artifacts/contracts/AidContract.sol/AidContract.json";

const CONTRACT_ADDRESS = process.env.REACT_APP_AID_DISTRIBUTION_CONTRACT;

let provider = null;
let signer = null;
let contract = null;

export const initializeEthers = async () => {
    if (!CONTRACT_ADDRESS) {
        console.error("❌ Contract address is undefined. Check your .env file.");
        return;
    }

    if (!window.ethereum) {
        console.error("⚠️ MetaMask not detected! Please install MetaMask.");
        return;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Ensure wallet is connected
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, AidContractABI.abi, signer);

        console.log("✅ MetaMask connected successfully!");
    } catch (error) {
        console.error("❌ Failed to initialize ethers:", error);
    }
};

export const getContract = () => {
    if (!contract) {
        console.error("❌ Contract instance is not initialized. Call `initializeEthers()` first.");
        return null;
    }
    return contract;
};
