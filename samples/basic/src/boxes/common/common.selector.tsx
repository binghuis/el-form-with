import { defineComponent, reactive, toRef } from "vue";
import { ElButton, ElForm, ElRow } from "element-plus";
import { selectorBoxDefaultProps, type WESelectorBoxProps } from "el-form-with";

export interface SelectorValue {}

export interface SelectorBoxProps extends WESelectorBoxProps {}

const CommonSelectorBox = defineComponent<SelectorBoxProps>(
  (props) => {
    const model = reactive<SelectorValue>({});

    return () => {
      return (
        <div class="mb-2 bg-white dark:bg-[#141414] p-4">
          <ElForm ref={toRef(props.reference)} model={model}>
            <ElRow gutter={16}></ElRow>
            <ElRow justify="end">
              <ElButton
                loading={props.loadings.search}
                disabled={props.isLoading}
                type="primary"
                onClick={props.search}
              >
                查找
              </ElButton>
              <ElButton
                onClick={props.reset}
                loading={props.loadings.reset}
                disabled={props.isLoading}
              >
                重置
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
