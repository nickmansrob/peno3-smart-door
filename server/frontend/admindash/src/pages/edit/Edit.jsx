import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Edit = () => {
  const id = useParams();
  console.log(id);

  return (
    <div className="new">
      <Sidebar></Sidebar>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Edit user</h1>
        </div>
        <div className="bottom">
          <div className="left"></div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <FileUploadIcon className="icon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
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
              <button>Edit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
