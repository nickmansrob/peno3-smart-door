import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./single.scss";
import { Link, useParams } from "react-router-dom";
import Qr from "../../components/qr/Qr";
import { useState, useEffect } from "react";
import { createJWT, url } from "../../App";

const Single = () => {
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);

  const id = useParams();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: createJWT(),
      },
    };
    fetch(
      `${url}/api/users/?id=${id.userId}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUser(data);
      });

    fetch(`${url}/api/roles`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRoles(data);
      });
  }, []);
  const [isShown, setIsShown] = useState(false);
  const buttonClicked = () => {
    setIsShown((current) => !current);
  };
  //{roles.find((x) => x.id === user.roleId)}
  return (
    <div className="single">
      <Sidebar></Sidebar>
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link to={`/edit/${id.userId}`} style={{ textDecoration: "none" }}>
              <div className="editButton"> Edit</div>
            </Link>
            <h1 className="title"> Information</h1>
            <div className="item">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">
                  {user.firstName} {user.lastName}
                </h1>

                <div className="detailItem">
                  <span className="itemKey">ID:</span>
                  <span className="itemValue">{id.userId}</span>
                </div>

                <div className="detailItem">
                  <div className="itemKey">Role:</div>
                  <div className="itemValue">
                    {user.role ? user.role.name : ""}
                  </div>
                </div>

                <Link
                  to={`/weeklytable/${id.userId}`}
                  style={{ textDecoration: "none" }}
                >
                  <button type="button" className="schedulerButton">
                    See permissions
                  </button>
                </Link>
                <button type="button" onClick={buttonClicked}>
                  {isShown ? "Hide QR" : "Get QR"}
                </button>
              </div>
            </div>
          </div>

          <div className="right">
            {isShown && (
              <Qr secret_key={user.tfaToken} name={user.firstName}></Qr>
            )}
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    </div>
  );
};

export default Single;
