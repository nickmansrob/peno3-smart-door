import "./datatable.scss";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
//import { act } from "react-dom/test-utils";
import { Link } from "react-router-dom";

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
  

];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35, status: "active" },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 , status: "active"},
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45, status: "passive"  },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16, status: "passive"  },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null , status: "active" },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150, status: "passive"  },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 , status: "passive" },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 , status: "passive" },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 , status: "passive" },
];

const Datatable = () => {
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: () => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton"> View</div>
            </Link>
            <div className="deleteButton">Delete</div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <DataGrid
        rows={rows}
        columns={columns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;
