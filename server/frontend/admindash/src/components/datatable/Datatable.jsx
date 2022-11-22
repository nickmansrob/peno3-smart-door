import "./datatable.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
//import { act } from "react-dom/test-utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 70,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: "active",
    width: 160,
    renderCell: (params) => {
      return (
        <div>
          <span>{params.row.age}</span>
          <span>{params.row.lastName}</span>
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      const buttonClicked = () => {
        console.log("Klik");
        //   fetch("", {
        //     method: "DELETE",
        //     body: JSON.stringify(params.row.id),
        //   })
        //     .then((response) => response.json())
        //     .then((bodydata) => {
        //       console.log("Success:", bodydata);
        //     })
        //     .catch((error) => {
        //       console.error("Error:", error);
        //     });
      };
      return (
        <div className="cellAction">
          <Link
            to={`/users/${params.row.id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="viewButton"> View</div>
          </Link>
          <button onClick={buttonClicked} className="deleteButton">
            Delete
          </button>
        </div>
      );
    },
  },
];

const Datatable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
    };
    fetch("https://styx.rndevelopment.be/api/users", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  const rows = users;

  return (
    <div className="datatable">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
