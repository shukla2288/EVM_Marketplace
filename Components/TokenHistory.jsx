import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import Button from "../Components/Button";

const TokenHistory = ({ shortenAddress, setOpenTokenHistory }) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess(" Copied successfully");
  };

  const [history, setHistory] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("TOKEN_HISTORY");

    if (storedData) {
      setHistory(JSON.parse(storedData));
    }
  }, []);

  //ADD TOKEN METAMASK

  const addTokenToMetaMask = async (token) => {
    if (window.ethereum) {
      const tokenDecimals = 18;
      const tokenAddress = token?.tokenAddress;
      const tokenSymbol = token?.symbol;
      const tokenImage = token?.logo;

      try {
        const wasAdded = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image: tokenImage,
            },
          },
        });

        if (wasAdded) {
          notifySuccess("Token added!");
        } else {
          notifyError("Token not added");
        }
      } catch (error) {
        notifyError("Failed to add");
      }
    } else {
      notifyError("MetaMask is not installed");
    }
  };

  return (
    <div class="modal">
      <div class="modal-content">
        <span onClick={() => setOpenTokenHistory(false)} class="close">
          &times;
        </span>
        <h2>Token History</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Supply </th>
                <th>Address </th>
                <th>Hash </th>
                <th>Add Token </th>
              </tr>
            </thead>
            <tbody>
              {history?.map((token, index) => (
                <tr key={index + 1}>
                  <td
                    onClick={() => navigator.clipboard.writeText(token?.logo)}
                  >
                    <img
                      src={token?.logo || "theblockchaincoders.jpg"}
                      alt={token?.name}
                      style={{
                        with: "30px",
                        height: "30px",
                        borderRadius: "10px",
                      }}
                    />
                  </td>
                  <td>{token?.name}</td>
                  <td>{token?.symbol}</td>
                  <td>{token?.supply}</td>
                  <td
                    onClick={() =>
                      navigator.clipboard.writeText(token?.tokenAddress)
                    }
                  >
                    <a
                      target="_blank"
                      onClick={() => copyAddress(token?.tokenAddress)}
                    >
                      {shortenAddress(token?.tokenAddress)} 📋
                    </a>
                  </td>
                  <td
                    onClick={() =>
                      navigator.clipboard.writeText(token?.transactionHash)
                    }
                  >
                    <a
                      target="_blank"
                      onClick={() => copyAddress(token?.transactionHash)}
                    >
                      {shortenAddress(token?.transactionHash)} 📋
                    </a>
                  </td>
                  <td onClick={() => addTokenToMetaMask(token)}>
                    <Button name={"MetaMask"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenHistory;
