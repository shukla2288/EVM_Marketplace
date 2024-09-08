import React, { useState, useEffect } from "react";

//IMPORT
import Button from "./Button";

const Header = ({
  address,
  setAddress,
  connectWallet,
  PRESALE_ADDRESS,
  shortenAddress,
  setOpenAllICO,
  openAllICO,
  setOpenTokenCreator,
  openTokenCreator,
  setOpenTokenHistory,
  openTokenHistory,
  setOpenICOMarketplace,
  openICOMarketplace,
  accountBalance,
}) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetaMaskInstalled(true);

      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [address]);

  const handleAccountsChanged = (accounts) => {
    console.log("Accounts changed:", accounts[0]);
    setAddress(accounts[0]);
  };

  return (
    <header class="header">
      <nav>
        <div class="logo">
          <a href="/">
            ICO.<span>Market</span>
          </a>
        </div>
        <input type="checkbox" id="menu-toggle" />
        <label for="menu-toggle" class="menu-icon">
          &#9776;
        </label>
        <ul class="menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a
              onClick={() =>
                openICOMarketplace
                  ? setOpenICOMarketplace(false)
                  : setOpenICOMarketplace(true)
              }
            >
              ICO Marketplace
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                openAllICO ? setOpenAllICO(false) : setOpenAllICO(true)
              }
            >
              Created ICO
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                openTokenHistory
                  ? setOpenTokenHistory(false)
                  : setOpenTokenHistory(true)
              }
            >
              History
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                openTokenCreator
                  ? setOpenTokenCreator(false)
                  : setOpenTokenCreator(true)
              }
            >
              Create Token
            </a>
          </li>

          {address ? (
            <li>
              <Button
                name={`${shortenAddress(address)}: ${accountBalance?.slice(
                  0,
                  5
                )}`}
              />
            </li>
          ) : (
            <li>
              <Button handleClick={connectWallet} name="Connect Wallet" />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;