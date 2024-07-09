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

export type TableWithOverlayRef<SelectorFormValue> = {
  search: WETableSearch<SelectorFormValue>;
  reset: WETableReset;
  refresh: WETableRefresh;
};

type TableWithOverlayProps<
  RecordValue extends object,
  SelectorFormValue extends object
> = {
  table: (props: WETableBoxProps<RecordValue, SelectorFormValue>) => VNode;
  selector?: (props: WESelectorBoxProps) => VNode;
  onSearch?: WETableOnSearch<SelectorFormValue>;
  onReset?: WETableOnReset<SelectorFormValue>;
  onRefresh?: WETableOnRefresh<SelectorFormValue>;
};

const withTable = <
  RecordValue extends object,
  SelectorFormValue extends object = object
>(
  params: WEWithTableParams<RecordValue, SelectorFormValue>
) => {
  const { pageSize = 10, requester } = params ?? {};
  const DefaultPagination: WEPagination = {
    current: 1,
    pageSize: pageSize ?? 10,
    total: 0,
  };

  const TableWithOverlayRef = ref<TableWithOverlayRef<SelectorFormValue>>();
  const selectorRef = ref<FormInstance>();
  const selectorFormValue = ref<MaybeNull<SelectorFormValue>>();
  const tableRef = ref<TableInstance>();
  const tableDataRef = ref<RecordValue[]>();
  const pageinationRef = ref<WEPagination>(DefaultPagination);
  const loadings = ref<WELoadings>({
    search: false,
    reset: false,
    refresh: false,
  });
  const filtersRef = ref<MaybeNull<WETableFilters>>({});

  const isLoading = computed(() => {
    return Object.values(loadings.value).some((loading) => loading);
  });

  const getFormValue = () =>
    getFormValueByFields<SelectorFormValue>(selectorRef.value?.fields);

  const request: WERequest<SelectorFormValue> = async (params) => {
    const {
      pagination = pageinationRef.value,
      filters = filtersRef.value,
      data = selectorFormValue.value,
    } = params ?? {};

    const res = await requester({
      data,
      pagination,
      filters,
    });
    selectorFormValue.value = data;
    pageinationRef.value = {
      ...pagination,
      total: res.total,
    };
    tableDataRef.value = res.list;
    filtersRef.value = filters;
  };

  const TableWithOverlay = defineComponent<
    TableWithOverlayProps<RecordValue, SelectorFormValue>
  >(
    (props, { expose, slots, attrs }) => {
      const { onSearch, onReset, onRefresh } = props;
      const { selector, table } = props;

      const search: WETableSearch<SelectorFormValue> = async (params) => {
        const { filters, data = getFormValue() } = params ?? {};
        onSearch?.({
          data,
        });
        loadings.value.search = true;
        await request({ data, pagination: DefaultPagination, filters });
        loadings.value.search = false;
      };

      const reset: WETableReset = async () => {
        selectorRef.value?.resetFields();
        const data = getFormValue();
        onReset?.({
          data,
        });
        loadings.value.reset = true;
        await request({ data, pagination: DefaultPagination, filters: {} });
        loadings.value.reset = false;
      };

      const refresh: WETableRefresh = async () => {
        onRefresh?.({
          data: toRaw(selectorFormValue.value),
        });
        loadings.value.refresh = true;
        await request();
        loadings.value.refresh = false;
      };
      expose({ search, reset, refresh });

      onMounted(() => {
        search();
      });

      return () => {
        const paginationParams = {
          layout: "total, sizes, prev, pager, next, jumper",
          pagination: pageinationRef.value,
          isLoading: isLoading.value,
          disabled: isLoading.value,
          total: pageinationRef.value.total,
          currentPage: pageinationRef.value.current,
          pageSize: pageinationRef.value.pageSize,
          "onUpdate:current-page": async (current: number) => {
            loadings.value.search = true;
            await request({
              pagination: { ...DefaultPagination, current },
            });
            loadings.value.search = false;
          },
          "onUpdate:page-size": async (pageSize: number) => {
            loadings.value.search = true;
            await request({
              pagination: { ...DefaultPagination, pageSize },
            });
            loadings.value.search = false;
          },
        };
        const SelectorBox = selector?.({
          reference: selectorRef,
          search,
          reset,
          refresh,
          isLoading: isLoading.value,
          loadings: loadings.value,
        });
        const TableBox = table({
          reference: tableRef,
          data: tableDataRef.value,
          reset,
          refresh,
          search,
          filters: toRaw(filtersRef.value),
          isLoading: isLoading.value,
          loadings: loadings.value,
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
