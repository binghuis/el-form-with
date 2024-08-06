import { defineComponent } from "vue";
import { ElSteps } from "element-plus";
import { formBoxDefaultProps } from "el-form-with";

const TestFormBox = defineComponent(
  (props) => {
    return () => {
      return (
        <div>
          <ElSteps>
            <ElSteps.Step title="Step1" description="This is description" />
            <ElSteps.Step title="Step2" description="This is description" />
            <ElSteps.Step title="Step3" description="This is description" />
          </ElSteps>
        </div>
      );
    };
  },
  { props: [...formBoxDefaultProps] }
);

export default TestFormBox;
