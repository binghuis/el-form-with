import type { FormInstance, TableInstance } from "element-plus";
import { type FunctionalComponent, type Ref } from "vue";

export interface PlainObject {
  [key: string]: unknown;
}

export type FormMode = "view" | "copy" | "add" | "edit";

type MaybeUndefined<T> = T | undefined;

export type TableFilters = Record<string, (string | number)[]>;

export type FormContainerProps<FormValue, RecordValue> = {
  form: Ref<MaybeUndefined<FormInstance>>;
  mode: FormMode;
  data?: FormValue;
  record?: RecordValue;
  close: () => void;
  ok: () => void;
  loading: boolean;
  extra?: PlainObject;
};

export type FormContainer<
  FormValue extends object = PlainObject,
  RecordValue extends object = PlainObject
> = FunctionalComponent<FormContainerProps<FormValue, RecordValue>>;

export type OpenOverlayParams<FormValue, RecordValue> = {
  title: string;
  data?: FormValue;
  mode?: FormMode;
  record?: RecordValue;
  extra?: PlainObject;
};

export type WithDrawerParams<FormValue, RecordValue> = {
  beforeClose?: () => Promise<"confirm"> | Promise<void>;
  afterClose?: () => void | Promise<void>;
  submit: (params: {
    mode: FormMode;
    data?: FormValue;
    record?: RecordValue;
  }) => Promise<void> | Promise<"success">;
};

export type WithModalParams<FormValue, RecordValue> = {
  submit?: (params: {
    mode: FormMode;
    data?: FormValue;
    record?: RecordValue;
  }) => Promise<void> | Promise<"success">;
};

export type WithTableParams<FormValue, RecordValue> = {
  pageSize?: number;
  requester?: Requester<FormValue, RecordValue>;
};

export type Loadings = {
  search: boolean;
  reset: boolean;
  refresh: boolean;
};

export type TableSelectorContainerProps = {
  selector: Ref<MaybeUndefined<FormInstance>>;
  search: () => void;
  reset: () => void;
  refresh: () => void;
  isLoading: boolean;
  loadings: Loadings;
};

export type TableSelectorContainer =
  FunctionalComponent<TableSelectorContainerProps>;

export type TableSearch = (params?: { filters?: TableFilters }) => void;

export type TableContainerProps<
  RecordValue extends object,
  Extra extends object
> = {
  table: Ref<TableInstance | undefined>;
  data?: RecordValue[];
  search: TableSearch;
  filters: TableFilters;
  isLoading: boolean;
  extra?: Extra;
};

export type TableContainer<
  RecordValue extends object = PlainObject,
  Extra extends object = PlainObject
> = FunctionalComponent<TableContainerProps<RecordValue, Extra>>;

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface RequesterResponse<Item> {
  total: number;
  list: Item[];
}

export interface RequesterParams<FormValue> {
  data: Partial<FormValue>;
  pagination: Pagination;
  filters?: TableFilters;
}

export interface Requester<FormValue, RecordValue> {
  (params: RequesterParams<FormValue>): Promise<RequesterResponse<RecordValue>>;
}

export interface RequestParams<RecordValue> {
  pagination?: Pagination;
  filters?: TableFilters;
}

export type Request<RecordValue> = (
  params?: RequestParams<RecordValue>
) => void;
