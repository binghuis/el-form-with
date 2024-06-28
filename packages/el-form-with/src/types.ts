import type { FormInstance, TableInstance } from "element-plus";
import { type FunctionalComponent, type Ref } from "vue";
import type { WithModalRef } from "./with-modal";
import type { WithDrawerRef } from "./with-drawer";

export interface WEPlainObject {
  [key: string]: unknown;
}

export type WEFormMode = "view" | "copy" | "add" | "edit";

type MaybeUndefined<T> = T | undefined;

export type WETableFilters = Record<string, (string | number)[]>;

export type WEFormContainerProps<FormValue, RecordValue> = {
  form: Ref<MaybeUndefined<FormInstance>>;
  mode: WEFormMode;
  data?: FormValue;
  record?: RecordValue;
  close: () => void;
  ok: () => void;
  loading: boolean;
  extra?: WEPlainObject;
};

export type WEFormContainer<
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
> = FunctionalComponent<WEFormContainerProps<FormValue, RecordValue>>;

export type WEOpenOverlayParams<FormValue, RecordValue> = {
  title?: string;
  data?: FormValue;
  mode?: WEFormMode;
  record?: RecordValue;
  extra?: WEPlainObject;
};

export type WEWithDrawerParams<FormValue, RecordValue> = {
  beforeClose?: () => Promise<"confirm"> | Promise<void>;
  afterClose?: () => void | Promise<void>;
  submit: (params: {
    mode: WEFormMode;
    data?: FormValue;
    record?: RecordValue;
  }) => Promise<void> | Promise<"success">;
};

export type WEWithModalParams<FormValue, RecordValue> = {
  submit?: (params: {
    mode: WEFormMode;
    data?: FormValue;
    record?: RecordValue;
  }) => Promise<void> | Promise<"success">;
};

export type WEWithTableParams<FormValue, RecordValue> = {
  pageSize?: number;
  requester?: WERequester<FormValue, RecordValue>;
};

export type WELoadings = {
  search: boolean;
  reset: boolean;
  refresh: boolean;
};

export type WETableSelectorContainerProps = {
  selector: Ref<MaybeUndefined<FormInstance>>;
  search: () => void;
  reset: () => void;
  refresh: () => void;
  isLoading: boolean;
  loadings: WELoadings;
};

export type WETableSelectorContainer =
  FunctionalComponent<WETableSelectorContainerProps>;

export type WETableSearch = (params?: { filters?: WETableFilters }) => void;

export type WETableContainerProps<RecordValue extends object> = {
  table: Ref<TableInstance | undefined>;
  data?: RecordValue[];
  search: WETableSearch;
  filters: WETableFilters;
  isLoading: boolean;
  forms?: Record<string, Ref<WEWithOverLayRefs>>;
};

export type WEWithOverLayRefs = WithModalRef | WithDrawerRef;

export type WETableContainer<RecordValue extends object = WEPlainObject> =
  FunctionalComponent<WETableContainerProps<RecordValue>>;

export interface WEPagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface WERequesterResponse<Item> {
  total: number;
  list: Item[];
}

export interface WERequesterParams<FormValue> {
  data: Partial<FormValue>;
  pagination: WEPagination;
  filters?: WETableFilters;
}

export interface WERequester<FormValue, RecordValue> {
  (params: WERequesterParams<FormValue>): Promise<
    WERequesterResponse<RecordValue>
  >;
}

export interface WERequestParams<RecordValue> {
  pagination?: WEPagination;
  filters?: WETableFilters;
}

export type WERequest<RecordValue> = (
  params?: WERequestParams<RecordValue>
) => void;
