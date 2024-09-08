import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";

import UploadICON from "./SVG/UploadICON";
const UploadLogo = ({
  setImageURL,
  imageURL,
  setLoader,
  PINATA_AIP_KEY,
  PINATA_SECRECT_KEY,
}) => {
  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          maxBodyLength: "Infinity",
          headers: {
            pinata_api_key: PINATA_AIP_KEY,
            pinata_secret_api_key: PINATA_SECRECT_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        setImageURL(url);
        setLoader(false);
        notifySuccess("Cover Image Uploade Successfully");
      } catch (error) {
        setLoader(false);
        notifyError("Unable to upload image to Pinata");
      }
    }
  };

  const onDrop = useCallback(async (acceptedFile) => {
    await uploadToIPFS(acceptedFile[0]);
  }, []);

  const {
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, maxSize: 500000000000 });
  return (
    <>
      {imageURL ? (
        <div>
          <img
            style={{ width: "200px", height: "auto" }}
            src={imageURL}
            alt=""
          />
        </div>
      ) : (
        <div {...getRootProps()}>
          <label for="file" class="custum-file-upload">
            <div class="icon">
              <UploadICON />
            </div>
            <div class="text">
              <span>Click to upload Logo</span>
            </div>
            <input {...getInputProps()} id="file" type="file" />
          </label>
        </div>
      )}
    </>
  );
};

export default UploadLogo;