import { withStepDialog } from "el-form-with";
import { defineComponent } from "vue";
import TestFormBox from "../boxes/test/test.forms";
import { ElButton } from "element-plus";

const [Com, ComRef] = withStepDialog({
  submit: async () => {},
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
