import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./single.scss";
import { Link } from "react-router-dom";

const Single = () => {
  return (
    <div className="single">
      <Sidebar></Sidebar>
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title"> Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">Jane Doe</h1>

                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">janedoe@gmail.com</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">0898765</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Adres:</span>
                  <span className="itemValue">Germeer 16</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Land:</span>
                  <span className="itemValue">USA</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Age</span>
                  <span className="itemValue">33</span>
                </div>
                <Link to="/users/calender" style={{ textDecoration: "none" }}>
            <div className="schedulerButton"> Click to see scheduler</div>
            </Link>
              </div>
            </div>
          </div>
          <div className="right">
          
          </div>
        </div>
        <div className="bottom"></div>
        
      </div>
    </div>
  );
};

export default Single;
