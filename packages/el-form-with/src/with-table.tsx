import { computed, defineComponent, ref, type VNode } from "vue";
import {
  type FormInstance,
  type PaginationProps,
  type TableInstance,
  ElPagination,
} from "element-plus";
import type {
  Pagination,
  WithTableParams,
  Request,
  TableSearch,
  TableFilters,
  Loadings,
  SelectorBoxProps,
  TableBoxProps,
  TableReset,
  TableRefresh,
  TableOnSearch,
  TableOnReset,
  TableOnRefresh,
  PaginationPropsInj,
  TableFilter,
  TableOnFilter,
  TableSort,
  TableOnSort,
} from "./types";
import { getFormValueByFields, raw } from "./utils";

export type TableWithOverlayRef = {
  search: TableSearch;
  reset: TableReset;
  refresh: TableRefresh;
};

type PaginationOpts = Partial<
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
  table: (props: TableBoxProps<RecordValue>) => VNode;
  selector?: (props: SelectorBoxProps) => VNode;
  onSearch?: TableOnSearch<SelectorValue>;
  onSort?: TableOnSort;
  onReset?: TableOnReset<SelectorValue>;
  onRefresh?: TableOnRefresh<SelectorValue>;
  onFilter?: TableOnFilter;
  hidePagination?: boolean;
  paginationOpts?: PaginationOpts;
};

const withTable = <
  RecordValue extends object,
  SelectorValue extends object = object
>(
  params: WithTableParams<RecordValue, SelectorValue>
) => {
  const { pageSize = 10, requester } = params ?? {};
  const DefaultPagination: Pagination = {
    current: 1,
    pageSize: pageSize ?? 10,
    total: 0,
  };

  const TableWithOverlayRef = ref<TableWithOverlayRef>();
  const selectorRef = ref<FormInstance>();
  const selectorValueRef = ref<SelectorValue>();
  const extraValueRef = ref<object>();
  const tableRef = ref<TableInstance>();
  const tableValueRef = ref<RecordValue[]>();
  const pageinationRef = ref<Pagination>(DefaultPagination);
  const loadingsRef = ref<Loadings>({
    search: false,
    reset: false,
    refresh: false,
  });
  const filtersRef = ref<TableFilters>({});
  const sortsRef = ref<Record<string, string>>({});

  const isLoadingRef = computed(() => {
    return Object.values(loadingsRef.value).some((loading) => loading);
  });

  const getFormValue = () =>
    getFormValueByFields<SelectorValue>(selectorRef.value?.fields);

  const request: Request<SelectorValue> = async (params) => {
    const {
      pagination = pageinationRef.value,
      filters = filtersRef.value,
      data = selectorValueRef.value,
      extra = extraValueRef.value,
      sorts = sortsRef.value,
    } = params ?? {};

    const res = await requester({
      data: raw(data),
      pagination: raw(pagination),
      filters: raw(filters),
      extra: raw(extra),
      sorts: raw(sorts),
    });
    selectorValueRef.value = data;
    pageinationRef.value = {
      ...pagination,
      total: res.total,
    };
    tableValueRef.value = res.list;
    extraValueRef.value = extra;
    filtersRef.value = filters;
    sortsRef.value = sorts;
  };

  const TableWithOverlay = defineComponent<
    TableWithOverlayProps<RecordValue, SelectorValue>
  >(
    (props, { expose, slots, attrs }) => {
      const {
        onSearch,
        onSort,
        onReset,
        onRefresh,
        onFilter,
        selector,
        table,
        hidePagination = false,
        paginationOpts = {},
      } = props;
      const { ...restPaginationOpts } = paginationOpts;

      const search: TableSearch = async (params) => {
        const { extra } = params ?? {};
        const data = getFormValue();
        onSearch?.({
          data: raw(data),
        });
        loadingsRef.value.search = true;
        await request({ data, pagination: DefaultPagination, extra });
        loadingsRef.value.search = false;
      };

      const filter: TableFilter = async (params) => {
        filtersRef.value = { ...filtersRef.value, ...params };
        const data = getFormValue();
        onFilter?.({
          filters: raw(filtersRef.value),
        });
        loadingsRef.value.search = true;
        await request({ data, pagination: DefaultPagination });
        loadingsRef.value.search = false;
      };

      const sort: TableSort = async (params) => {
        const data = getFormValue();
        sortsRef.value = {
          [params.prop]: params.order,
        };
        onSort?.({
          sorts: raw(sortsRef.value),
        });
        loadingsRef.value.search = true;
        await request({ data, pagination: DefaultPagination });
        loadingsRef.value.search = false;
      };

      const reset: TableReset = async () => {
        extraValueRef.value = undefined;
        selectorRef.value?.resetFields();
        const data = getFormValue();
        onReset?.({
          data: raw(data),
        });
        loadingsRef.value.reset = true;
        await request({
          data,
          pagination: DefaultPagination,
          filters: {},
          sorts: {},
        });
        loadingsRef.value.reset = false;
      };

      const refresh: TableRefresh = async () => {
        onRefresh?.({
          data: raw(selectorValueRef.value),
        });
        loadingsRef.value.refresh = true;
        await request();
        loadingsRef.value.refresh = false;
      };

      expose({ search, reset, refresh });

      search();

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
          data: raw(tableValueRef.value),
          reset,
          refresh,
          search,
          filter,
          sort,
          isLoading: isLoadingRef.value,
          loadings: loadingsRef.value,
          paginationPropsInj,
        });
        return (
          <div class={"we-table-container"}>
            {selector && <div class={"we-selector"}>{SelectorBox}</div>}
            <div class="we-table-header">{slots["default"]?.()}</div>
            <div class="we-table">{TableBox}</div>
            {!hidePagination && (
              <div class={`we-pagination`}>
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
        "onFilter",
        "onSort",
      ],
    }
  );

  return [TableWithOverlay, TableWithOverlayRef] as [
    typeof TableWithOverlay,
    typeof TableWithOverlayRef
  ];
};

export default withTable;
