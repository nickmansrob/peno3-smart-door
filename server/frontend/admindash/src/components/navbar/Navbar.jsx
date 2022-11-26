import "./navbar.scss";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
          
          
        </div>
        <div className="items">
          <div className="item">
             <SupervisorAccountIcon></SupervisorAccountIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;


/*<div className="search">
          <input type="text" placeholder="Search..." />
          <ManageSearchIcon></ManageSearchIcon>
        </div>*/