import type {
  DialogProps,
  DrawerProps,
  ElPagination,
  FormInstance,
  TableInstance,
} from "element-plus";
import type { Ref, VNode } from "vue";

export { type WithDialogRefValue } from "./with-dialog";
export { type WithDrawerRefValue } from "./with-drawer";
export { type TableWithOverlayRef } from "./with-table";

export interface PlainObject {
  [key: string]: unknown;
}

export type FormMode = "view" | "copy" | "add" | "edit";

export type EmptyFunction = () => void | Promise<void>;

export type MaybeUndefined<T> = T | undefined;

export type TableFilters = Record<string, (string | number)[]>;

export type DialogWithFormProps<
  FormValue extends object,
  FormType extends string = string,
  OverlayOkType extends string = string
> = Partial<DialogProps> & {
  form: (props: FormBoxProps<FormValue, FormType, OverlayOkType>) => VNode;
};

export type DrawerWithFormProps<
  FormValue extends object,
  FormType extends string = string,
  OverlayOkType extends string = string
> = Partial<DrawerProps> & {
  form: (props: FormBoxProps<FormValue, FormType, OverlayOkType>) => VNode;
};

export type StepDialogWithFormsProps<
  FormsValue extends object[],
  FormsType extends string[] = [],
  OverlayOkType extends string = string
> = Partial<DialogProps> & {
  stepform: (
    props: StepFormBoxProps<FormsValue, FormsType, OverlayOkType>
  ) => VNode;
  onNext?: (step: number) =>
    | Promise<{
        data: FormsValue[number];
        type?: FormsType[number];
      }>
    | Promise<void>
    | void;
};

export type FormBoxOkHandle<OverlayOkType> = (params?: {
  type?: OverlayOkType;
}) => void;

export interface FormBoxProps<
  FormValue extends object,
  FormType extends string = string,
  OverlayOkType extends string = string
> {
  reference: Ref<MaybeUndefined<FormInstance>>;
  data?: FormValue;
  type?: FormType;
  mode: FormMode;
  loading: boolean;
  ok: FormBoxOkHandle<OverlayOkType>;
  close: EmptyFunction;
  extra?: object;
}

export interface StepFormBoxProps<
  FormsValue extends object[],
  FormsType extends string[] = [],
  OverlayOkType extends string = string
> {
  mode: FormMode;
  loading: boolean;
  ok: FormBoxOkHandle<OverlayOkType>;
  close: EmptyFunction;
  prev: EmptyFunction;
  hasPrev: boolean;
  next: EmptyFunction;
  hasNext: boolean;
  step: number;
  forms?: FormBoxProps<FormsValue[number], FormsType[number], OverlayOkType>[];
}

export interface StepOpenOverlayParamsForms<
  FormsValue extends object[],
  FormsType extends string[]
> {
  data?: FormsValue[number];
  type?: FormsType[number];
}

export interface StepOpenOverlayParams<
  FormsValue extends object[],
  FormsType extends string[]
> {
  title?: string;
  mode?: FormMode;
  step?: number;
  forms?: StepOpenOverlayParamsForms<FormsValue, FormsType>[];
}

export interface StepWithOverlaysParams<
  FormsValue extends object[],
  FormsType extends string[],
  OverlayOkType extends string
> {
  beforeClose?: (done: EmptyFunction) => Promise<void>;
  afterClose?: EmptyFunction;
  steps: number;
  submit: (
    params: {
      mode: FormMode;
      data?: MaybeUndefined<FormsValue[number]>[];
      types?: MaybeUndefined<FormsType[number]>[];
      step: number;
      overlayOkType?: OverlayOkType;
      id?: string;
      extra?: object;
    },
    done: EmptyFunction
  ) => Promise<void>;
}

export interface OpenOverlayParams<FormValue, FormType> {
  title?: string;
  mode?: FormMode;
  data?: FormValue;
  type?: FormType;
  id?: string;
  extra?: object;
}

export interface WithOverlaysParams<
  FormValue extends object,
  FormType extends string,
  OverlayOkType extends string
> {
  beforeClose?: (done: EmptyFunction) => Promise<void>;
  afterClose?: EmptyFunction;
  submit: (
    params: {
      mode: FormMode;
      data?: FormValue;
      overlayOkType?: OverlayOkType;
      formType?: FormType;
      id?: string;
      extra?: object;
    },
    done: EmptyFunction
  ) => Promise<void>;
}

export interface WithTableParams<RecordValue, SelectorValue> {
  pageSize?: number;
  requester: Requester<RecordValue, SelectorValue>;
}

export interface Loadings {
  search: boolean;
  reset: boolean;
  refresh: boolean;
}

export interface SelectorBoxProps {
  reference: Ref<MaybeUndefined<FormInstance>>;
  search: EmptyFunction;
  reset: EmptyFunction;
  refresh: EmptyFunction;
  isLoading: boolean;
  loadings: Loadings;
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

export interface TableBoxProps<RecordValue extends object> {
  reference: Ref<MaybeUndefined<TableInstance>>;
  data?: RecordValue[];
  reset: TableReset;
  refresh: TableRefresh;
  search: TableSearch;
  filter: TableFilter;
  sort: TableSort;
  isLoading: boolean;
  loadings: Loadings;
  paginationPropsInj?: PaginationPropsInj;
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface Requester<RecordValue, SelectorValue> {
  (params: RequesterParams<SelectorValue>): Promise<
    RequesterResponse<RecordValue>
  >;
}

export interface RequestParams<SelectorValue> {
  pagination?: Pagination;
  filters?: TableFilters;
  sorts?: TableSorts;
  data?: SelectorValue;
  extra?: object;
}

export type Request<SelectorValue> = (
  params?: RequestParams<SelectorValue>
) => void;

export interface RequesterParams<SelectorValue> {
  data?: SelectorValue;
  pagination: Pagination;
  filters?: TableFilters;
  sorts?: TableSorts;
  extra?: object;
}

export interface RequesterResponse<Item> {
  total: number;
  list: Item[];
}

export type TableSearch = (params?: { extra?: object }) => Promise<void>;

export type TableSort = (params: {
  prop: string;
  order: string;
}) => Promise<void>;

export type TableSorts = Record<string, string>;

export type TableFilter = (params?: TableFilters) => Promise<void>;

export type TableReset = () => Promise<void>;

export type TableRefresh = () => Promise<void>;

export type TableOnHandle<SelectorValue> = (params: {
  data?: SelectorValue;
}) => Promise<void> | void;

export type TableOnSearch<SelectorValue> = TableOnHandle<SelectorValue>;

export type TableOnReset<SelectorValue> = TableOnHandle<SelectorValue>;

export type TableOnRefresh<SelectorValue> = TableOnHandle<SelectorValue>;

export type TableOnFilter = (params: {
  filters?: TableFilters;
}) => Promise<void>;

export type TableOnSort = (params: { sorts?: TableSorts }) => Promise<void>;
