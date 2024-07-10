import { withDialog, withTable } from "el-form-with";
import { defineComponent } from "vue";
import CommonFormBox from "../boxes/common/common.form";
import CommonSelectorBox from "../boxes/common/common.selector";
import CommonTableBox from "../boxes/common/common.table";

const CommonView = defineComponent(
  () => {
    const [CommonFormDialog, CommonFormDialogRef] = withDialog({
      async submit(params, done) {
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
          <CommonFormDialog
            ref={CommonFormDialogRef}
            form={(props) => {
              return <CommonFormBox {...props} />;
            }}
          />
          <CommonSelectorTable
            ref={CommonSelectorTableRef}
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
