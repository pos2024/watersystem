import React from 'react';
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';

const TableComponent = ({ columns, data }) => {
  // Initialize table hooks and options
  const {
    getTableProps,
    getTableBodyProps,
    getHeaderGroups,
    getRowModel,  // Make sure this is initialized correctly
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageIndex,
    pageCount
  } = useReactTable({
    data,
    columns,
    initialState: { pageIndex: 0 },
    // Initialize row model function correctly
    getCoreRowModel: getCoreRowModel(),  // This is the core model to handle rows
    getPaginationRowModel: getPaginationRowModel(),  // Ensure pagination is enabled
  });

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full table-auto border-collapse">
        <thead className="bg-blue-500 text-white">
          {getHeaderGroups().map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="px-4 py-2 text-left text-sm font-semibold">
                  {flexRender(column.columnDef.header, column.getHeaderProps())}
                  <span>
                    {column.getIsSorted() ? (column.getIsSortedDesc() ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {getRowModel().rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getCellProps())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-l ${
            canPreviousPage ? 'hover:bg-gray-300' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-r ${
            canNextPage ? 'hover:bg-gray-300' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
