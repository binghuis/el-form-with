import { defineComponent, ref } from "vue";
import {
  type FormInstance,
  ElPagination,
  type PaginationProps,
  type ElTable,
  TableInstance,
} from "element-plus";
import type {
  Pagination,
  TableContainer,
  TableSelector,
  WithTableParams,
  Request,
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
  return (Selector: TableSelector, Table: TableContainer<RecordData>) => {
    return defineComponent<Partial<PaginationProps>>({
      props: ElPagination["props"],
      setup(props, { expose, attrs }) {
        const selectorRef = ref<FormInstance>();
        const tableRef = ref<TableInstance>();
        const tableDataRef = ref<RecordData[]>();
        const pageinationRef = ref<Pagination>(DefaultPagination);
        const loading = ref<boolean>(false);

        const request: Request<FormData, RecordData> = async (params) => {
          const { pagination = pageinationRef.value } = params ?? {};
          const formData = getFormDataByFields<FormData>(
            selectorRef.value?.fields
          );
          loading.value = true;
          const res = await requester?.({
            query: { ...formData, ...pagination },
          });
          pageinationRef.value = {
            ...pagination,
            total: res?.total,
          };
          tableDataRef.value = res?.list;
          loading.value = false;
        };

        const search = async () => {
          request({ pagination: DefaultPagination });
        };

        const reset = async () => {
          selectorRef.value?.resetFields();
          search();
        };

        const refresh = request;

        expose({ search, reset, refresh });

        return () => {
          return (
            <div>
              <Selector
                form={selectorRef}
                search={search}
                reset={reset}
                refresh={refresh}
              />
              <Table table={tableRef} data={tableDataRef.value} />
              <ElPagination
                {...props}
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
