import "./table.scss";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 234,
      name: "Martijn",
      surname: "Spaepen",
      timestamp: "17:03:456",
      date: "13/03/2022",
      group: "IT",
    },
    {
      id: 456,
      name: "Kevin",
      surname: "Maes",
      timestamp: "15:01:456",
      date: "13/03/2022",
      group: "Logistics",
    },
    {
      id: 567,
      name: "Rob",
      surname: "Nickmans",
      timestamp: "12:01:456",
      date: "13/03/2022",
      group: "Development",
    },
    {
      id: 124,
      name: "Robin",
      surname: "Vandenhoeck",
      timestamp: "10:07:456",
      date: "13/03/2022",
      group: "Sales",
    },

    {
      id: 984,
      name: "Milo",
      surname: "Rogge",
      timestamp: "16:47:456",
      date: "12/03/2022",
      group: "Sales",
    },

    {
      id: 498,
      name: "Milo",
      surname: "Rogge",
      timestamp: "16:47:456",
      date: "12/03/2022",
      group: "Sales",
    },

    {
      id: 176,
      name: "Wouter",
      surname: "Strobbe",
      timestamp: "14:33:456",
      date: "12/03/2022",
      group: "Consulting",
    },
  ];

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Employee Id</TableCell>
            <TableCell className="tableCell">Name</TableCell>
            <TableCell className="tableCell">Surname</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Timestamp</TableCell>
            <TableCell className="tableCell">Group</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell className="tableCell">{row.name}</TableCell>
              <TableCell className="tableCell">{row.surname}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.timestamp}</TableCell>
              <TableCell className="tableCell">{row.group}</TableCell>
              <TableCell className="tableCell"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
