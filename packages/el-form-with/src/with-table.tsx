import {
  computed,
  defineComponent,
  ref,
  toRaw,
  type VNode,
  onMounted,
} from "vue";
import {
  type FormInstance,
  type PaginationProps,
  type TableInstance,
  ElPagination,
} from "element-plus";
import type {
  WEPagination,
  WEWithTableParams,
  WERequest,
  WETableSearch,
  WETableFilters,
  WELoadings,
  WESelectorBoxProps,
  WETableBoxProps,
  WETableReset,
  WETableRefresh,
  WETableOnSearch,
  WETableOnReset,
  WETableOnRefresh,
  MaybeNull,
  PaginationPropsInj,
} from "./types";
import { getFormValueByFields } from "./utils";

export type TableWithOverlayRef = {
  search: WETableSearch;
  reset: WETableReset;
  refresh: WETableRefresh;
};

type PaginationOpts = { boxClass?: string } & Partial<
  Pick<
    PaginationProps,
    | "size"
    | "background"
    | "pagerCount"
    | "layout"
    | "pageSizes"
    | "popperClass"
    | "prevText"
    | "prevIcon"
    | "nextText"
    | "nextIcon"
    | "teleported"
    | "hideOnSinglePage"
  >
>;

type TableWithOverlayProps<
  RecordValue extends object,
  SelectorValue extends object
> = {
  table: (props: WETableBoxProps<RecordValue>) => VNode;
  selector?: (props: WESelectorBoxProps) => VNode;
  onSearch?: WETableOnSearch<SelectorValue>;
  onReset?: WETableOnReset<SelectorValue>;
  onRefresh?: WETableOnRefresh<SelectorValue>;
  hidePagination?: boolean;
  paginationOpts?: PaginationOpts;
};

const withTable = <
  RecordValue extends object,
  SelectorValue extends object = object
>(
  params: WEWithTableParams<RecordValue, SelectorValue>
) => {
  const { pageSize = 10, requester } = params ?? {};
  const DefaultPagination: WEPagination = {
    current: 1,
    pageSize: pageSize ?? 10,
    total: 0,
  };

  const TableWithOverlayRef = ref<TableWithOverlayRef>();
  const selectorRef = ref<FormInstance>();
  const selectorValueRef = ref<MaybeNull<SelectorValue>>();
  const extraValueRef = ref<MaybeNull<object>>();
  const tableRef = ref<TableInstance>();
  const tableValueRef = ref<RecordValue[]>();
  const pageinationRef = ref<WEPagination>(DefaultPagination);
  const loadingsRef = ref<WELoadings>({
    search: false,
    reset: false,
    refresh: false,
  });
  const filtersRef = ref<MaybeNull<WETableFilters>>({});

  const isLoadingRef = computed(() => {
    return Object.values(loadingsRef.value).some((loading) => loading);
  });

  const getFormValue = () =>
    getFormValueByFields<SelectorValue>(selectorRef.value?.fields);

  const request: WERequest<SelectorValue> = async (params) => {
    const {
      pagination = pageinationRef.value,
      filters = filtersRef.value,
      data = selectorValueRef.value,
      extra = extraValueRef.value,
    } = params ?? {};

    const res = await requester({
      data,
      pagination,
      filters,
      extra,
    });
    selectorValueRef.value = data;
    pageinationRef.value = {
      ...pagination,
      total: res.total,
    };
    tableValueRef.value = res.list;
    extraValueRef.value = extra;
    filtersRef.value = filters;
  };

  const TableWithOverlay = defineComponent<
    TableWithOverlayProps<RecordValue, SelectorValue>
  >(
    (props, { expose, slots, attrs }) => {
      const {
        onSearch,
        onReset,
        onRefresh,
        selector,
        table,
        hidePagination = false,
        paginationOpts = {},
      } = props;
      const { boxClass, ...restPaginationOpts } = paginationOpts;

      const search: WETableSearch = async (params) => {
        const { filters, extra } = params ?? {};
        const data = getFormValue();
        onSearch?.({
          data,
        });
        loadingsRef.value.search = true;
        await request({ data, pagination: DefaultPagination, filters, extra });
        loadingsRef.value.search = false;
      };

      const reset: WETableReset = async () => {
        extraValueRef.value = null;
        selectorRef.value?.resetFields();
        const data = getFormValue();
        onReset?.({
          data,
        });
        loadingsRef.value.reset = true;
        await request({ data, pagination: DefaultPagination, filters: {} });
        loadingsRef.value.reset = false;
      };

      const refresh: WETableRefresh = async () => {
        onRefresh?.({
          data: toRaw(selectorValueRef.value),
        });
        loadingsRef.value.refresh = true;
        await request();
        loadingsRef.value.refresh = false;
      };

      expose({ search, reset, refresh });

      onMounted(() => {
        search();
      });

      return () => {
        const paginationPropsInj: PaginationPropsInj = {
          layout: "total, sizes, prev, pager, next, jumper",
          disabled: isLoadingRef.value,
          total: pageinationRef.value.total,
          currentPage: pageinationRef.value.current,
          pageSize: pageinationRef.value.pageSize,
          "onUpdate:current-page": async (current: number) => {
            loadingsRef.value.search = true;
            await request({
              pagination: { ...DefaultPagination, current },
            });
            loadingsRef.value.search = false;
          },
          "onUpdate:page-size": async (pageSize: number) => {
            loadingsRef.value.search = true;
            await request({
              pagination: { ...DefaultPagination, pageSize },
            });
            loadingsRef.value.search = false;
          },
        };
        const SelectorBox = selector?.({
          reference: selectorRef,
          search,
          reset,
          refresh,
          isLoading: isLoadingRef.value,
          loadings: loadingsRef.value,
        });
        const TableBox = table({
          reference: tableRef,
          data: tableValueRef.value,
          reset,
          refresh,
          search,
          filters: toRaw(filtersRef.value),
          isLoading: isLoadingRef.value,
          loadings: loadingsRef.value,
          paginationPropsInj,
        });
        return (
          <div class="flex flex-col items-stretch h-full">
            {selector && <div>{SelectorBox}</div>}
            <div class="flex-1">{TableBox}</div>
            {!hidePagination && (
              <div class={`flex justify-end p-4 ${paginationOpts.boxClass}`}>
                <ElPagination {...paginationPropsInj} {...restPaginationOpts} />
              </div>
            )}
          </div>
        );
      };
    },
    {
      name: "TableWithOverlay",
      props: [
        "table",
        "selector",
        "onRefresh",
        "onReset",
        "onSearch",
        "paginationOpts",
        "hidePagination",
      ],
    }
  );

  return [TableWithOverlay, TableWithOverlayRef] as [
    typeof TableWithOverlay,
    typeof TableWithOverlayRef
  ];
};

export default withTable;
