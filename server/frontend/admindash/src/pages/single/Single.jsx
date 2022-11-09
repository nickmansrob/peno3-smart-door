import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./single.scss";
import { Link, useParams } from "react-router-dom";

const Single = () => {
  const id = useParams()
    console.log(id)
  
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
                src="https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg"
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

                
                <Link to= { `/weekly/${id.userId}` } style={{ textDecoration: "none" }}>
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
