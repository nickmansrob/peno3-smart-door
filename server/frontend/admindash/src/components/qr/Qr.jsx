import React from "react";
import QRCode from "react-qr-code";

const Qr = ({ secret_key }) => {
  const qruri = "otpauth://totp/Secret?secret=" + secret_key;

  return (
    <div>
      <QRCode value={qruri}></QRCode>
    </div>
  );
};

export default Qr;
