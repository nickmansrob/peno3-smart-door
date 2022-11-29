import React from "react";
import QRCode from "react-qr-code";

const Qr = ({ secret_key }) => {
  const qruri = "otpauth://totp/secret?secret=" + secret_key;
  console.log(qruri);

  return (
    <div>
      <QRCode value={qruri}></QRCode>
    </div>
  );
};

export default Qr;
