import React from "react";

const PreSaleTable = ({ array, shortenAddress }) => {
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
                  onClick={() => navigator.clipboard.writeText(token?.token)}
                >
                  📋
                </strong>
              </td>
              <td>
                {shortenAddress(token?.creator)}{" "}
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() => navigator.clipboard.writeText(token?.creator)}
                >
                  📋
                </strong>
              </td>
              <td>{token?.price} ETH</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreSaleTable;
