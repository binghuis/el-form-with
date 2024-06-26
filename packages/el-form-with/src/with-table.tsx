import { computed, defineComponent, onMounted, ref, toRaw } from "vue";
import {
  type FormInstance,
  ElPagination,
  type PaginationProps,
  TableInstance,
} from "element-plus";
import type {
  Pagination,
  TableContainer,
  TableSelectorContainer,
  WithTableParams,
  Request,
  TableSearcher,
  TableFilters,
  PlainObject,
  Loadings,
} from "./types";
import { getFormDataByFields } from "./utils";

const withTable = <FormData extends object, RecordData extends object>(
  params?: WithTableParams<FormData, RecordData>
) => {
  const { pageSize = 10, requester } = params ?? {};
  const DefaultPagination: Pagination = {
    current: 1,
    pageSize: pageSize ?? 10,
    total: 0,
  };
  return function <Extra extends PlainObject>(
    SelectorArea: TableSelectorContainer,
    TableArea: TableContainer<RecordData, Extra>,
    exrea?: Extra
  ) {
    const selectorRef = ref<FormInstance>();
    const tableRef = ref<TableInstance>();
    const tableDataRef = ref<RecordData[]>();
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

    const request: Request<RecordData> = async (params) => {
      const { pagination = pageinationRef.value, filters = filtersRef.value } =
        params ?? {};

      const formData = getFormDataByFields<FormData>(selectorRef.value?.fields);
      const res = await requester?.({
        query: formData,
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

    const search: TableSearcher = async (params) => {
      const { filters } = params ?? {};
      loadings.value.search = true;
      await request({ pagination: DefaultPagination, filters });
      loadings.value.search = false;
    };

    const reset = async () => {
      selectorRef.value?.resetFields();
      loadings.value.reset = true;
      await request({ pagination: DefaultPagination, filters: {} });
      loadings.value.reset = false;
    };
    const refresh = async () => {
      loadings.value.refresh = true;
      await request();
      loadings.value.refresh = false;
    };

    return defineComponent<Partial<PaginationProps>>({
      props: ElPagination["props"],
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
              <ElPagination
                {...props}
                disabled={isLoading.value}
                total={pageinationRef.value.total}
                currentPage={pageinationRef.value.current}
                pageSize={pageinationRef.value.pageSize}
                onUpdate:current-page={(current: number) => {
                  request({ pagination: { ...DefaultPagination, current } });
                }}
                onUpdate:page-size={(pageSize: number) => {
                  request({ pagination: { ...DefaultPagination, pageSize } });
                }}
              />
            </div>
          );
        };
      },
    });
  };
};

export default withTable;
