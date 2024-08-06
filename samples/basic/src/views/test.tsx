import { multiWithDialog } from "el-form-with";
import { defineComponent } from "vue";

const [Com, ComRef] = multiWithDialog({
  submits: [],
});

const TestView = defineComponent(
  () => {
    return () => {
      return (
        <div>
          <Com ref={ComRef} forms={[]}></Com>
        </div>
      );
    };
  },
  {
    props: [],
  }
);

export default TestView;
