import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import Qr from "../qrpage/Qr";

const New = () => {
  const [file, setFile] = useState("");
  console.log(file);

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
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                />
              </div>
              <div className="formInput">
                <label>ID</label>
                <input type="text" placeholder="1" />
              </div>
              <div className="formInput">
                <label>First name</label>
                <input type="text" placeholder="John" />
              </div>
              <div className="formInput">
                <label>Group</label>
                <input type="text" placeholder="Administration" />
              </div>
              <div className="formInput">
                <label>Surname</label>
                <input type="text" placeholder="Doe" />
              </div>
              <button>Send</button>
            </form>
          </div>
        </div>

        <div className="bottom">
          <div className="qrcontainer">
            <Qr secret_key="TEST"></Qr>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
