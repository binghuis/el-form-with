import { defineComponent, reactive, toRef } from "vue";
import { ElForm, ElRow, ElButton, type FormRules } from "element-plus";
import { formBoxDefaultProps, type WEFormBoxProps } from "el-form-with";

export interface FormValue {}

export type FormType = string;

export type OkType = string;

const CommonFormBox = defineComponent<
  WEFormBoxProps<FormValue, FormType, OkType>
>(
  (props) => {
    const model = reactive<FormValue>({
      ...props.data,
    });

    const rules = reactive<FormRules<FormValue>>({});

    return () => {
      return (
        <div>
          <ElForm
            labelPosition="top"
            disabled={props.mode === "view"}
            ref={toRef(props.reference)}
            model={model}
            rules={rules}
          ></ElForm>
          <ElRow justify="end" class={"my-2"}>
            {props.mode !== "view" && (
              <>
                <ElButton
                  onClick={() => {
                    props.ok();
                  }}
                >
                  提交
                </ElButton>
              </>
            )}
            <ElButton
              onClick={() => {
                props.close();
              }}
            >
              关闭
            </ElButton>
          </ElRow>
        </div>
      );
    };
  },
  { props: [...formBoxDefaultProps] }
);

export default CommonFormBox;
