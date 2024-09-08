import React from "react";

const input = ({ placeholder, handleChange }) => {
  return (
    <>
      <input
        placeholder={placeholder}
        onChange={handleChange}
        class="input-style"
        type="text"
      />
    </>
  );
};

export default input;