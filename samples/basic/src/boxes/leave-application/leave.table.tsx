import { defineComponent } from "vue";
import { dayjs, ElLink, ElSpace, ElTable, ElTableColumn } from "element-plus";
import { tableBoxDefaultProps, type TableBoxProps } from "el-form-with";
import { useDark } from "@vueuse/core";
import {
  LeaveApplicationStatus,
  LeaveApplicationType,
  type LeaveApplicationDetail,
} from "../../api/leave-application.type";
import {
  LeaveApplicationFormDialogRef,
  type LeaveApplicationFormDrawerRef,
} from "../../views/leave-application";
import { leaveApplicationDetail2LeaveApplicationFormValue } from "./leave.form.helpers";
import { Edit, View } from "@element-plus/icons-vue";
export interface TableBoxProps extends TableBoxProps<LeaveApplicationDetail> {
  LeaveApplicationFormDialogRef: typeof LeaveApplicationFormDialogRef;
  LeaveApplicationFormDrawerRef: typeof LeaveApplicationFormDrawerRef;
  overlay: string;
}

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
            ref={props.reference}
            data={props.data}
            v-loading={props.isLoading}
            onFilter-change={props.filter}
            onSort-change={props.sort}
          >
            <ElTableColumn type="index" label="Index" width={70} />
            <ElTableColumn prop="id" label="Id" width={70} />
            <ElTableColumn prop="employeeName" label="Name" />
            <ElTableColumn
              prop="startDate"
              label="startDate"
              sortable
              width={160}
              formatter={(row) => {
                return dayjs(row.startDate).format("YYYY-MM-DD HH:mm");
              }}
            />
            <ElTableColumn
              prop="endDate"
              label="endDate"
              sortable
              width={160}
              formatter={(row) => {
                return dayjs(row.endDate).format("YYYY-MM-DD HH:mm");
              }}
            />
            <ElTableColumn
              prop="type"
              label="type"
              columnKey="type"
              filters={Object.keys(LeaveApplicationType).map((key) => {
                return {
                  text: LeaveApplicationType[
                    key as keyof typeof LeaveApplicationType
                  ],
                  value: key.toLocaleLowerCase(),
                };
              })}
              formatter={(row: LeaveApplicationDetail) => {
                return LeaveApplicationType[
                  row.type.toLocaleUpperCase() as keyof typeof LeaveApplicationType
                ];
              }}
            />
            <ElTableColumn
              prop="status"
              label="status"
              columnKey="status"
              filters={Object.keys(LeaveApplicationStatus).map((key) => {
                return {
                  text: LeaveApplicationStatus[
                    key as keyof typeof LeaveApplicationStatus
                  ],
                  value: key.toLocaleLowerCase(),
                };
              })}
              formatter={(row: LeaveApplicationDetail) => {
                return LeaveApplicationStatus[
                  row.status.toLocaleUpperCase() as keyof typeof LeaveApplicationStatus
                ];
              }}
            />
            <ElTableColumn
              prop="reason"
              label="reason"
              width={250}
              showOverflowTooltip
            />

            <ElTableColumn
              label="opts"
              width={160}
              fixed="right"
              formatter={(row) => {
                return (
                  <ElSpace>
                    <ElLink
                      type="primary"
                      icon={Edit}
                      underline={false}
                      onClick={() => {
                        if (props.overlay === "dialog") {
                          props.LeaveApplicationFormDialogRef.value?.open({
                            mode: "edit",
                            id: row.id,
                            data: leaveApplicationDetail2LeaveApplicationFormValue(
                              row
                            ),
                          });
                        }
                        if (props.overlay === "drawer") {
                          props.LeaveApplicationFormDrawerRef.value?.open({
                            mode: "edit",
                            id: row.id,
                            data: leaveApplicationDetail2LeaveApplicationFormValue(
                              row
                            ),
                          });
                        }
                      }}
                    >
                      Edit
                    </ElLink>
                    <ElLink
                      type="primary"
                      icon={View}
                      underline={false}
                      onClick={() => {
                        if (props.overlay == "dialog") {
                          props.LeaveApplicationFormDialogRef.value?.open({
                            mode: "view",
                            data: leaveApplicationDetail2LeaveApplicationFormValue(
                              row
                            ),
                          });
                        }
                        if (props.overlay == "drawer") {
                          props.LeaveApplicationFormDrawerRef.value?.open({
                            mode: "view",
                            data: leaveApplicationDetail2LeaveApplicationFormValue(
                              row
                            ),
                          });
                        }
                      }}
                    >
                      View
                    </ElLink>
                  </ElSpace>
                );
              }}
            />
          </ElTable>
        </div>
      );
    };
  },
  {
    props: [
      ...tableBoxDefaultProps,
      "LeaveApplicationFormDialogRef",
      "LeaveApplicationFormDrawerRef",
      "overlay",
    ],
  }
);

export default CommonTableBox;
