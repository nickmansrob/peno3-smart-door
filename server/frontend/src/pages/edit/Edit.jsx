import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
const Edit = () => {
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [group, setGroup] = useState([]);
  const rolenames = Array.from(roles, (x) => x.name);
  const id = useParams();
  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch(
      `https://styx.rndevelopment.be/api/users/?id=${id.userId}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      });

    fetch(`https://styx.rndevelopment.be/api/roles`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRoles(data);
      });
  }, []);

  return (
    <div className="new">
      <Sidebar></Sidebar>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Edit user</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                "https://cdn.vectorstock.com/i/preview-1x/48/06/image-preview-icon-picture-placeholder-vector-31284806.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label>First name</label>
                <input type="text" placeholder={user.firstName} />
              </div>
              <div>
                <label>Role</label>
                <DropdownList
                  data={rolenames}
                  value={group}
                  onChange={(group) => setGroup(group)}
                />
              </div>
              <div className="formInput">
                <label>Surname</label>
                <input type="text" placeholder={user.lastName} />
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
