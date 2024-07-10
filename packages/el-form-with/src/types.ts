import type { FormInstance, TableInstance } from "element-plus";
import type { Ref } from "vue";

export interface WEPlainObject {
  [key: string]: unknown;
}

export type WEFormMode = "view" | "copy" | "add" | "edit";

export type EmptyFunction = () => void | Promise<void>;

export type MaybeUndefined<T> = T | undefined;

export type MaybeNull<T> = T | null;

export type WETableFilters = Record<string, (string | number)[]>;

export type FormBoxOkHandle<FormValue, OkType> = (params?: {
  type?: OkType;
  data?: MaybeNull<FormValue>;
}) => void;

export interface WEFormBoxProps<
  FormValue extends object,
  FormType extends string = string,
  OkType extends string = string
> {
  reference: Ref<MaybeUndefined<FormInstance>>;
  mode: WEFormMode;
  data?: MaybeNull<FormValue>;
  close: EmptyFunction;
  ok: FormBoxOkHandle<FormValue, OkType>;
  loading: boolean;
  type?: FormType;
}

export interface WEOpenOverlayParams<FormValue, FormType> {
  title?: string;
  mode?: WEFormMode;
  data?: MaybeNull<FormValue>;
  type?: FormType;
  id?: string;
}

export interface WEWithOverlaysParams<
  FormValue extends object,
  FormType extends string,
  OkType extends string
> {
  beforeClose?: (done: EmptyFunction) => Promise<void>;
  afterClose?: EmptyFunction;
  submit: (
    params: {
      mode: WEFormMode;
      data: MaybeNull<FormValue>;
      okType?: OkType;
      formType?: FormType;
      id?: string | number;
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

export interface WETableBoxProps<
  RecordValue extends object,
  SelectorValue extends object = object
> {
  reference: Ref<MaybeUndefined<TableInstance>>;
  data?: MaybeNull<RecordValue[]>;
  reset: WETableReset;
  refresh: WETableRefresh;
  search: WETableSearch<SelectorValue>;
  filters: MaybeNull<WETableFilters>;
  isLoading: boolean;
  loadings: WELoadings;
  pagination: WEPagination;
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
  filters?: MaybeNull<WETableFilters>;
  data?: MaybeNull<SelectorValue>;
}

export type WERequest<SelectorValue> = (
  params?: WERequestParams<SelectorValue>
) => void;

export interface WERequesterParams<SelectorValue> {
  data?: MaybeNull<SelectorValue>;
  pagination: WEPagination;
  filters?: MaybeNull<WETableFilters>;
}

export interface WERequesterResponse<Item> {
  total: number;
  list: Item[];
}

export type WETableSearch<SelectorValue> = (params?: {
  data?: MaybeNull<SelectorValue>;
  filters?: MaybeNull<WETableFilters>;
}) => Promise<void>;

export type WETableReset = () => Promise<void>;

export type WETableRefresh = () => Promise<void>;

export type WETableOnHandle<SelectorValue> = (params: {
  data?: MaybeNull<SelectorValue>;
}) => Promise<void> | void;

export type WETableOnSearch<SelectorValue> = WETableOnHandle<SelectorValue>;

export type WETableOnReset<SelectorValue> = WETableOnHandle<SelectorValue>;

export type WETableOnRefresh<SelectorValue> = WETableOnHandle<SelectorValue>;
