import "./navbar.scss";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder="Search..." />
          <ManageSearchIcon></ManageSearchIcon>
        </div>
        <div className="items">
          <div className="item">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-2379004.jpg&fm=jpg&_gl=1*upmnj0*_ga*OTQwNTQwMTM5LjE2NjY3MzQzOTU.*_ga_8JE65Q40S6*MTY2NjczNDM5NS4xLjEuMTY2NjczNDQwMi4wLjAuMA.."
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
