import { withDialog, withTable } from "el-form-with";
import { defineComponent } from "vue";
import LeaveApplicationFormBox from "../boxes/leave-application/leave.form";
import LeaveApplicationSelectorBox from "../boxes/leave-application/leave.selector";
import LeaveApplicationTableBox from "../boxes/leave-application/leave.table";
import {
  createLeaveApplication,
  getLeaveApplicationList,
} from "../api/leave-application";
import { ElButton } from "element-plus";
import { StatusCodes } from "../constants/status-code";
import type { LeaveApplicationFormValue } from "../boxes/leave-application/leave.form.type";
import { leaveApplicationFormValue2CreateLeaveApplicationRequest } from "../boxes/leave-application/leave.form.helpers";

const LeaveApplicationView = defineComponent(
  () => {
    const [LeaveApplicationFormDialog, LeaveApplicationFormDialogRef] =
      withDialog<LeaveApplicationFormValue>({
        async submit(params, done) {
          if (!params.data) {
            return;
          }
          const { code } = await createLeaveApplication(
            leaveApplicationFormValue2CreateLeaveApplicationRequest(params.data)
          );
          if (code === StatusCodes.OK) {
            LeaveApplicationSelectorTableRef.value?.search();
            done();
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
              return <LeaveApplicationTableBox {...props} />;
            }}
          >
            <ElButton
              onClick={() => {
                LeaveApplicationFormDialogRef.value?.open({ title: "Create" });
              }}
            >
              Create
            </ElButton>
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
