import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import Qr from "../../components/qr/Qr";
import base32Encode from "base32-encode";
import axios from "axios";

const New = () => {
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [group, setGroup] = useState("");
  const [isShown, setIsShown] = useState(false);
  const [image, setImage] = useState(null);

  const array = new Int8Array(5);
  const [data, setData] = useState(array);
  const key = base32Encode(data, "Crockford");

  const getFileInfo = (e) => {
    setFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("my-image-file", e.target.files[0], e.target.files[0].name);
    setImage(formData);
    console.log(image);
  };

  const buttonPressed = () => {
    setData(crypto.getRandomValues(array));
    setIsShown(true);
    console.log(name);
    console.log(surname);
    console.log(group);

    const bodydata = {
      firstName: name,
      lastName: surname,
      role: group,
      tfaToken: key,
    };

    fetch("http://styx.rndevelopment.be/api/users", {
      method: "POST",
      body: JSON.stringify(bodydata),
    })
      .then((response) => response.json())
      .then((bodydata) => {
        console.log("Success:", bodydata);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // axios.post('url', image)
    // .then(res =>{
    //   console.log('Axios response:', res)
    // })

    setName("");
    setGroup("");
    setSurname("");
  };

  return (
    <div className="new">
      <Sidebar></Sidebar>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add new user</h1>
        </div>
        <div className="middle">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://cdn.vectorstock.com/i/preview-1x/48/06/image-preview-icon-picture-placeholder-vector-31284806.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <FileUploadIcon className="icon" />
                </label>
                <input
                  onChange={getFileInfo}
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>First name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="formInput">
                <label>Group</label>
                <input
                  type="text"
                  placeholder="Administration"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                />
              </div>
              <div className="formInput">
                <label>Surname</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
              <button type="button" onClick={buttonPressed}>
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="bottom">
          {isShown && (
            <div className="qrcontainer">
              <Qr secret_key={key}></Qr>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default New;
