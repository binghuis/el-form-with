import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRaw,
  type PropType,
} from "vue";
import {
  type FormInstance,
  ElPagination,
  TableInstance,
  ElRow,
  ElDivider,
  type PaginationProps,
} from "element-plus";
import type {
  Pagination,
  TableContainer,
  TableSelectorContainer,
  WithTableParams,
  Request,
  TableSearch,
  TableFilters,
  PlainObject,
  Loadings,
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
  return function <Extra extends object = PlainObject>(
    SelectorArea: TableSelectorContainer,
    TableArea: TableContainer<RecordValue, Extra>,
    exrea?: Extra
  ) {
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
        paginationOpts: {
          type: Object as PropType<Partial<PaginationProps>>,
          required: false,
        },
      },
      // props: ElPagination["props"],
      setup(props, { expose, attrs }) {
        expose({ search, reset, refresh });

        onMounted(() => {
          search();
        });

        return () => {
          return (
            <div>
              <SelectorArea
                form={selectorRef}
                search={search}
                reset={reset}
                refresh={refresh}
                isLoading={isLoading.value}
                loadings={loadings.value}
              />
              <TableArea
                extra={exrea}
                table={tableRef}
                data={tableDataRef.value}
                search={search}
                filters={toRaw(filtersRef.value)}
                isLoading={isLoading.value}
              />
              <div>
                <ElDivider />
                <ElRow justify="end">
                  <ElPagination
                    {...props.paginationOpts}
                    layout={
                      props.paginationOpts?.layout ??
                      "total, sizes, prev, pager, next, jumper"
                    }
                    disabled={isLoading.value}
                    total={pageinationRef.value.total}
                    currentPage={pageinationRef.value.current}
                    pageSize={pageinationRef.value.pageSize}
                    onUpdate:current-page={(current: number) => {
                      request({
                        pagination: { ...DefaultPagination, current },
                      });
                    }}
                    onUpdate:page-size={(pageSize: number) => {
                      request({
                        pagination: { ...DefaultPagination, pageSize },
                      });
                    }}
                  />
                </ElRow>
              </div>
            </div>
          );
        };
      },
    });
  };
};

export default withTable;
