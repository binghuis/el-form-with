import { defineComponent, reactive, toRef } from "vue";
import { ElButton, ElForm, ElFormItem, ElInput, ElRow } from "element-plus";
import { selectorBoxDefaultProps, type WESelectorBoxProps } from "el-form-with";

export interface LeaveApplicationSelectorValue {
  name: string;
}

export interface LeaveApplicationSelectorBoxProps extends WESelectorBoxProps {}

const CommonSelectorBox = defineComponent<LeaveApplicationSelectorBoxProps>(
  (props) => {
    const selectorValue = reactive<LeaveApplicationSelectorValue>({
      name: "",
    });

    return () => {
      return (
        <div class="bg-white dark:bg-[#141414] p-2">
          <ElForm ref={toRef(props.reference)} model={selectorValue}>
            <ElRow>
              <ElFormItem label="Name" prop="name">
                <ElInput v-model={selectorValue.name} />
              </ElFormItem>
            </ElRow>
            <ElRow justify="end">
              <ElButton
                loading={props.loadings.search}
                disabled={props.isLoading}
                type="primary"
                onClick={props.search}
              >
                Search
              </ElButton>
              <ElButton
                onClick={props.reset}
                loading={props.loadings.reset}
                disabled={props.isLoading}
              >
                Reset
              </ElButton>
            </ElRow>
          </ElForm>
        </div>
      );
    };
  },
  {
    props: [...selectorBoxDefaultProps],
  }
);

export default CommonSelectorBox;
