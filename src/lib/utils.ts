/* eslint-disable @typescript-eslint/no-explicit-any */
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, SortingFn, sortingFns } from "@tanstack/react-table";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank,
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  if (itemRank.passed) return true;

  // Names are searched column by column (firstname / name / nickname), but users
  // often type several of these at once, in any order, with typos. Fall back to
  // checking that every word of the search matches at least one of the row's
  // name fields, so e.g. "Jean Dupont" or "Doudou Dupont" (nickname + lastname)
  // still finds the row.
  const original = row.original as {
    firstname?: string;
    name?: string;
    nickname?: string;
  };
  const fields = [original?.firstname, original?.name, original?.nickname].filter(
    (field): field is string => !!field,
  );
  if (fields.length === 0) return false;

  const words = String(value).trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return false;

  return words.every((word) =>
    fields.some((field) => rankItem(field, word).passed),
  );
};
