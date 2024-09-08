import React, { useState, useEffect } from "react";

import Input from "./Input";
import Button from "./Button";

const CreateICO = ({
  createICOSale,
  address,
  connectWallet,
  setOpenCreateICO,
}) => {
  const [preSale, setPreSale] = useState({
    address: "",
    price: "",
  });
  return (
    <div class="modal">
      <div class="modal-content">
        <span onClick={() => setOpenCreateICO(false)} class="close">
          &times;
        </span>
        <h2>Create ICO</h2>
        <div className="input-Container" style={{ marginTop: "1rem" }}>
          <Input
            placeholder={"Address"}
            handleChange={(e) =>
              setPreSale({ ...preSale, address: e.target.value })
            }
          />
          <Input
            placeholder={"Price"}
            handleChange={(e) =>
              setPreSale({ ...preSale, price: e.target.value })
            }
          />
        </div>
        <div className="button-box" style={{ marginTop: "1rem" }}>
          {address ? (
            <Button
              name={"Create Presale"}
              handleClick={() => createICOSale(preSale)}
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

export default CreateICO;
