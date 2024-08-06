import { defineComponent, ref, type PropType, type VNode } from "vue";
import type {
  FormBoxOkHandle,
  WEFormMode,
  WEStepFormBoxProps,
  WEStepFormBoxPropsForms,
  WEStepOpenOverlayParams,
  WEStepWithOverlaysParams,
} from "./types";
import { ElDialog, type DialogProps } from "element-plus";
import { DefaultMode } from "./utils";

type MulitWithDialogOpen<
  FormsValue extends object[],
  FormsType extends string[]
> = (openParams?: WEStepOpenOverlayParams<FormsValue, FormsType>) => void;

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
  const visibleRef = ref<boolean>(false);
  const titleRef = ref<string>();
  const modeRef = ref<WEFormMode>(DefaultMode);
  const loadingRef = ref<boolean>(false);
  const formsRef = ref<WEStepFormBoxPropsForms<FormsValue, FormsType>[]>();
  const hasPrevRef = ref<boolean>(false);
  const hasNextRef = ref<boolean>(false);
  const activeRef = ref<number>(0);

  const StepDialogStepRef =
    ref<MulitWithDialogRefValue<FormsValue, FormsType>>();

  const { submit, steps } = params;

  const setTitle = (val?: string) => {
    if (val) {
      titleRef.value = val;
    }
  };

  const next = () => {};
  const prev = () => {};
  const close = () => {
    visibleRef.value = false;
  };

  const ok: FormBoxOkHandle<OverlayOkType> = async () => {};

  const open: MulitWithDialogOpen<FormsValue, FormsType> = (params) => {
    const { title, mode, forms } = params || {};
    setTitle(title);
    modeRef.value = mode || DefaultMode;
    if (forms?.length && formsRef.value?.length) {
      if (forms.length !== steps || formsRef.value.length !== steps) {
        return;
      }
      forms.forEach((form, index) => {
        formsRef.value![index]!["data"] = form.data;
        formsRef.value![index]!["type"] = form.type;
      });
    }
    visibleRef.value = true;
  };

  const StepDialogWithForms = defineComponent<
    Partial<DialogProps> & {
      stepform: (
        props: WEStepFormBoxProps<FormsValue, FormsType, OverlayOkType>
      ) => VNode;
    }
  >(
    (props, { expose, attrs }) => {
      const { stepform, destroyOnClose, ...restProps } = props;

      expose({
        open,
        setTitle,
      });

      return () => {
        return (
          <div>
            <ElDialog
              {...restProps}
              destroyOnClose={destroyOnClose}
              lockScroll
              modelValue={visibleRef.value}
              onClose={close}
              title={titleRef.value}
              closeOnClickModal={modeRef.value === "view" ? true : false}
              closeOnPressEscape={modeRef.value === "view" ? true : false}
            >
              {stepform({
                loading: loadingRef.value,
                mode: modeRef.value,
                ok,
                close,
                hasNext: hasNextRef.value,
                hasPrev: hasPrevRef.value,
                next,
                prev,
                active: activeRef.value,
                forms: formsRef.value,
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
