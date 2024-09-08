import React from "react";

const Table = ({ history, shortenAddress }) => {
  return (
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
          </tr>
        </thead>
        <tbody>
          {history?.map((token, index) => (
            <tr key={index + 1}>
              <td onClick={() => navigator.clipboard.writeText(token?.logo)}>
                <img
                  src={token?.logo || "theblockchaincoders.jpg"}
                  alt={token?.name}
                  style={{ with: "30px", height: "30px", borderRadius: "10px" }}
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
                  href={`https://www.oklink.com/amoy/address/${token?.tokenAddress}`}
                >
                  {shortenAddress(token?.tokenAddress)}
                </a>
              </td>
              <td
                onClick={() =>
                  navigator.clipboard.writeText(token?.transactionHash)
                }
              >
                <a
                  target="_blank"
                  href={`https://www.oklink.com/amoy/tx/${token?.transactionHash}`}
                >
                  {shortenAddress(token?.transactionHash)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
