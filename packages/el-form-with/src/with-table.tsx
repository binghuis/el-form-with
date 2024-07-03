import {
  computed,
  defineComponent,
  ref,
  toRaw,
  onBeforeMount,
  type Prop,
} from "vue";
import {
  type FormInstance,
  type TableInstance,
  ElPagination,
  ElRow,
  ElCard,
  ElSpace,
} from "element-plus";
import type {
  WEPagination,
  WEWithTableParams,
  WERequest,
  WETableSearch,
  WETableFilters,
  WEPlainObject,
  WELoadings,
  WETableSelectorContainerProps,
  WETableContainerProps,
} from "./types";
import { getFormValueByFields } from "./utils";

type TableReset = () => Promise<void>;
type TableRefresh = () => Promise<void>;

export type TableWithOverlayRef = {
  search: WETableSearch;
  reset: TableReset;
  refresh: TableRefresh;
};

type TableWithOverlayProps<RecordValue extends object = WEPlainObject> = {
  tableContainer: (props: WETableContainerProps<RecordValue>) => Element;
  selectorContainer: (props: WETableSelectorContainerProps) => Element;
};

const withTable = <
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
>(
  params?: WEWithTableParams<FormValue, RecordValue>
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

  const request: WERequest<RecordValue> = async (params) => {
    const { pagination = pageinationRef.value, filters = filtersRef.value } =
      params ?? {};

    const FormValue = getFormValueByFields<FormValue>(
      selectorRef.value?.fields
    );
    const res = await requester?.({
      data: FormValue,
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

  const search: WETableSearch = async (params) => {
    const { filters } = params ?? {};
    loadings.value.search = true;
    await request({ pagination: DefaultPagination, filters });
    loadings.value.search = false;
  };

  const reset: TableReset = async () => {
    selectorRef.value?.resetFields();
    loadings.value.reset = true;
    await request({ pagination: DefaultPagination, filters: {} });
    loadings.value.reset = false;
  };

  const refresh: TableRefresh = async () => {
    loadings.value.refresh = true;
    await request();
    loadings.value.refresh = false;
  };

  const TableWithOverlay = defineComponent<TableWithOverlayProps<RecordValue>>(
    (props, { expose, slots, attrs }) => {
      expose({ search, reset, refresh });

      onBeforeMount(() => {
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
        return (
          <ElSpace direction="vertical" fill>
            {props.selectorContainer && (
              <ElCard shadow={"never"}>
                {props.selectorContainer({
                  selector: selectorRef,
                  search,
                  reset,
                  refresh,
                  isLoading: isLoading.value,
                  loadings: loadings.value,
                })}
              </ElCard>
            )}
            {slots["default"]?.()}
            {props.tableContainer && (
              <ElCard shadow={"never"}>
                {props.tableContainer({
                  table: tableRef,
                  data: tableDataRef.value,
                  isLoading: isLoading.value,
                  loadings: loadings.value,
                  pagination: pageinationRef.value,
                  search,
                  reset,
                  refresh,
                  filters: toRaw(filtersRef.value),
                })}
                <ElRow justify="end" class={"py-4"}>
                  <ElPagination {...paginationParams} />
                </ElRow>
              </ElCard>
            )}
          </ElSpace>
        );
      };
    },
    {
      name: "TableWithOverlay",
      props: ["tableContainer", "selectorContainer"],
    }
  );

  return [TableWithOverlay, TableWithOverlayRef] as [
    typeof TableWithOverlay,
    typeof TableWithOverlayRef
  ];
};

export default withTable;
