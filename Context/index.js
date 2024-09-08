import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import toast from "react-hot-toast";
//INTERNAL IMPORT


import {
  ERC20Generator_ABI,
  ERC20Generator_BYTECODE,
  handleNetworkSwitch,
  connectWallet,
  shortenAddress,
  ICO_MARKETPLACE_CONTARCT,
  TOKEN_CONTARCT,
  ICO_MARKETPLACE_ADDRESS,
  PINATA_AIP_KEY,
  PINATA_SECRECT_KEY,
} from "./constants";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //STATE VERIABLE
  const [address, setAddress] = useState();
  const [accountBalance, setAccountBalance] = useState(null);
  const [loader, setLoader] = useState(false);
  const [reCall, setReCall] = useState(0);
  const [currency, setCurrency] = useState("MATIC");

  //COMPONENT
  const [openBuyToken, setOpenBuyToken] = useState(false);
  const [openWidthdrawToken, setopenWidthdrawToken] = useState(false);
  const [openTransferToken, setOpenTransferToken] = useState(false);
  const [openTokenCreator, setOpenTokenCreator] = useState(false);
  const [openCreateICO, setOpenCreateICO] = useState(false);

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const getBalance = await provider.getBalance(accounts[0]);
        const bal = ethers.utils.formatEther(getBalance);

        setAccountBalance(bal);
        return accounts[0];
      } else {
        console.log("No account");
      }
    } catch (error) {
      console.log("not connected");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, [address]);

  //CONNECT WALLET
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Install MateMask");
      const network = await handleNetworkSwitch();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const firstAccount = accounts[0];

      setAddress(firstAccount);
      return firstAccount;
    } catch (error) {
      console.log(error);
    }
  };

  const _deployContract = async (
    signer,
    account,
    name,
    symbol,
    supply,
    imageURL
  ) => {
    try {
      const factory = new ethers.ContractFactory(
        ERC20Generator_ABI,
        ERC20Generator_BYTECODE,
        signer
      );

      const totalSupply = Number(supply);
      const _initialSupply = ethers.utils.parseEther(
        totalSupply.toString(),
        "ether"
      );

      let contract = await factory.deploy(_initialSupply, name, symbol);

      const transaction = await contract.deployed();

      if (contract.address) {
        const today = Date.now();
        let date = new Date(today);
        const _tokenCreatedData = date.toLocaleDateString("en-US");

        const _token = {
          account: account,
          supply: supply.toString(),
          name: name,
          symbol: symbol,
          tokenAddress: contract.address,
          transactionHash: contract.deployTransaction.hash,
          createdAt: _tokenCreatedData,
          logo: imageURL,
        };

        let tokenHistory = [];

        const history = localStorage.getItem("TOKEN_HISTORY");
        if (history) {
          tokenHistory = JSON.parse(localStorage.getItem("TOKEN_HISTORY"));
          tokenHistory.push(_token);
          localStorage.setItem("TOKEN_HISTORY", JSON.stringify(tokenHistory));
          setLoader(false);
          setReCall(reCall + 1);
          setOpenTokenCreator(false);
        } else {
          tokenHistory.push(_token);
          localStorage.setItem("TOKEN_HISTORY", JSON.stringify(tokenHistory));
          setLoader(false);
          setOpenTokenCreator(false);
          setReCall(reCall + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createERC20 = async (token, account, imageURL) => {
    const { name, symbol, supply } = token;

    try {
      setLoader(true);
      notifySuccess("Creating token...");
      if (!name || !symbol || !supply) {
        notifyError("Data Missing");
      } else {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        _deployContract(signer, account, name, symbol, supply, imageURL);
      }
    } catch (error) {
      setLoader(false);
      notifyError("Someting went wrong, try later");
      console.log(error);
    }
  };

  //ALL PRESALE
  const GET_ALL_PRESALE_TOKENS = async () => {
    try {
      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_CONTARCT();

      if (address) {
        setLoader(true);
        const allPreSaleTokens = await contract.getAllTokens();

        const _tokenArray = Promise.all(
          allPreSaleTokens.map(async (token) => {
            const tokenContract = await TOKEN_CONTARCT(token?.token);

            const balance = await tokenContract.balanceOf(
              ICO_MARKETPLACE_ADDRESS
            );

            return {
              creator: token.creator,
              token: token.token,
              name: token.name,
              symbol: token.symbol,
              supported: token.supported,
              price: ethers.utils.formatEther(token?.price.toString()),
              preSaleBal: ethers.utils.formatEther(balance.toString()),
            };
          })
        );
        setLoader(false);
        return _tokenArray;
      }
    } catch (error) {
      setLoader(false);
    }
  };

  //ALL PRESALE
  const GET_ALL_USER_PRESALE_TOKENS = async () => {
    try {
      setLoader(true);
      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_CONTARCT();

      if (address) {
        const allPreSaleTokens = await contract.getTokensCreatedBy(address);

        const _tokenArray = Promise.all(
          allPreSaleTokens.map(async (token) => {
            const tokenContract = await TOKEN_CONTARCT(token?.token);

            const balance = await tokenContract.balanceOf(
              ICO_MARKETPLACE_ADDRESS
            );

            return {
              creator: token.creator,
              token: token.token,
              name: token.name,
              symbol: token.symbol,
              supported: token.supported,
              price: ethers.utils.formatEther(token?.price.toString()),
              preSaleBal: ethers.utils.formatEther(balance.toString()),
            };
          })
        );
        setLoader(false);
        return _tokenArray;
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  //CREATE PRESALE
  const createICOSale = async (preSale) => {
    try {
      const { address, price } = preSale;
      if (!address || !price) return console.log("Data missing");
      setLoader(true);
      notifySuccess("create presale...");
      await connectWallet();
      const contract = await ICO_MARKETPLACE_CONTARCT();

      const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

      console.log(payAmount);

      const transaction = await contract.createPreSale(address, payAmount, {
        gasLimit: ethers.utils.hexlify(8000000),
      });

      await transaction.wait();

      if (transaction.hash) {
        setLoader(false);
        setOpenCreateICO(false);
        setReCall(reCall + 1);
      }
    } catch (error) {
      setLoader(false);
      setOpenCreateICO(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  //BUY TOKEN
  const buyToken = async (tokenAddress, tokenQuentity) => {
    try {
      setLoader(true);
      notifySuccess("Purchasing token...");
      if (!tokenQuentity || !tokenAddress) return notifyError("Data Missing");
      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_CONTARCT();

      const _tokenBal = await contract.getBalance(tokenAddress);
      const _tokenDetails = await contract.getTokenDetails(tokenAddress);

      const avalableToken = ethers.utils.formatEther(_tokenBal.toString());

      if (avalableToken > 0) {
        const price =
          ethers.utils.formatEther(_tokenDetails.price.toString()) *
          Number(tokenQuentity);

        const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

        const transaction = await contract.buyToken(
          tokenAddress,
          Number(tokenQuentity),
          {
            value: payAmount.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();
        setLoader(false);
        setReCall(reCall + 1);
        setOpenBuyToken(false);
      } else {
        setLoader(false);
        setOpenBuyToken(false);
        notifyError("Your token balance is 0");
      }
    } catch (error) {
      setLoader(false);
      notifyError("Someting went wrong");
      console.log(error);
    }
  };

  //TRANSFER TOKEN
  const transferTokens = async (transferTokenData) => {
    try {
      if (
        !transferTokenData.address ||
        !transferTokenData.amount ||
        !transferTokenData.tokenAdd
      )
        return notifyError("Data Missing");
      setLoader(true);
      notifySuccess("Transfering token..");
      const address = await connectWallet();
      const contract = await TOKEN_CONTARCT(transferTokenData.tokenAdd);

      const _avalibleBal = await contract.balanceOf(address);
      const avalableToken = ethers.utils.formatEther(_avalibleBal.toString());
      console.log(avalableToken);
      if (avalableToken > 1) {
        // console.log(contract);
        const payAmount = ethers.utils.parseUnits(
          transferTokenData.amount.toString(),
          "ether"
        );
        const transaction = await contract.transfer(
          transferTokenData.address,
          payAmount,
          {
            gasLimit: ethers.utils.hexlify(30000000),
          }
        );

        await transaction.wait();
        setLoader(false);
        setReCall(reCall + 1);
        setOpenTransferToken(false);
      } else {
        setLoader(false);
        notifyError("YOUR BALANCE: 0");
        setOpenTransferToken(false);
      }
    } catch (error) {
      setLoader(false);
      setOpenTransferToken(false);
      notifyError("Someting went wrong");
      console.log(error);
    }
  };

  //TRANSFER TOKEN
  const withdrawToken = async (withdrawQuentity) => {
    try {
      if (!withdrawQuentity.amount || !withdrawQuentity.token)
        return notifyError("Data Missing");
      setLoader(true);
      notifySuccess("Withdrawing token...");
      const address = await connectWallet();
      const contract = await ICO_MARKETPLACE_CONTARCT();

      const payAmount = ethers.utils.parseUnits(
        withdrawQuentity.amount.toString(),
        "ether"
      );

      const transaction = await contract.withdrawToken(
        withdrawQuentity.token,
        payAmount,
        {
          gasLimit: ethers.utils.hexlify(8000000),
        }
      );

      await transaction.wait();
      setLoader(false);
      setReCall(reCall + 1);
      setopenWidthdrawToken(false);
    } catch (error) {
      setLoader(false);
      setopenWidthdrawToken(false);
      notifyError("someting went wrong");
      console.log(error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        GET_ALL_PRESALE_TOKENS,
        GET_ALL_USER_PRESALE_TOKENS,
        createERC20,
        connectWallet,
        shortenAddress,
        createICOSale,
        buyToken,
        transferTokens,
        withdrawToken,
        setAddress,
        //VARIABLE
        openBuyToken,
        setOpenBuyToken,
        openWidthdrawToken,
        setopenWidthdrawToken,
        openTransferToken,
        setOpenTransferToken,
        openTokenCreator,
        setOpenTokenCreator,
        openCreateICO,
        setOpenCreateICO,
        address,
        ICO_MARKETPLACE_ADDRESS,
        loader,
        reCall,
        accountBalance,
        currency,
        setLoader,
        PINATA_AIP_KEY,
        PINATA_SECRECT_KEY,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
