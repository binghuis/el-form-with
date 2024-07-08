import type {
  WEFormBoxProps,
  WETableBoxProps,
  WESelectorBoxProps,
} from "./types";

export const formBoxDefaultProps: Array<
  keyof WEFormBoxProps<object, object, string>
> = ["reference", "mode", "data", "record", "close", "ok", "loading", "type"];

export const selectorBoxDefaultProps: Array<keyof WESelectorBoxProps> = [
  "reference",
  "search",
  "reset",
  "refresh",
  "isLoading",
  "loadings",
];

export const tableBoxDefaultProps: Array<keyof WETableBoxProps<object>> = [
  "reference",
  "data",
  "reset",
  "refresh",
  "search",
  "filters",
  "isLoading",
  "loadings",
  "pagination",
];