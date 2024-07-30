import { defineComponent, toRef } from "vue";
import { ElLink, ElRow, ElTable, ElTableColumn } from "element-plus";
import { tableBoxDefaultProps, type WETableBoxProps } from "el-form-with";
import { useDark } from "@vueuse/core";
import type { LeaveApplicationDetail } from "../../api/leave-application.type";

export interface TableBoxProps
  extends WETableBoxProps<LeaveApplicationDetail> {}

const CommonTableBox = defineComponent<TableBoxProps>(
  (props) => {
    const isDark = useDark();

    return () => {
      return (
        <div class="p-2 pb-0 bg-white dark:bg-[#141414]">
          <ElTable
            header-cell-style={() => {
              return { background: isDark.value ? "#262727" : "#f8fafc" };
            }}
            maxHeight={"calc(100vh - 360px)"}
            ref={toRef(props.reference)}
            data={props.data}
            v-loading={props.isLoading}
            onFilter-change={(params) => {
              props.search({ filters: params });
            }}
          >
            <ElTableColumn type="index" label="Index" width={80} />
            <ElTableColumn prop="id" label="Id" />
            <ElTableColumn prop="employeeName" label="Name" />
            <ElTableColumn prop="startDate" label="startDate" />
            <ElTableColumn prop="endDate" label="endDate" />
            <ElTableColumn prop="type" label="type" />
            <ElTableColumn prop="status" label="status" />
            <ElTableColumn prop="reason" label="reason" width={180} />

            <ElTableColumn label="操作" width={160} fixed="right">
              {{
                default: () => (
                  <ElRow justify="start" gutter={8}>
                    <ElLink type="primary" underline={false}>
                      Edit
                    </ElLink>
                    <ElLink type="primary" underline={false}>
                      View
                    </ElLink>
                  </ElRow>
                ),
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
