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
  ElCard,
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
} from "./types";
import { getFormValueByFields } from "./utils";

type TableReset = () => Promise<void>;
type TableRefresh = () => Promise<void>;

export type TableWithOverlayRef = {
  search: WETableSearch;
  reset: TableReset;
  refresh: TableRefresh;
};

type TableWithOverlayProps<RecordValue extends object> = {
  table: (props: WETableBoxProps<RecordValue>) => VNode;
  selector: (props: WESelectorBoxProps) => VNode;
  onSearch?: WETableSearch;
  onReset?: TableReset;
  onRefresh?: TableRefresh;
};

const withTable = <
  RecordValue extends object,
  SelectorFormValue extends object = object
>(
  params: WEWithTableParams<SelectorFormValue, RecordValue>
) => {
  const { pageSize = 10, requester } = params ?? {};
  const DefaultPagination: WEPagination = {
    current: 1,
    pageSize: pageSize ?? 10,
    total: 0,
  };

  const TableWithOverlayRef = ref<TableWithOverlayRef>();
  const selectorRef = ref<FormInstance>();
  const tableRef = ref<TableInstance>();
  const tableDataRef = ref<RecordValue[]>();
  const pageinationRef = ref<WEPagination>(DefaultPagination);
  const loadings = ref<WELoadings>({
    search: false,
    reset: false,
    refresh: false,
  });
  const filtersRef = ref<WETableFilters>({});

  const isLoading = computed(() => {
    return Object.values(loadings.value).some((loading) => loading);
  });

  const request: WERequest = async (params) => {
    const { pagination = pageinationRef.value, filters = filtersRef.value } =
      params ?? {};

    const SelectorFormValue = getFormValueByFields<SelectorFormValue>(
      selectorRef.value?.fields
    );
    const res = await requester({
      data: SelectorFormValue,
      pagination,
      filters,
    });

    pageinationRef.value = {
      ...pagination,
      total: res?.total,
    };
    filtersRef.value = filters;
    tableDataRef.value = res?.list;
  };

  const TableWithOverlay = defineComponent<TableWithOverlayProps<RecordValue>>(
    (props, { expose, slots, attrs }) => {
      const { onSearch, onReset, onRefresh } = props;
      const { selector, table } = props;

      const search: WETableSearch = async (params) => {
        onSearch?.(params);
        const { filters } = params ?? {};
        loadings.value.search = true;
        await request({ pagination: DefaultPagination, filters });
        loadings.value.search = false;
      };

      const reset: TableReset = async () => {
        onReset?.();
        selectorRef.value?.resetFields();
        loadings.value.reset = true;
        await request({ pagination: DefaultPagination, filters: {} });
        loadings.value.reset = false;
      };

      const refresh: TableRefresh = async () => {
        onRefresh?.();
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
        const SelectorBox = selector({
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
          <div class="flex flex-col gap-2">
            <ElCard shadow="never">{SelectorBox}</ElCard>
            {slots["default"]?.()}
            <ElCard shadow={"never"}>
              {TableBox}
              <ElRow justify="end" class={"py-4"}>
                <ElPagination {...paginationParams} />
              </ElRow>
            </ElCard>
          </div>
        );
      };
    },
    {
      name: "TableWithOverlay",
      props: ["table", "selector"],
    }
  );

  return [TableWithOverlay, TableWithOverlayRef] as [
    typeof TableWithOverlay,
    typeof TableWithOverlayRef
  ];
};

export default withTable;
