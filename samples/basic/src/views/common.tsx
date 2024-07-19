import { withDialog, withTable } from "el-form-with";
import { defineComponent } from "vue";
import CommonFormBox from "../boxes/common/common.form";
import CommonSelectorBox from "../boxes/common/common.selector";
import CommonTableBox from "../boxes/common/common.table";
import { createLeaveApplication } from "../api/leave";
import { LeaveType } from "../api/leave.type";
import { ElButton } from "element-plus";

const CommonView = defineComponent(
  () => {
    const [CommonFormDialog, CommonFormDialogRef] = withDialog({
      async submit(params, done) {
        const leave = await createLeaveApplication({
          employeeName: "test",
          startDate: +new Date(),
          endDate: +new Date(),
          type: LeaveType["PERSONAL"],
          reason: "test",
        });
        console.log(leave);

        done();
      },
    });
    const [CommonSelectorTable, CommonSelectorTableRef] = withTable({
      async requester(params) {
        return { total: 0, list: [] };
      },
    });
    return () => {
      return (
        <div>
          <ElButton
            onClick={() => {
              CommonFormDialogRef.value?.open();
            }}
          >
            Create
          </ElButton>
          <CommonFormDialog
            ref={CommonFormDialogRef}
            form={(props) => {
              return <CommonFormBox {...props} />;
            }}
          />
          <CommonSelectorTable
            ref={CommonSelectorTableRef}
            paginationOpts={{ boxClass: "bg-white dark:bg-[#141414] p-4" }}
            selector={(props) => {
              return <CommonSelectorBox {...props} />;
            }}
            table={(props) => {
              return <CommonTableBox {...props} />;
            }}
          />
        </div>
      );
    };
  },
  {
    props: [],
  }
);

export default CommonView;