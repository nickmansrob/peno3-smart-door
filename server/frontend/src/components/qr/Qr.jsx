import React from "react";
import QRCode from "react-qr-code";

const Qr = ({ secret_key, name }) => {
  const qruri =
    "otpauth://totp/Styx:" + name + "?secret=" + secret_key + "&issuer=Styx";

  console.log(qruri);

  return (
    <div>
      <QRCode value={qruri}></QRCode>
    </div>
  );
};

export default Qr;
