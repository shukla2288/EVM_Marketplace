import React, { useState, useEffect } from "react";

import Input from "./Input";
import Button from "./Button";

const BuyToken = ({
  address,
  connectWallet,
  buyToken,
  setOpenBuyToken,
  buyIco,
  currency,
}) => {
  const [tokenQuentity, setTokenQuentity] = useState();

  console.log(buyIco);
  return (
    <div class="modal">
      <div class="modal-content">
        <span onClick={() => setOpenBuyToken(false)} class="close">
          &times;
        </span>
        <h2 style={{ marginTop: "2rem" }}>Buy Token</h2>
        <div className="input-Container">
          <Input
            placeholder={"amount"}
            handleChange={(e) => setTokenQuentity(e.target.value)}
          />
          <Input
            placeholder={
              tokenQuentity
                ? `${tokenQuentity * Number(buyIco?.price)} ${currency}`
                : "Output"
            }
            handleChange={(e) => setTokenQuentity(e.target.value)}
          />
        </div>
        <div className="button-box" style={{ marginTop: "1rem" }}>
          {address ? (
            <Button
              name={"Buy Token"}
              handleClick={() => buyToken(buyIco?.token, tokenQuentity)}
            />
          ) : (
            <Button
              name={"Connect Wallet"}
              handleClick={() => connectWallet()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyToken;
