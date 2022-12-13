import "./datatable.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
//import { act } from "react-dom/test-utils";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { createJWT, url } from "../../App";

const Datatable = () => {
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: createJWT(),
      },
    };

    fetch("${url}/api/users", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      });

    fetch("${url}/api/latest_status", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStatus(data);
      });

    fetch("${url}/api/roles", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
      });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "firstName", headerName: "First name", flex: 2 },
    { field: "lastName", headerName: "Last name", flex: 2 },
    {
      field: "roleId",
      headerName: "Role",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            {roles.find((x) => x.id === params.row.roleId)
              ? roles.find((x) => x.id === params.row.roleId).name
              : ""}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      sortable: false,
      renderCell: (params) => {
        return (
          <div
            className={`cellWithStatus ${
              status.find((x) => x.id === params.row.id)
                ? status.find((x) => x.id === params.row.id).state
                : "LEAVE"
            } `}
          >
            {(status.find((x) => x.id === params.row.id)
              ? status.find((x) => x.id === params.row.id).state
              : "LEAVE") === "LEAVE"
              ? "OUTSIDE"
              : "INSIDE"}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const buttonClicked = () => {
          fetch("${url}/api/users", {
            method: "DELETE",
            body: JSON.stringify({
              id: params.row.id,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: createJWT(),
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
          window.location.reload(true);
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

  const rows = users;

  return (
    <div className="datatable">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
};

export default Datatable;
