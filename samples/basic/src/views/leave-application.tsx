import { withDialog, withTable } from "el-form-with";
import { defineComponent } from "vue";
import LeaveApplicationFormBox from "../boxes/leave-application/leave.form";
import LeaveApplicationSelectorBox from "../boxes/leave-application/leave.selector";
import LeaveApplicationTableBox from "../boxes/leave-application/leave.table";
import {
  createLeaveApplication,
  getLeaveApplicationList,
  updateLeaveApplication,
} from "../api/leave-application";
import { ElButton } from "element-plus";
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
    return () => {
      return (
        <div>
          <LeaveApplicationFormDialog
            ref={LeaveApplicationFormDialogRef}
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
                  LeaveApplicationFormDialogRef={LeaveApplicationFormDialogRef}
                />
              );
            }}
          >
            <div class="bg-white dark:bg-black px-2 pt-4 pb-0 w-full flex justify-end mt-2">
              <ElButton
                type="primary"
                onClick={() => {
                  LeaveApplicationFormDialogRef.value?.open({
                    title: "Create",
                  });
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
