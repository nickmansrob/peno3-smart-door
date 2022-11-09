import React from "react";

const Qr = () => {
  const totp = require("totp-generator");

  const token = totp("JBSWY3DPEHPK3PXP");

  console.log(token);
  return <div>{token}</div>;
};

export default Qr;
