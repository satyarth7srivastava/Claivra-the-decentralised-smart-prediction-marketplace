import { ethers } from "ethers";

import artifacts from "../../contracts/MPC.json";
import { toast } from "react-toastify";


const contractAdress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let myContract = null;

const initializeContract = async () => {
    if(isWallet() === false){
        toast.error("Please connect your wallet first.");
        return null;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(0);
    const contract = new ethers.Contract(
        contractAdress,
        artifacts.abi,
        signer
    );

    myContract = contract;
    
    return contract;
}

const isWallet = async () => {
    if (typeof window.ethereum === "undefined") {
        return false;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    return (accounts.length > 0);
}

const connectMetamask = async (_contract, isBuyer) => {
    //checking if metamask is installed
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask to use this feature.");
        return false;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(0);
    const contract = _contract.connect(signer);
    const addressBuyer = await signer.getAddress();
    const adr = await contract.login(addressBuyer, isBuyer);
    return (adr === addressBuyer);
}

const getContract = async () => {
    if(myContract === null) {
        return await initializeContract();
    }
    return myContract;
}

const registerAsBuyer = async (_contract) => {
    const res = _contract.registerAsBuyer();
    console.log(res);
}

export { connectMetamask, getContract, registerAsBuyer, isWallet };