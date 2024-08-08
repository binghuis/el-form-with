import {
  defineComponent,
  reactive,
  ref,
  shallowReactive,
  watch,
  type PropType,
  type VNode,
} from "vue";
import type {
  FormBoxOkHandle,
  FormMode,
  StepFormBoxProps,
  FormBoxProps,
  StepOpenOverlayParams,
  StepWithOverlaysParams,
} from "./types";
import { ElDialog, type DialogProps } from "element-plus";
import { DefaultMode } from "./utils";

type MulitWithDialogOpen<
  FormsValue extends object[],
  FormsType extends string[]
> = (openParams?: StepOpenOverlayParams<FormsValue, FormsType>) => void;

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
  params: StepWithOverlaysParams<FormsValue, FormsType, OverlayOkType>
) => {
  const { submit, steps } = params;

  const visibleRef = ref<boolean>(false);
  const titleRef = ref<string>();
  const modeRef = ref<FormMode>(DefaultMode);
  const loadingRef = ref<boolean>(false);
  const hasPrevRef = ref<boolean>(false);
  const hasNextRef = ref<boolean>(steps > 1 ? true : false);
  const stepRef = ref<number>(0);

  const close = () => {
    visibleRef.value = false;
    stepRef.value = 0;

    formsRx.forEach((form) => {
      form.reference?.value?.resetFields();
      form.data = undefined;
      form.type = undefined;
    });
  };

  const ok: FormBoxOkHandle<OverlayOkType> = async (params) => {
    const { type } = params ?? {};
    submit(
      {
        mode: modeRef.value,
        data: formsRx.map((form) => form.data) as unknown as FormsValue,
        overlayOkType: type,
      },
      close
    );
  };

  const StepDialogStepRef =
    ref<MulitWithDialogRefValue<FormsValue, FormsType>>();

  const DefaultForms: FormBoxProps<
    FormsValue[number],
    FormsType[number],
    OverlayOkType
  >[] = Array.from({ length: steps }, () => ({
    reference: ref(),
    data: undefined,
    type: undefined,
    mode: DefaultMode,
    loading: false,
    ok,
    close,
  }));

  const formsRx = shallowReactive(DefaultForms);

  const prev = () => {
    if (!hasPrevRef.value) {
      return;
    }

    stepRef.value -= 1;
  };

  const next = async () => {
    if (!hasNextRef.value) {
      return;
    }

    formsRx[stepRef.value]?.reference?.value?.validate().then((valid) => {
      if (valid) {
        stepRef.value += 1;
      }
    });
  };

  const open: MulitWithDialogOpen<FormsValue, FormsType> = (params) => {
    const { title, mode, forms, step } = params || {};
    setTitle(title);
    modeRef.value = mode || DefaultMode;
    if (forms?.length) {
      if (forms.length !== steps) {
        console.warn("forms length not match steps");
        return;
      }
      formsRx.forEach((form, index) => {
        form.data = forms[index]?.data as typeof form.data;
        form.type = forms[index]?.type as typeof form.type;
      });
    }
    if (step && step < steps) {
      stepRef.value = step;
    }
    visibleRef.value = true;
  };

  const setTitle = (val?: string) => {
    if (val) {
      titleRef.value = val;
    }
  };

  watch(
    () => stepRef.value,
    (val) => {
      hasPrevRef.value = val > 0;
      hasNextRef.value = val < steps - 1;
    }
  );

  const StepDialogWithForms = defineComponent<
    Partial<DialogProps> & {
      stepform: (
        props: StepFormBoxProps<FormsValue, FormsType, OverlayOkType>
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
                step: stepRef.value,
                forms: formsRx as unknown as FormBoxProps<
                  FormsValue[number],
                  FormsType[number]
                >[],
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
              props: StepFormBoxProps<FormsValue, FormsType, OverlayOkType>
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
