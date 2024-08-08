import type {
  FormBoxProps,
  TableBoxProps,
  SelectorBoxProps,
  StepFormBoxProps,
} from "./types";

export const formBoxDefaultProps: Array<keyof FormBoxProps<object>> = [
  "reference",
  "mode",
  "data",
  "close",
  "ok",
  "loading",
  "type",
  "extra",
];

export const stepformBoxDefaultProps: Array<keyof StepFormBoxProps<object[]>> =
  [
    "mode",
    "close",
    "ok",
    "loading",
    "prev",
    "next",
    "hasPrev",
    "hasNext",
    "active",
    "forms",
  ];

export const selectorBoxDefaultProps: Array<keyof SelectorBoxProps> = [
  "reference",
  "search",
  "reset",
  "refresh",
  "isLoading",
  "loadings",
];

export const tableBoxDefaultProps: Array<keyof TableBoxProps<object>> = [
  "reference",
  "data",
  "reset",
  "refresh",
  "search",
  "filter",
  "isLoading",
  "loadings",
  "sort",
];
