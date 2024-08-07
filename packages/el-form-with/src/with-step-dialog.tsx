import {
  defineComponent,
  reactive,
  ref,
  watch,
  type PropType,
  type VNode,
} from "vue";
import type {
  FormBoxOkHandle,
  MaybeUndefined,
  WEFormMode,
  WEStepFormBoxProps,
  WEStepFormBoxPropsForms,
  WEStepOpenOverlayParams,
  WEStepWithOverlaysParams,
} from "./types";
import { ElDialog, type DialogProps, type FormInstance } from "element-plus";
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
  const { submit, steps } = params;
  const visibleRef = ref<boolean>(false);
  const titleRef = ref<string>();
  const modeRef = ref<WEFormMode>(DefaultMode);
  const loadingRef = ref<boolean>(false);
  const DefaultForms = Array.from({ length: steps }, () => ({
    reference: ref(),
    data: undefined,
    type: undefined,
  }));
  const formsRef =
    ref<WEStepFormBoxPropsForms<FormsValue, FormsType>[]>(DefaultForms);
  const hasPrevRef = ref<boolean>(false);
  const hasNextRef = ref<boolean>(steps > 1 ? true : false);
  const activeRef = ref<number>(0);

  const StepDialogStepRef =
    ref<MulitWithDialogRefValue<FormsValue, FormsType>>();

  const setTitle = (val?: string) => {
    if (val) {
      titleRef.value = val;
    }
  };

  watch(
    () => activeRef.value,
    (val) => {
      hasPrevRef.value = val > 0;
      hasNextRef.value = val < steps - 1;
    }
  );

  const prev = () => {
    if (!hasPrevRef.value) {
      return;
    }

    activeRef.value -= 1;
  };

  const next = () => {
    if (!hasNextRef.value) {
      return;
    }
    formsRef.value?.[activeRef.value]?.reference?.validate();
    activeRef.value += 1;
  };

  const close = () => {
    visibleRef.value = false;
    activeRef.value = 0;
    formsRef.value = formsRef.value.map((form) => {
      form.reference?.resetFields();
      return {
        ...form,
        data: undefined,
        type: undefined,
      };
    });
  };

  const ok: FormBoxOkHandle<OverlayOkType> = async () => {};

  const open: MulitWithDialogOpen<FormsValue, FormsType> = (params) => {
    const { title, mode, forms, active } = params || {};
    setTitle(title);
    modeRef.value = mode || DefaultMode;
    if (forms?.length && formsRef && formsRef.value.length) {
      if (forms.length !== steps || formsRef.value.length !== steps) {
        return;
      }
      formsRef.value = formsRef.value.map((form, index) => {
        return {
          ...form,
          data: forms![index]!.data as any,
          type: forms![index]!.type as any,
        };
      });
    }
    if (active && active < steps) {
      activeRef.value = active;
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
                forms: formsRef.value as any,
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
