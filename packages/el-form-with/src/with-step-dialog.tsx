import {
  defineComponent,
  ref,
  shallowRef,
  triggerRef,
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
  StepDialogWithFormsProps,
} from "./types";
import { ElDialog } from "element-plus";
import { DefaultMode, getFormValueByFields } from "./utils";

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
  const StepDialogStepRef =
    ref<MulitWithDialogRefValue<FormsValue, FormsType>>();

  const ok: FormBoxOkHandle<OverlayOkType> = async (params) => {
    const { type } = params ?? {};
    submit(
      {
        mode: modeRef.value,
        data: formsRef.value?.map((form) => form.data),
        types: formsRef.value?.map((form) => form.type),
        step: stepRef.value,
        overlayOkType: type,
      },
      close
    );
  };

  const close = () => {
    visibleRef.value = false;
    stepRef.value = 0;

    formsRef.value?.forEach((form) => {
      form.reference?.value?.resetFields();
      form.data = undefined;
      form.type = undefined;
    });
    triggerRef(formsRef);
  };

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

  const formsRef = shallowRef(DefaultForms);

  const open: MulitWithDialogOpen<FormsValue, FormsType> = (params) => {
    const { title, mode, forms, step } = params || {};
    setTitle(title);
    modeRef.value = mode || DefaultMode;
    if (forms?.length) {
      if (forms.length !== steps) {
        console.warn("forms length not match steps");
        return;
      }
      formsRef.value?.forEach((form, index) => {
        form.data = forms[index]?.data;
        form.type = forms[index]?.type;
      });
      triggerRef(formsRef);
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
    StepDialogWithFormsProps<FormsValue, FormsType, OverlayOkType>
  >(
    (props, { expose, attrs }) => {
      const { stepform, destroyOnClose, onNext, ...restProps } = props;

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

        const currentForm = formsRef.value?.[stepRef.value];
        const nextForm = formsRef.value?.[stepRef.value + 1];

        if (!currentForm) {
          return;
        }

        const isValid = await currentForm?.reference?.value
          ?.validate()
          .catch(() => false);

        if (!isValid) {
          return;
        }

        loadingRef.value = true;
        const { data, type } = (await onNext?.(stepRef.value)) ?? {};
        loadingRef.value = false;

        const formValue = getFormValueByFields<FormsValue[number]>(
          currentForm?.reference?.value?.fields
        );
        currentForm.data = formValue;
        if (data && nextForm) {
          nextForm.data = data;
          nextForm.type = type;
        }
        triggerRef(formsRef);
        stepRef.value += 1;
      };

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
