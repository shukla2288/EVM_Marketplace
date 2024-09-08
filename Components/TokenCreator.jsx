import React, { useState } from "react";

//INTERNAL IMPORt
import UploadLogo from "../Components/UploadLogo";
import Input from "../Components/Input";
import Button from "../Components/Button";

const TokenCreator = ({
  shortenAddress,
  setOpenTokenCreator,
  setLoader,
  address,
  connectWallet,
  PINATA_AIP_KEY,
  PINATA_SECRECT_KEY,
  createERC20,
}) => {
  const [imageURL, setImageURL] = useState();
  const [token, updateToken] = useState({
    name: "",
    symbol: "",
    supply: "",
  });
  return (
    <div id="myModal" class="modal">
      <div class="modal-content">
        <span onClick={() => setOpenTokenCreator(false)} class="close">
          &times;
        </span>
        <h2 style={{ marginBottom: "1rem" }}>Create Token</h2>

        <UploadLogo
          imageURL={imageURL}
          setImageURL={setImageURL}
          setLoader={setLoader}
          PINATA_AIP_KEY={PINATA_AIP_KEY}
          PINATA_SECRECT_KEY={PINATA_SECRECT_KEY}
        />
        <div className="input-Container">
          <Input
            placeholder={"Name"}
            handleChange={(e) =>
              updateToken({ ...token, name: e.target.value })
            }
          />
          <Input
            placeholder={"Symbol"}
            handleChange={(e) =>
              updateToken({ ...token, symbol: e.target.value })
            }
          />
          <Input
            placeholder={"Supply"}
            handleChange={(e) =>
              updateToken({ ...token, supply: e.target.value })
            }
          />
        </div>
        <div className="button-box" style={{ marginTop: "1rem" }}>
          {address ? (
            <Button
              name={"Create Token"}
              handleClick={() => createERC20(token, address, imageURL)}
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

export default TokenCreator;
