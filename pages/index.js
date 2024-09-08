import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import { useStateContext } from "../Context/index";
import Header from "../Components/Header";
import Input from "../Components/Input";
import Button from "../Components/Button";
import Table from "../Components/Table";
import PreSaleList from "../Components/PreSaleList";
import UploadLogo from "../Components/UploadLogo";
import Loader from "../Components/Loader";
import Footer from "../Components/Footer";
import ICOMarket from "../Components/ICOMarket";
import TokenCreator from "../Components/TokenCreator";
import TokenHistory from "../Components/TokenHistory";
import Marketplace from "../Components/Marketplace";
import CreateICO from "../Components/CreateICO";
import Card from "../Components/Card";
import BuyToken from "../Components/BuyToken";
import WithdrawToken from "../Components/WithdrawToken";
import TokenTransfer from "../Components/TokenTransfer";

const index = () => {
  const {
    createERC20,
    connectWallet,
    address,
    shortenAddress,
    GET_ALL_PRESALE_TOKENS,
    GET_ALL_USER_PRESALE_TOKENS,
    createICOSale,
    buyToken,
    transferTokens,
    withdrawToken,
    ICO_MARKETPLACE_ADDRESS,
    loader,
    setLoader,
    reCall,
    accountBalance,
    setAddress,
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
    currency,
    PINATA_AIP_KEY,
    PINATA_SECRECT_KEY,
  } = useStateContext();

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const [allICOs, setAllICOs] = useState();
  const [allUserIcos, setAllUserIcos] = useState();

  //OPEN COMPONENT STATE
  const [openAllICO, setOpenAllICO] = useState(false);
  const [openTokenHistory, setOpenTokenHistory] = useState(false);

  const [openICOMarketplace, setOpenICOMarketplace] = useState(false);

  //BUY ICO TOKEN
  const [buyIco, setBuyIco] = useState();

  const copyAddress = () => {
    navigator.clipboard.writeText(ICO_MARKETPLACE_ADDRESS);
    notifySuccess(" Copied successfully");
  };

  useEffect(() => {
    if (address) {
      GET_ALL_PRESALE_TOKENS().then((token) => {
        console.log(token);
        setAllICOs(token);
      });
      GET_ALL_USER_PRESALE_TOKENS().then((token) => {
        console.log(token);
        setAllUserIcos(token);
      });
    }
  }, [address, reCall]);

  return (
    <div className="main_cont">
      {/* //HEADER */}
      <Header
        accountBalance={accountBalance}
        setAddress={setAddress}
        address={address}
        connectWallet={connectWallet}
        ICO_MARKETPLACE_ADDRESS={ICO_MARKETPLACE_ADDRESS}
        shortenAddress={shortenAddress}
        setOpenAllICO={setOpenAllICO}
        openAllICO={openAllICO}
        setOpenTokenCreator={setOpenTokenCreator}
        openTokenCreator={openTokenCreator}
        setOpenTokenHistory={setOpenTokenHistory}
        openTokenHistory={openTokenHistory}
        setOpenICOMarketplace={setOpenICOMarketplace}
        openICOMarketplace={openICOMarketplace}
      />
      <div className="create">
        <h1 style={{ fontSize: "2rem" }}>All ICOs Marketplace</h1>
        {allICOs?.length != 0 && (
          <Marketplace
            array={allICOs}
            shortenAddress={shortenAddress}
            setBuyIco={setBuyIco}
            setOpenBuyToken={setOpenBuyToken}
            currency={currency}
          />
        )}
        <Card
          setOpenAllICO={setOpenAllICO}
          setOpenTokenCreator={setOpenTokenCreator}
          setOpenTransferToken={setOpenTransferToken}
          setOpenTokenHistory={setOpenTokenHistory}
          setopenWidthdrawToken={setopenWidthdrawToken}
          setOpenICOMarketplace={setOpenICOMarketplace}
          copyAddress={copyAddress}
          setOpenCreateICO={setOpenCreateICO}
        />
      </div>
      {openAllICO && (
        <ICOMarket
          array={allUserIcos}
          shortenAddress={shortenAddress}
          handleClick={setOpenAllICO}
          currency={currency}
        />
      )}
      {openTokenCreator && (
        <TokenCreator
          createERC20={createERC20}
          shortenAddress={shortenAddress}
          setOpenTokenCreator={setOpenTokenCreator}
          setLoader={setLoader}
          address={address}
          connectWallet={connectWallet}
          PINATA_AIP_KEY={PINATA_AIP_KEY}
          PINATA_SECRECT_KEY={PINATA_SECRECT_KEY}
        />
      )}
      {openTokenHistory && (
        <TokenHistory
          shortenAddress={shortenAddress}
          setOpenTokenHistory={setOpenTokenHistory}
        />
      )}
      {openCreateICO && (
        <CreateICO
          shortenAddress={shortenAddress}
          setOpenCreateICO={setOpenCreateICO}
          connectWallet={connectWallet}
          address={address}
          createICOSale={createICOSale}
        />
      )}
      {openICOMarketplace && (
        <ICOMarket
          array={allICOs}
          shortenAddress={shortenAddress}
          handleClick={setOpenICOMarketplace}
          currency={currency}
        />
      )}
      {openBuyToken && (
        <BuyToken
          address={address}
          buyToken={buyToken}
          connectWallet={connectWallet}
          setOpenBuyToken={setOpenBuyToken}
          buyIco={buyIco}
          currency={currency}
        />
      )}
      {openTransferToken && (
        <TokenTransfer
          address={address}
          transferTokens={transferTokens}
          connectWallet={connectWallet}
          setOpenTransferToken={setOpenTransferToken}
        />
      )}
      {openWidthdrawToken && (
        <WidthdrawToken
          address={address}
          withdrawToken={withdrawToken}
          connectWallet={connectWallet}
          setopenWidthdrawToken={setopenWidthdrawToken}
        />
      )}

      <Footer />
      {loader && <Loader />}
    </div>
  );
};

export default index;
