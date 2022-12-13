import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import base32Encode from "base32-encode";
import "react-widgets/styles.css";
import DropdownList from "react-widgets/DropdownList";
import { createJWT, url } from "../../App";
const New = () => {
  const [roles, setRoles] = useState([]);
  const rolenames = Array.from(roles, (x) => x.name);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [group, setGroup] = useState("");
  const [isShown, setIsShown] = useState(false);
  const array = new Int8Array(15);
  const scndarray = crypto.getRandomValues(array);
  const [rand, setRand] = useState(scndarray);
  const [ansId, setAnsId] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: createJWT(),
      },
    };
    fetch(`${url}/api/roles`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
      });
  }, []);

  const buttonPressed = () => {
    setRand(crypto.getRandomValues(array));
    setIsShown(true);

    const bodydata = {
      firstName: name,
      lastName: surname,
      role: { name: group.toUpperCase() },
      tfaToken: base32Encode(rand, "RFC4648"),
    };

    fetch(`${url}/api/users`, {
      method: "POST",
      body: JSON.stringify(bodydata),
      headers: {
        "Content-Type": "application/json",
        Authorization: createJWT(),
      },
    })
      .then((response) => response.json())
      .then((bodydata) => {
        setAnsId(bodydata.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

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
          <div className="right">
            <form>
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
                <label>Surname</label>
                <input
                  type="text"
                  placeholder="Doe"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>

              <div className="roleselector">
                <label>Role</label>
                <DropdownList
                  data={rolenames}
                  value={group}
                  onChange={(group) => setGroup(group)}
                />
              </div>
              <button type="button" onClick={buttonPressed}>
                Send
              </button>
            </form>
          </div>
        </div>
        {isShown && <div className="bottom">Id: {ansId}</div>}
      </div>
    </div>
  );
};
export default New;
