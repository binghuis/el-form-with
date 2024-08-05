import { withDialog, withDrawer, withTable } from "el-form-with";
import { defineComponent, ref } from "vue";
import LeaveApplicationFormBox from "../boxes/leave-application/leave.form";
import LeaveApplicationSelectorBox from "../boxes/leave-application/leave.selector";
import LeaveApplicationTableBox from "../boxes/leave-application/leave.table";
import {
  createLeaveApplication,
  getLeaveApplicationList,
  updateLeaveApplication,
} from "../api/leave-application";
import { ElButton, ElRadio, ElRadioGroup } from "element-plus";
import { StatusCodes } from "../constants/status-code";
import type { LeaveApplicationFormValue } from "../boxes/leave-application/leave.form.type";
import { leaveApplicationFormValue2CreateLeaveApplicationRequest } from "../boxes/leave-application/leave.form.helpers";

export const [LeaveApplicationFormDialog, LeaveApplicationFormDialogRef] =
  withDialog<LeaveApplicationFormValue>({
    async submit(params, done) {
      if (!params.data) {
        return;
      }
      if (params.mode === "add") {
        const { code } = await createLeaveApplication(
          leaveApplicationFormValue2CreateLeaveApplicationRequest(params.data)
        );
        if (code === StatusCodes.OK) {
          LeaveApplicationSelectorTableRef.value?.search();
          done();
        }
      }
      if (params.mode === "edit" && params.id) {
        const { code } = await updateLeaveApplication({
          ...leaveApplicationFormValue2CreateLeaveApplicationRequest(
            params.data
          ),
          id: params.id,
        });
        if (code === StatusCodes.OK) {
          LeaveApplicationSelectorTableRef.value?.search();
          done();
        }
      }
    },
  });

export const [LeaveApplicationFormDrawer, LeaveApplicationFormDrawerRef] =
  withDrawer<LeaveApplicationFormValue>({
    async submit(params, done) {
      if (!params.data) {
        return;
      }
      if (params.mode === "add") {
        const { code } = await createLeaveApplication(
          leaveApplicationFormValue2CreateLeaveApplicationRequest(params.data)
        );
        if (code === StatusCodes.OK) {
          LeaveApplicationSelectorTableRef.value?.search();
          done();
        }
      }
      if (params.mode === "edit" && params.id) {
        const { code } = await updateLeaveApplication({
          ...leaveApplicationFormValue2CreateLeaveApplicationRequest(
            params.data
          ),
          id: params.id,
        });
        if (code === StatusCodes.OK) {
          LeaveApplicationSelectorTableRef.value?.search();
          done();
        }
      }
    },
  });

const [LeaveApplicationSelectorTable, LeaveApplicationSelectorTableRef] =
  withTable({
    async requester(params) {
      const res = await getLeaveApplicationList({
        pageSize: params.pagination.pageSize,
        pageNum: params.pagination.current,
      });
      return { total: res.data.total, list: res.data.list };
    },
  });

const LeaveApplicationView = defineComponent(
  () => {
    const overlayRef = ref<"dialog" | "drawer">("dialog");
    return () => {
      return (
        <div>
          <ElRadioGroup v-model={overlayRef.value}>
            <ElRadio value="dialog">Dialog</ElRadio>
            <ElRadio value="drawer">Drawer</ElRadio>
          </ElRadioGroup>
          <LeaveApplicationFormDialog
            ref={LeaveApplicationFormDialogRef}
            form={(props) => {
              return <LeaveApplicationFormBox {...props} />;
            }}
          />
          <LeaveApplicationFormDrawer
            ref={LeaveApplicationFormDrawerRef}
            form={(props) => {
              return <LeaveApplicationFormBox {...props} />;
            }}
          />
          <LeaveApplicationSelectorTable
            ref={LeaveApplicationSelectorTableRef}
            selector={(props) => {
              return <LeaveApplicationSelectorBox {...props} />;
            }}
            table={(props) => {
              return (
                <LeaveApplicationTableBox
                  {...props}
                  overlay={overlayRef.value}
                  LeaveApplicationFormDialogRef={LeaveApplicationFormDialogRef}
                  LeaveApplicationFormDrawerRef={LeaveApplicationFormDrawerRef}
                />
              );
            }}
          >
            <div class="bg-white dark:bg-black px-2 pt-4 pb-0 w-full flex justify-end mt-2">
              <ElButton
                type="primary"
                onClick={() => {
                  if (overlayRef.value === "dialog") {
                    LeaveApplicationFormDialogRef.value?.open({
                      title: "Create",
                    });
                  }
                  if (overlayRef.value === "drawer") {
                    LeaveApplicationFormDrawerRef.value?.open({
                      title: "Create",
                    });
                  }
                }}
              >
                Create
              </ElButton>
            </div>
          </LeaveApplicationSelectorTable>
        </div>
      );
    };
  },
  {
    props: [],
  }
);

export default LeaveApplicationView;
