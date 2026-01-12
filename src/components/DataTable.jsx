import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const DataTable = ({
  columns,
  rows,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 25, 100],
  stickyHeader = true,
  maxHeight = 440,
}) => {




  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        sx={{
          maxWidth:
            "100vw"
          ,
          height: {
            xs: "60vh",     // mobile → scroll INSIDE table
            sm: maxHeight,  // tablet & desktop
          },
          height: "auto",
          width: "100%",
          overflowX: "auto",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            height: 6,
            width: 6,
          },
        }}
      >
        <Table stickyHeader={stickyHeader} sx={{
          width: "max-content",   // table grows with content
          minWidth: "100%",       // but never smaller than container
        }} >
          <TableHead>
            <TableRow
              sx={{
                minWidth: 300,
                bgcolor: "primary.main",
                "& th": { borderBottom: "3px solid #ccc", fontWeight: "bold" },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ minWidth: column.minWidth, whiteSpace: "nowrap", textAlign: "center", verticalAlign: "middle" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>


          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((column) => (
                  <TableCell key={column.id} align="center">
                    {row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default DataTable;
