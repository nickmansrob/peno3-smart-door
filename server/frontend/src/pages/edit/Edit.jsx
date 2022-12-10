import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { createJWT } from "../../App";

const Edit = () => {
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [group, setGroup] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const rolenames = Array.from(roles, (x) => x.name);
  const id = useParams();
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: createJWT(),
      },
    };

    console.log();

    fetch(
      `https://styx.rndevelopment.be/api/users/?id=${id.userId}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });

    fetch(`https://styx.rndevelopment.be/api/roles`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRoles(data);
      });
  }, []);
  const buttonPressed = () => {
    const bodydata = {
      id: Number(id.userId),
      firstName: firstName ? firstName : user.firstName,
      lastName: lastName ? lastName : user.lastName,
      role: { name: group },
    };
    fetch(`https://styx.rndevelopment.be/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodydata),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
    console.log(bodydata);
    setFirstName("");
    setLastName("");
    setGroup("");
  };

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
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder={user.firstName}
                />
              </div>
              <div className="dropdowncontainer">
                <label>Role</label>
                <DropdownList
                  data={rolenames}
                  value={group}
                  onChange={(group) => setGroup(group)}
                  placeholder="Role"
                />
              </div>
              <div className="formInput">
                <label>Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={user.lastName}
                />
              </div>
              <Link to={`/users`}>
                <button
                  type="button"
                  className="editbutton"
                  onClick={buttonPressed}
                >
                  Edit
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
