import type { FormInstance, TableInstance } from "element-plus";
import type { FunctionalComponent, Ref } from "vue";
import type { WithDialogRef } from "./with-dialog";
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
  ok: (params?: { type?: string }) => void;
  loading: boolean;
  type?: string;
};

export type WEFormContainer<
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
> = FunctionalComponent<WEFormContainerProps<FormValue, RecordValue>>;

export type WEOpenOverlayParams<FormValue, RecordValue, FormType> = {
  title?: string;
  data?: FormValue;
  mode?: WEFormMode;
  record?: RecordValue;
  type?: FormType;
};

export type WEWithDrawerParams<FormValue, RecordValue> = {
  beforeClose?: () => Promise<"confirm"> | Promise<void>;
  afterClose?: () => void | Promise<void>;
  submit: (
    params: {
      mode: WEFormMode;
      data?: FormValue;
      record?: RecordValue;
    },
    done: () => void
  ) => Promise<void>;
};

export type WEWithDialogParams<FormValue, RecordValue> = {
  submit?: (
    params: {
      mode: WEFormMode;
      data?: FormValue;
      record?: RecordValue;
      type?: string;
    },
    done: () => void
  ) => Promise<void>;
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

export type WETableContainerProps<RecordValue extends object = WEPlainObject> =
  {
    table: Ref<TableInstance | undefined>;
    data?: RecordValue[];
    search: WETableSearch;
    filters: WETableFilters;
    isLoading: boolean;
  };

export type WEWithOverLayRefs = WithDialogRef | WithDrawerRef;

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
