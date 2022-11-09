import React from "react";

const Qr = ({ secret_key }) => {
  const totp = require("totp-generator");

  const token = totp("JBSWY3DPEHPK3PXP");

  console.log(token);
  return <div>{secret_key}</div>;
};

export default Qr;
