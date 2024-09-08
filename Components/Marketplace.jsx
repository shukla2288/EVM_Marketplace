import React from "react";
import toast from "react-hot-toast";

//INTERNAL IMPORT
import Button from "./Button";
const Marketplace = ({
  shortenAddress,
  array,
  setBuyIco,
  setOpenBuyToken,
  currency,
}) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const copyAddress = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess(" Copied successfully");
  };
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Supply </th>
            <th>Token </th>
            <th>Creator </th>
            <th>Price </th>
            <th>Buy </th>
          </tr>
        </thead>
        <tbody>
          {array?.map((token, index) => (
            <tr>
              <td>{token?.name}</td>
              <td>{token?.symbol}</td>
              <td>{token?.preSaleBal}</td>
              <td>
                {shortenAddress(token?.token)}{" "}
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() => copyAddress(token?.token)}
                >
                  📋
                </strong>
              </td>
              <td>
                {shortenAddress(token?.creator)}{" "}
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() => copyAddress(token?.creator)}
                >
                  📋
                </strong>
              </td>
              <td>
                {token?.price} {currency}
              </td>
              <td onClick={() => (setBuyIco(token), setOpenBuyToken(true))}>
                <Button name={"Buy"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Marketplace;
