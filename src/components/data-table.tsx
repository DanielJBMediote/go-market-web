"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SelectValue } from "@radix-ui/react-select";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Table as ReactTable,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";

interface TablePaginationOptions {
  pageIndex?: number;
  pageSize?: number;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  showItemsPerPageOptions?: boolean;
  showPagination?: boolean;
  onPageSizeChange?: (pageSize: number) => void;
  onPageChange?: (pageIndex: number) => void;
  onPreviousPageClick?: () => void;
  onNextPageClick?: () => void;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: TablePaginationOptions;
  onRowSelectionChange?: (selected: TData[]) => void;
}

interface ClientSideTableProps<TData> {
  table: ReactTable<TData>;
  columns: ColumnDef<TData>[];
}

interface TablePaginationProps<TData> {
  table: ReactTable<TData>;
  options: TablePaginationOptions;
}

function ClientSideTable<TData>({ table, columns }: ClientSideTableProps<TData>) {
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function TablePagination<TData>({
  table,
  options: {
    itemsPerPageOptions = [10, 20, 30, 40, 50],
    showItemsPerPageOptions = true,
    showPagination = true,
    onNextPageClick,
    onPageChange,
    onPageSizeChange,
    onPreviousPageClick,
  },
}: TablePaginationProps<TData>) {
  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    table.setPageSize(newPageSize);
    onPageSizeChange?.(newPageSize);
  };

  const handlePageChange = (pageIndex: number) => {
    table.setPageIndex(pageIndex);
    onPageChange?.(pageIndex);
  };

  const handleClickPreviousPage = () => {
    table.previousPage();
    onPreviousPageClick?.();
  };

  const handleClickNextPage = () => {
    table.nextPage();
    onNextPageClick?.();
  };

  return (
    <div className="flex items-center justify-between px-2">
      {showItemsPerPageOptions && (
        <div className="flex items-center space-x-2 w-full">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {showPagination && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`#page=${table.getState().pagination.pageIndex}`}
                onClick={handleClickPreviousPage}
                className={!table.getCanPreviousPage() ? "opacity-50 cursor-not-allowed" : ""}
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href={`#page=${index + 1}`}
                  onClick={() => handlePageChange(index)}
                  isActive={index === table.getState().pagination.pageIndex}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`#page=${table.getState().pagination.pageIndex}`}
                onClick={handleClickNextPage}
                className={!table.getCanNextPage() ? "opacity-50 cursor-not-allowed" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export function DataTable<TData>({
  columns,
  data,
  onRowSelectionChange,
  pagination = {
    defaultItemsPerPage: 20,
  },
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    onRowSelectionChange: (updater) => {
      const newRowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(newRowSelection);
      const selectedRows = Object.keys(newRowSelection).map(
        (key) => table.getRowModel().rowsById[key].original
      );
      onRowSelectionChange?.(selectedRows);
    },
    pageCount: pagination.pageSize,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      // pagination: {
      //   pageSize: pagination.defaultItemsPerPage,
      //   pageIndex: pagination.pageIndex || 0,
      // },
    },
  });

  const hasPagination = Object.keys(pagination).length > 0;

  return (
    <div className="rounded-md border pb-4">
      <ClientSideTable table={table} columns={columns} />
      {hasPagination && <TablePagination table={table} options={pagination} />}
    </div>
  );
}
