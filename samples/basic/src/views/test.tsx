import { withStepDialog } from "el-form-with";
import { defineComponent } from "vue";
import TestFormBox from "../boxes/test/test.stepform";
import { ElButton } from "element-plus";

const [Com, ComRef] = withStepDialog({
  submit: async () => {},
  steps: 3,
});

const TestView = defineComponent(
  () => {
    return () => {
      return (
        <div>
          <ElButton
            onClick={() => {
              ComRef.value?.open();
            }}
          >
            open
          </ElButton>
          <Com
            ref={ComRef}
            stepform={(props) => {
              return <TestFormBox {...props} />;
            }}
          ></Com>
        </div>
      );
    };
  },
  {
    props: [],
  }
);

export default TestView;
