import { defineComponent, ref, type PropType, type VNode } from "vue";
import type {
  WEFormMode,
  WEStepFormBoxProps,
  WEStepOpenOverlayParams,
  WEStepWithOverlaysParams,
} from "./types";
import { ElDialog, type DialogProps, type FormInstance } from "element-plus";
import { DefaultMode, raw } from "./utils";

type MulitWithDialogOpen<FormsValue, FormsType> = (
  openParams?: WEStepOpenOverlayParams<FormsValue, FormsType>
) => void;

export type MulitWithDialogRefValue<
  FormsValue extends object[] = [],
  FormsType extends string[] = []
> = {
  open: MulitWithDialogOpen<FormsValue, FormsType>;
};

const withStepDialog = <
  FormsValue extends object[],
  FormsType extends string[] = [],
  OverlayOkType extends string = string
>(
  params: WEStepWithOverlaysParams<FormsValue, FormsType, OverlayOkType>
) => {
  const visible = ref<boolean>(false);
  const title = ref<string>();
  const id = ref<string>();
  const mode = ref<WEFormMode>(DefaultMode);
  const data = ref<FormsValue>();
  const extra = ref<object>();
  const loading = ref<boolean>(false);
  const type = ref<FormsType>();
  const formRef = ref<FormInstance>();

  const StepDialogStepRef =
    ref<MulitWithDialogRefValue<FormsValue, FormsType>>();
  const { submit } = params;

  function setTitle(val: string) {
    title.value = val;
  }

  function open() {
    visible.value = true;
  }

  const StepDialogWithForms = defineComponent<
    Partial<DialogProps> & {
      stepform: (
        props: WEStepFormBoxProps<FormsValue, FormsType, OverlayOkType>
      ) => VNode;
    }
  >(
    (props, { expose, attrs }) => {
      const { stepform, ...restProps } = props;
      expose({
        open,
        setTitle,
      });
      return () => {
        return (
          <div>
            <ElDialog
              {...restProps}
              destroyOnClose={props.destroyOnClose}
              lockScroll
              modelValue={visible.value}
              onClose={close}
              title={title.value}
              closeOnClickModal={mode.value === "view" ? true : false}
              closeOnPressEscape={mode.value === "view" ? true : false}
            >
              {stepform({
                loading: loading.value,
                reference: formRef,
                mode: mode.value,
                ok: () => {},
                close,
                type: type.value?.[index],
                data: raw(data.value?.[index]),
                extra: raw(extra.value),
              })}
            </ElDialog>
          </div>
        );
      };
    },
    {
      name: "StepDialogWithForms",
      props: {
        ...ElDialog["props"],
        destroyOnClose: {
          type: Boolean,
          default: true,
        },
        stepform: {
          type: Function as PropType<
            (
              props: WEStepFormBoxProps<FormsValue, FormsType, OverlayOkType>
            ) => VNode
          >,
          required: true,
        },
      },
    }
  );

  return [StepDialogWithForms, StepDialogStepRef] as [
    typeof StepDialogWithForms,
    typeof StepDialogStepRef
  ];
};

export default withStepDialog;
