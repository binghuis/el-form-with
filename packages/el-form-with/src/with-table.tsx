import {
  computed,
  defineComponent,
  ref,
  toRaw,
  onBeforeMount,
  type Ref,
} from "vue";
import { type FormInstance, TableInstance } from "element-plus";
import type {
  Pagination,
  WithTableParams,
  Request,
  TableSearch,
  TableFilters,
  PlainObject,
  Loadings,
  WithOverLayRefs,
} from "./types";
import { getFormValueByFields } from "./utils";

type TableReset = () => Promise<void>;
type TableRefresh = () => Promise<void>;

export type WithTableRef = {
  search: TableSearch;
  reset: TableReset;
  refresh: TableRefresh;
};

const withTable = <
  FormValue extends object = PlainObject,
  RecordValue extends object = PlainObject
>(
  params?: WithTableParams<FormValue, RecordValue>
) => {
  const { pageSize = 10, requester } = params ?? {};
  const DefaultPagination: Pagination = {
    current: 1,
    pageSize: pageSize ?? 10,
    total: 0,
  };

  const selectorRef = ref<FormInstance>();
  const tableRef = ref<TableInstance>();
  const tableDataRef = ref<RecordValue[]>();
  const pageinationRef = ref<Pagination>(DefaultPagination);
  const loadings = ref<Loadings>({
    search: false,
    reset: false,
    refresh: false,
  });
  const filtersRef = ref<TableFilters>({});

  const isLoading = computed(() => {
    return Object.values(loadings.value).some((loading) => loading);
  });

  const request: Request<RecordValue> = async (params) => {
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

  const search: TableSearch = async (params) => {
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

  return defineComponent({
    name: "TableWithOverlay",
    props: {
      forms: {
        type: Object as () => Record<string, Ref<WithOverLayRefs>>,
        required: false,
      },
    },
    setup(props, { expose, slots }) {
      expose({ search, reset, refresh });

      onBeforeMount(() => {
        search();
      });

      return () => {
        return (
          <div>
            {slots["default"]?.()}
            {slots["selector"]?.({
              selector: selectorRef,
              search,
              reset,
              refresh,
              isLoading: isLoading.value,
              loadings: loadings.value,
            })}
            {slots["table"]?.({
              table: tableRef,
              forms: props.forms,
              data: tableDataRef.value,
              isLoading: isLoading.value,
              loadings: loadings.value,
              pagination: pageinationRef.value,
              search,
              reset,
              refresh,
              filters: toRaw(filtersRef.value),
            })}
            {slots["pagination"]?.({
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
            })}
          </div>
        );
      };
    },
  });
};

export default withTable;
