import { defineComponent, toRef } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { tableBoxDefaultProps, type WETableBoxProps } from "el-form-with";
import { useDark } from "@vueuse/core";

export interface TableBoxProps extends WETableBoxProps<any> {}

const CommonTableBox = defineComponent<TableBoxProps>(
  (props) => {
    const isDark = useDark();

    return () => {
      return (
        <div class="bg-bg_color px-4 pt-4">
          <ElTable
            header-cell-style={() => {
              return { background: isDark.value ? "#262727" : "#f5f7fa" };
            }}
            maxHeight={"calc(100vh - 360px)"}
            ref={toRef(props.reference)}
            data={props.data}
            v-loading={props.isLoading}
            onFilter-change={(params) => {
              props.search({ filters: params });
            }}
          >
            <ElTableColumn type="index" label="序号" width={60} />

            <ElTableColumn label="操作" width={160} fixed="right">
              {{
                default: () => <div></div>,
              }}
            </ElTableColumn>
          </ElTable>
        </div>
      );
    };
  },
  {
    props: [...tableBoxDefaultProps],
  }
);

export default CommonTableBox;
