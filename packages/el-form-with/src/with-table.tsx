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
  type TableInstance,
  ElPagination,
  ElRow,
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
} from "./types";
import { getFormValueByFields } from "./utils";

export type TableWithOverlayRef<SelectorValue> = {
  search: WETableSearch<SelectorValue>;
  reset: WETableReset;
  refresh: WETableRefresh;
};

type TableWithOverlayProps<
  RecordValue extends object,
  SelectorValue extends object
> = {
  table: (props: WETableBoxProps<RecordValue, SelectorValue>) => VNode;
  selector?: (props: WESelectorBoxProps) => VNode;
  onSearch?: WETableOnSearch<SelectorValue>;
  onReset?: WETableOnReset<SelectorValue>;
  onRefresh?: WETableOnRefresh<SelectorValue>;
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

  const TableWithOverlayRef = ref<TableWithOverlayRef<SelectorValue>>();
  const selectorRef = ref<FormInstance>();
  const selectorValueRef = ref<MaybeNull<SelectorValue>>();
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
    } = params ?? {};

    const res = await requester({
      data,
      pagination,
      filters,
    });
    selectorValueRef.value = data;
    pageinationRef.value = {
      ...pagination,
      total: res.total,
    };
    tableValueRef.value = res.list;
    filtersRef.value = filters;
  };

  const TableWithOverlay = defineComponent<
    TableWithOverlayProps<RecordValue, SelectorValue>
  >(
    (props, { expose, slots, attrs }) => {
      const { onSearch, onReset, onRefresh } = props;
      const { selector, table } = props;

      const search: WETableSearch<SelectorValue> = async (params) => {
        const { filters, data = getFormValue() } = params ?? {};
        onSearch?.({
          data,
        });
        loadingsRef.value.search = true;
        await request({ data, pagination: DefaultPagination, filters });
        loadingsRef.value.search = false;
      };

      const reset: WETableReset = async () => {
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
        const paginationParams = {
          layout: "total, sizes, prev, pager, next, jumper",
          pagination: pageinationRef.value,
          isLoading: isLoadingRef.value,
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
          pagination: pageinationRef.value,
        });
        return (
          <div class="flex flex-col">
            {selector && <div>{SelectorBox}</div>}
            {TableBox}
            <ElRow justify="end" class={"py-4"}>
              <ElPagination {...paginationParams} />
            </ElRow>
          </div>
        );
      };
    },
    {
      name: "TableWithOverlay",
      props: ["table", "selector", "onRefresh", "onReset", "onSearch"],
    }
  );

  return [TableWithOverlay, TableWithOverlayRef] as [
    typeof TableWithOverlay,
    typeof TableWithOverlayRef
  ];
};

export default withTable;
