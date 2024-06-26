import type { FormInstance, MessageOptions, TableInstance } from "element-plus";
import { MaybeRef, type FunctionalComponent, type Ref } from "vue";

export interface PlainObject {
  [key: string]: unknown;
}

export type FormMode = "view" | "copy" | "add" | "edit";

type MaybeUndefined<T> = T | undefined;

export type TableFilters = Record<string, (string | number)[]>;

export type FormContainerProps<FormData, RecordData> = {
  form: Ref<MaybeUndefined<FormInstance>>;
  mode: FormMode;
  data?: FormData;
  record?: RecordData;
  close: () => void;
  ok: () => void;
  loading: boolean;
  extra?: PlainObject | null;
};

export type FormContainer<FormData, RecordData> = FunctionalComponent<
  FormContainerProps<FormData, RecordData>
>;

export type OpenOverlayParams<FormData, RecordData> = {
  title: string;
  initialValue?: FormData;
  mode?: FormMode;
  record?: RecordData;
  extra?: PlainObject;
};

export type WithDrawerParams<FormData, RecordData> = {
  beforeClose?: () => Promise<"confirm"> | Promise<void>;
  afterClose?: () => void | Promise<void>;
  submit: (params: {
    mode: FormMode;
    data?: FormData | null;
    record?: RecordData | null;
  }) => Promise<void> | Promise<"success">;
};

export type WithModalParams<FormData, RecordData> = {
  submit?: (params: {
    mode: FormMode;
    data?: FormData | null;
    record?: RecordData | null;
  }) => Promise<void> | Promise<"success">;
};

export type WithTableParams<FormData, RecordData> = {
  pageSize?: number;
  requester?: Requester<FormData, RecordData>;
};

export type Loadings = {
  search: boolean;
  reset: boolean;
  refresh: boolean;
};

export type TableSelectorContainerProps = {
  form: Ref<MaybeUndefined<FormInstance>>;
  search: () => void;
  reset: () => void;
  refresh: () => void;
  isLoading: boolean;
  loadings: Loadings;
};

export type TableSelectorContainer =
  FunctionalComponent<TableSelectorContainerProps>;

export type TableSearcher = (params?: { filters?: TableFilters }) => void;

export type TableContainerProps<
  RecordData extends object,
  Extra extends PlainObject
> = {
  table: Ref<TableInstance | undefined>;
  data?: RecordData[];
  search: TableSearcher;
  filters: TableFilters;
  isLoading: boolean;
  extra?: Extra;
};

export type TableContainer<
  RecordData extends object,
  Extra extends PlainObject
> = FunctionalComponent<TableContainerProps<RecordData, Extra>>;

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface RequesterResponse<Item> {
  total: number;
  list: Item[];
}

export interface RequesterParams<FormData, RecordData> {
  query: Partial<FormData>;
  pagination: Pagination;
  filters?: TableFilters;
}

export interface Requester<FormData, RecordData> {
  (params: RequesterParams<FormData, RecordData>): Promise<
    RequesterResponse<RecordData>
  >;
}

export interface RequestParams<RecordData> {
  pagination?: Pagination;
  filters?: TableFilters;
}

export type Request<RecordData> = (params?: RequestParams<RecordData>) => void;
