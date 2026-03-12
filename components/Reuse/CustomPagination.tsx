"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  limit: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function CustomPagination({
  totalPages,
  currentPage,
  limit,
  totalItems,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  // Calculate the range of items being shown
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl">
      {/* INFO SECTION */}
      <div className="text-xs font-medium text-slate-500">
        Showing{" "}
        <span className="text-slate-900 dark:text-white font-bold">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="text-slate-900 dark:text-white font-bold">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="text-slate-900 dark:text-white font-bold">
          {totalItems}
        </span>{" "}
        results
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-8">
        {/* ROWS PER PAGE */}
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Rows per page
            </p>
            <Select
              value={limit.toString()}
              onValueChange={(value) => onLimitChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px] border-slate-200 dark:border-slate-800">
                <SelectValue placeholder={limit} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* CONTROLS */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden lg:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center text-xs font-bold px-4 min-w-[80px]">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
