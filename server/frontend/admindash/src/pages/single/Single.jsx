import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./single.scss";
import { Link, useParams } from "react-router-dom";
import Qr from "../../components/qr/Qr";
import { useState, useEffect } from "react";

const Single = () => {
  const [user, setUser] = useState([]);

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
  }, []);
  const [isShown, setIsShown] = useState(false);
  console.log(id);
  const buttonClicked = () => {
    setIsShown((current) => !current);
  };

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
                  <span className="itemKey">Group:</span>
                  <span className="itemValue">{user.role}</span>
                </div>

                <Link
                  to={`/weekly/${id.userId}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="schedulerButton"> Click to see scheduler</div>
                </Link>
                <button type="button" onClick={buttonClicked}>
                  {isShown ? "Hide QR" : "Get QR"}
                </button>
              </div>
            </div>
          </div>

          <div className="right">
            {isShown && <Qr secret_key={user.tfaToken}></Qr>}
          </div>
        </div>
        <div className="bottom"></div>
      </div>
    </div>
  );
};

export default Single;
