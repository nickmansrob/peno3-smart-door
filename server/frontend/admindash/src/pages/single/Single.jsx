import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./single.scss";
import { Link, useParams } from "react-router-dom";

const Single = () => {
  const id = useParams();
  console.log(id);

  return (
    <div className="single">
      <Sidebar></Sidebar>
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
          <Link to= { `/edit/${id.userId}` } style={{ textDecoration: "none" }}>
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
                <h1 className="itemTitle">Jane Doe</h1>

                <div className="detailItem">
                  <span className="itemKey">ID:</span>
                  <span className="itemValue">1</span>
                </div>

                <div className="detailItem">
                  <span className="itemKey">Group:</span>
                  <span className="itemValue">Logistics</span>
                </div>

<<<<<<< HEAD
                <Link
                  to={`/users/${id.userId}/weekly`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="schedulerButton"> Click to see scheduler</div>
                </Link>
=======
                
                <Link to= { `/weekly/${id.userId}` } style={{ textDecoration: "none" }}>
            <div className="schedulerButton"> Click to see scheduler</div>
            </Link>
>>>>>>> 0e6575eda570283e8bdda44c008aaad7e314ecf7
              </div>
            </div>
          </div>
          <div className="right"></div>
        </div>
        <div className="bottom"></div>
      </div>
    </div>
  );
};

export default Single;
