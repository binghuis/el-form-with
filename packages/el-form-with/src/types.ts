import type { ElPagination, FormInstance, TableInstance } from "element-plus";
import type { Ref } from "vue";

export { type WithDialogRefValue } from "./with-dialog";
export { type WithDrawerRefValue } from "./with-drawer";
export { type TableWithOverlayRef } from "./with-table";

export interface WEPlainObject {
  [key: string]: unknown;
}

export type WEFormMode = "view" | "copy" | "add" | "edit";

export type EmptyFunction = () => void | Promise<void>;

export type MaybeUndefined<T> = T | undefined;

export type WETableFilters = Record<string, (string | number)[]>;

export type FormBoxOkHandle<OverlayOkType> = (params?: {
  type?: OverlayOkType;
}) => void;

export interface WEFormBoxProps<
  FormValue extends object,
  FormType extends string = string,
  OverlayOkType extends string = string
> {
  reference: Ref<MaybeUndefined<FormInstance>>;
  mode: WEFormMode;
  data?: FormValue;
  close: EmptyFunction;
  ok: FormBoxOkHandle<OverlayOkType>;
  loading: boolean;
  type?: FormType;
  extra?: object;
}

export interface WEStepFormBoxPropsForms<
  FormsValue extends object[],
  FormsType extends string[]
> {
  reference: Ref<MaybeUndefined<FormInstance>>;
  data?: FormsValue[number];
  type?: FormsType[number];
}

export interface WEStepFormBoxProps<
  FormsValue extends object[],
  FormsType extends string[] = [],
  OverlayOkType extends string = string
> {
  mode: WEFormMode;
  ok: FormBoxOkHandle<OverlayOkType>;
  close: EmptyFunction;
  prev: EmptyFunction;
  hasPrev: boolean;
  next: EmptyFunction;
  hasNext: boolean;
  loading: boolean;
  active: number;
  forms?: WEStepFormBoxPropsForms<FormsValue, FormsType>[];
}

export interface WEStepOpenOverlayParamsForms<
  FormsValue extends object[],
  FormsType extends string[]
> {
  data?: FormsValue[number];
  type?: FormsType[number];
}

export interface WEStepOpenOverlayParams<
  FormsValue extends object[],
  FormsType extends string[]
> {
  title?: string;
  mode?: WEFormMode;
  active?: number;
  forms?: WEStepOpenOverlayParamsForms<FormsValue, FormsType>[];
}

export interface WEStepWithOverlaysParams<
  FormsValue extends object[],
  FormsType extends string[],
  OverlayOkType extends string
> {
  beforeClose?: (done: EmptyFunction) => Promise<void>;
  afterClose?: EmptyFunction;
  steps: number;
  submit: (
    params: {
      mode: WEFormMode;
      data: FormsValue;
      OverlayOkType?: OverlayOkType;
      formType?: FormsType;
      id?: string;
      extra?: object;
    },
    done: EmptyFunction
  ) => Promise<void>;
}

export interface WEOpenOverlayParams<FormValue, FormType> {
  title?: string;
  mode?: WEFormMode;
  data?: FormValue;
  type?: FormType;
  id?: string;
  extra?: object;
}

export interface WEWithOverlaysParams<
  FormValue extends object,
  FormType extends string,
  OverlayOkType extends string
> {
  beforeClose?: (done: EmptyFunction) => Promise<void>;
  afterClose?: EmptyFunction;
  submit: (
    params: {
      mode: WEFormMode;
      data?: FormValue;
      overlayOkType?: OverlayOkType;
      formType?: FormType;
      id?: string;
      extra?: object;
    },
    done: EmptyFunction
  ) => Promise<void>;
}

export interface WEWithTableParams<RecordValue, SelectorValue> {
  pageSize?: number;
  requester: WERequester<RecordValue, SelectorValue>;
}

export interface WELoadings {
  search: boolean;
  reset: boolean;
  refresh: boolean;
}

export interface WESelectorBoxProps {
  reference: Ref<MaybeUndefined<FormInstance>>;
  search: EmptyFunction;
  reset: EmptyFunction;
  refresh: EmptyFunction;
  isLoading: boolean;
  loadings: WELoadings;
}

export type PaginationPropsInj = Pick<
  typeof ElPagination,
  | "layout"
  | "disabled"
  | "total"
  | "currentPage"
  | "pageSize"
  | "onUpdate:current-page"
  | "onUpdate:page-size"
>;

export interface WETableBoxProps<RecordValue extends object> {
  reference: Ref<MaybeUndefined<TableInstance>>;
  data?: RecordValue[];
  reset: WETableReset;
  refresh: WETableRefresh;
  search: WETableSearch;
  filter: WETableFilter;
  sort: WETableSort;
  isLoading: boolean;
  loadings: WELoadings;
  paginationPropsInj?: PaginationPropsInj;
}

export interface WEPagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface WERequester<RecordValue, SelectorValue> {
  (params: WERequesterParams<SelectorValue>): Promise<
    WERequesterResponse<RecordValue>
  >;
}

export interface WERequestParams<SelectorValue> {
  pagination?: WEPagination;
  filters?: WETableFilters;
  sorts?: WETableSorts;
  data?: SelectorValue;
  extra?: object;
}

export type WERequest<SelectorValue> = (
  params?: WERequestParams<SelectorValue>
) => void;

export interface WERequesterParams<SelectorValue> {
  data?: SelectorValue;
  pagination: WEPagination;
  filters?: WETableFilters;
  sorts?: WETableSorts;
  extra?: object;
}

export interface WERequesterResponse<Item> {
  total: number;
  list: Item[];
}

export type WETableSearch = (params?: { extra?: object }) => Promise<void>;

export type WETableSort = (params: {
  prop: string;
  order: string;
}) => Promise<void>;

export type WETableSorts = Record<string, string>;

export type WETableFilter = (params?: WETableFilters) => Promise<void>;

export type WETableReset = () => Promise<void>;

export type WETableRefresh = () => Promise<void>;

export type WETableOnHandle<SelectorValue> = (params: {
  data?: SelectorValue;
}) => Promise<void> | void;

export type WETableOnSearch<SelectorValue> = WETableOnHandle<SelectorValue>;

export type WETableOnReset<SelectorValue> = WETableOnHandle<SelectorValue>;

export type WETableOnRefresh<SelectorValue> = WETableOnHandle<SelectorValue>;

export type WETableOnFilter = (params: {
  filters?: WETableFilters;
}) => Promise<void>;

export type WETableOnSort = (params: { sorts?: WETableSorts }) => Promise<void>;
