import type { FormInstance, TableInstance } from "element-plus";
import type { Ref } from "vue";

export interface WEPlainObject {
  [key: string]: unknown;
}

export type WEFormMode = "view" | "copy" | "add" | "edit";

export type MaybeUndefined<T> = T | undefined;
export type MaybeNull<T> = T | null;

export type WETableFilters = Record<string, (string | number)[]>;

export type FormBoxOkHandle<FormValue, OkType> = (params?: {
  type?: OkType;
  data?: MaybeNull<FormValue>;
}) => void;

export interface WEFormBoxProps<
  FormValue extends object,
  RecordValue extends object = object,
  FormType extends string = string,
  OkType extends string = string
> {
  reference: Ref<MaybeUndefined<FormInstance>>;
  mode: WEFormMode;
  data?: MaybeNull<FormValue>;
  record?: MaybeNull<RecordValue>;
  close: () => void;
  ok: FormBoxOkHandle<FormValue, OkType>;
  loading: boolean;
  type?: FormType;
}

export interface WEOpenOverlayParams<FormValue, RecordValue, FormType> {
  title?: string;
  mode?: WEFormMode;
  data?: MaybeNull<FormValue>;
  record?: MaybeNull<RecordValue>;
  type?: FormType;
}

export interface WEWithOverlaysParams<
  FormValue extends object,
  RecordValue extends object,
  FormType extends string,
  OkType extends string
> {
  beforeClose?: (done: () => void) => Promise<void>;
  afterClose?: () => void | Promise<void>;
  submit: (
    params: {
      mode: WEFormMode;
      data?: MaybeNull<FormValue>;
      record?: MaybeNull<RecordValue>;
      okType?: OkType;
      formType?: FormType;
    },
    done: () => void
  ) => Promise<void>;
}

export interface WEWithTableParams<SelectorFormValue, RecordValue> {
  pageSize?: number;
  requester: WERequester<SelectorFormValue, RecordValue>;
}

export interface WELoadings {
  search: boolean;
  reset: boolean;
  refresh: boolean;
}

export interface WESelectorBoxProps {
  reference: Ref<MaybeUndefined<FormInstance>>;
  search: () => void;
  reset: () => void;
  refresh: () => void;
  isLoading: boolean;
  loadings: WELoadings;
}

export type WETableSearch = (params?: { filters?: WETableFilters }) => void;

export interface WETableBoxProps<RecordValue extends object> {
  reference: Ref<MaybeUndefined<TableInstance>>;
  data?: RecordValue[];
  reset: () => void;
  refresh: () => void;
  search: WETableSearch;
  filters: WETableFilters;
  isLoading: boolean;
  loadings: WELoadings;
  pagination: WEPagination;
}

export interface WEPagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface WERequesterResponse<Item> {
  total: number;
  list: Item[];
}

export interface WERequesterParams<FormValue> {
  data?: MaybeNull<FormValue>;
  pagination: WEPagination;
  filters?: WETableFilters;
}

export interface WERequester<FormValue, RecordValue> {
  (params: WERequesterParams<FormValue>): Promise<
    WERequesterResponse<RecordValue>
  >;
}

export interface WERequestParams {
  pagination?: WEPagination;
  filters?: WETableFilters;
}

export type WERequest = (params?: WERequestParams) => void;
