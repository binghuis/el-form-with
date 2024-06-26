import type { FormInstance, MessageOptions, TableInstance } from "element-plus";
import type { FunctionalComponent, Ref } from "vue";

export interface PlainObject {
  [key: string]: unknown;
}

export enum FormMode {
  VIEW = "view",
  COPY = "copy",
  ADD = "add",
  EDIT = "edit",
}

export type TableFilters = Record<string, (string | number)[]>;

export type FormContainerProps = {
  form: Ref<FormInstance | undefined>;
  mode: FormMode;
  data?: FormData;
  close: () => void;
  ok: () => void;
  loading: boolean;
};

export type FormContainer = FunctionalComponent<FormContainerProps>;

export type OpenOverlayParams<FormData, RecordData> = {
  title: string;
  initialValue?: FormData;
  mode?: FormMode;
  record?: RecordData;
};

export type WithDrawerParams<FormData, RecordData> = {
  successMsgOpts?: Partial<MessageOptions> | boolean;
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

export type TableSelectorContainerProps = {
  form: Ref<FormInstance | undefined>;
  search: () => void;
  reset: () => void;
  refresh: () => void;
  loading: boolean;
};

export type TableSelectorContainer =
  FunctionalComponent<TableSelectorContainerProps>;

export type TableSearcher = (params?: { filters?: TableFilters }) => void;

export type TableContainerProps<RecordData extends object> = {
  table: Ref<TableInstance | undefined>;
  data?: RecordData[];
  search: TableSearcher;
  filters: TableFilters;
  loading: boolean;
};

export type TableContainer<RecordData extends object> = FunctionalComponent<
  TableContainerProps<RecordData>
>;

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
