import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Edit = () => {
  function removeObjectWithId(arr, id) {
    const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
    const newarr = arr[objWithIdIndex];

    return newarr;
  }

  const arr = [
    { id: 1, name: "John", department: "HHG" },
    { id: 2, name: "Kate", department: "jdj" },
    { id: 3, name: "Peter", department: "FJJg" },
  ];
  console.log(arr);
  const id = useParams();
  console.log(id);
  const [user, setUser] = useState({});

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch("https://styx.rndevelopment.be/api/users", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log("TEST" + data);
        console.log("TEST2" + Object.values(data));
        setUser(data);
      });
  }, []);
  const ness = Object.values(user);
  console.log(ness);
  const final = [];
  for (let i = 0; i < ness.length; i++) {
    final.push(ness[i][1]);
  }
  console.log(final);
  const found = ness.find((obj) => {
    return obj.id === 0;
  });

  console.log(found);

  //const newdata = removeObjectWithId(arr,id)
  //console.log(newdata)

  return (
    <div className="new">
      <Sidebar></Sidebar>
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Edit user</h1>
        </div>
        <div className="bottom">
          <div className="left"></div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <FileUploadIcon className="icon" />
                </label>
                <input type="file" id="file" style={{ display: "none" }} />
              </div>
              <div className="formInput">
                <label>ID</label>
                <input type="text" placeholder="1" />
              </div>
              <div className="formInput">
                <label>First name</label>
                <input type="text" placeholder="John" />
              </div>
              <div className="formInput">
                <label>Group</label>
                <input type="text" placeholder="Administration" />
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
