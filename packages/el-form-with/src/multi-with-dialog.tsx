import { defineComponent, ref, type PropType, type VNode } from "vue";
import type {
  MaybeNull,
  WEFormMode,
  WEMultiFormBoxProps,
  WEMultiOpenOverlayParams,
  WEMultiWithOverlaysParams,
} from "./types";
import { ElDialog, type DialogProps, type FormInstance } from "element-plus";
import { DefaultMode, raw } from "./utils";

type MulitWithDialogOpen<FormsValue, FormsType> = (
  openParams?: WEMultiOpenOverlayParams<FormsValue, FormsType>
) => void;

export type MulitWithDialogRefValue<
  FormsValue extends object[] = [],
  FormsType extends string[] = []
> = {
  open: MulitWithDialogOpen<FormsValue, FormsType>;
};

const multiWithDialog = <
  FormsValue extends object[],
  FormsType extends string[] = [],
  OkType extends string = string
>(
  params: WEMultiWithOverlaysParams<FormsValue, FormsType, OkType>
) => {
  const visible = ref<boolean>(false);
  const title = ref<string>();
  const id = ref<string | number>();
  const mode = ref<WEFormMode>(DefaultMode);
  const data = ref<MaybeNull<FormsValue>>();
  const extra = ref<MaybeNull<object>>();
  const loading = ref<boolean>(false);
  const type = ref<FormsType>();
  const formRef = ref<FormInstance>();
  const DialogMultiRef = ref<MulitWithDialogRefValue<FormsValue, FormsType>>();
  const { submits } = params;
  const DialogWithForms = defineComponent<
    Partial<DialogProps> & {
      forms: (
        props: WEMultiFormBoxProps<FormsValue, FormsType, OkType>
      ) => VNode;
    }
  >(
    (props, { expose, attrs }) => {
      const { forms, ...restProps } = props;
      expose({
        open,
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
              {forms({
                loading: loading.value,
                reference: formRef,
                mode: mode.value,
                ok: () => {},
                close,
                type: type.value,
                data: raw(data.value),
                extra: raw(extra.value),
              })}
            </ElDialog>
          </div>
        );
      };
    },
    {
      name: "DialogWithForms",
      props: {
        ...ElDialog["props"],
        destroyOnClose: {
          type: Boolean,
          default: true,
        },
        forms: {
          type: Function as PropType<
            (props: WEMultiFormBoxProps<FormsValue, FormsType, OkType>) => VNode
          >,
          required: true,
        },
      },
    }
  );

  return [DialogWithForms, DialogMultiRef] as [
    typeof DialogWithForms,
    typeof DialogMultiRef
  ];
};

export default multiWithDialog;
