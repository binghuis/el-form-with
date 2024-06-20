import type {
  ElMessageBoxOptions,
  FormInstance,
  MessageOptions,
  TableInstance,
} from "element-plus";
import type { FunctionalComponent, Ref } from "vue";

export interface PlainObject {
  [key: string]: unknown;
}

export enum FormMode {
  View = "view",
  Copy = "copy",
  Add = "add",
  Edit = "edit",
}

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
  cancelMsgBoxOpts?: Partial<ElMessageBoxOptions> | boolean;
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

export type TableSelectorProps = {
  form: Ref<FormInstance | undefined>;
  search: () => void;
  reset: () => void;
  refresh: () => void;
};

export type TableSelector = FunctionalComponent<TableSelectorProps>;

export type TableContainerProps<RecordData> = {
  table: Ref<TableInstance | undefined>;
  data?: RecordData[];
};

export type TableContainer<RecordData> = FunctionalComponent<
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
  query: Partial<FormData & Pagination>;
}

export interface Requester<FormData, RecordData> {
  (params: RequesterParams<FormData, RecordData>): Promise<
    RequesterResponse<RecordData>
  >;
}

export interface RequestParams<FormData, RecordData> {
  pagination?: Pagination;
}

export type Request<FormData, RecordData> = (
  params?: RequestParams<FormData, RecordData>
) => void;
