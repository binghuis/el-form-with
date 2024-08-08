import { defineComponent, ref, type PropType, type VNode } from "vue";
import { type FormInstance, ElDialog, type DialogProps } from "element-plus";
import type {
  FormMode,
  OpenOverlayParams,
  WithOverlaysParams,
  FormBoxProps,
  FormBoxOkHandle,
} from "./types";
import { DefaultMode, getFormValueByFields, raw } from "./utils";

type WithDialogOpen<FormValue, FormType> = (
  params?: OpenOverlayParams<FormValue, FormType>
) => void;

export type WithDialogRefValue<
  FormValue extends object = object,
  FormType extends string = string
> = {
  open: WithDialogOpen<FormValue, FormType>;
};

const withDialog = <
  FormValue extends object,
  FormType extends string = string,
  OverlayOkType extends string = string
>(
  params: WithOverlaysParams<FormValue, FormType, OverlayOkType>
) => {
  const visibleRef = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const titleRef = ref<string>();
  const idRef = ref<string>();
  const modeRef = ref<FormMode>(DefaultMode);
  const dataRef = ref<FormValue>();
  const extraRef = ref<object>();
  const loadingRef = ref<boolean>(false);
  const typeRef = ref<FormType>();
  const DialogRef = ref<WithDialogRefValue<FormValue, FormType>>();
  const { submit, beforeClose, afterClose } = params ?? {};
  const close = () => {
    function done() {
      visibleRef.value = false;
      formRef.value?.resetFields();
    }
    if (beforeClose) {
      beforeClose(done);
    } else {
      done();
    }
    afterClose?.();
  };

  const open: WithDialogOpen<FormValue, FormType> = (params) => {
    const { mode, data, type, title, id, extra } = params || {};
    dataRef.value = data;
    modeRef.value = mode ?? DefaultMode;
    typeRef.value = type;
    titleRef.value = title;
    idRef.value = id;
    extraRef.value = extra;
    visibleRef.value = true;
  };

  const ok: FormBoxOkHandle<OverlayOkType> = async (params) => {
    const { type } = params ?? {};
    let formValue: FormValue | undefined = undefined;
    if (formRef.value) {
      const isValid = await formRef.value.validate().catch((error) => {});

      if (!isValid) {
        return;
      }

      formValue = getFormValueByFields<FormValue>(formRef.value.fields);
    }
    loadingRef.value = true;

    function done() {
      dataRef.value = formValue;
      loadingRef.value = false;
      close();
    }

    submit?.(
      {
        mode: modeRef.value,
        data: formValue,
        overlayOkType: type,
        formType: typeRef.value,
        id: idRef.value,
        extra: extraRef.value,
      },
      done
    );
  };

  const DialogWithForm = defineComponent<
    Partial<DialogProps> & {
      form: (props: FormBoxProps<FormValue, FormType, OverlayOkType>) => VNode;
    }
  >(
    (props, { expose, attrs }) => {
      const { form, ...restProps } = props;
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
              modelValue={visibleRef.value}
              onClose={close}
              title={titleRef.value}
              closeOnClickModal={modeRef.value === "view" ? true : false}
              closeOnPressEscape={modeRef.value === "view" ? true : false}
            >
              {form({
                loading: loadingRef.value,
                reference: formRef,
                mode: modeRef.value,
                ok,
                close,
                type: typeRef.value,
                data: raw(dataRef.value),
                extra: raw(extraRef.value),
              })}
            </ElDialog>
          </div>
        );
      };
    },
    {
      name: "DialogWithForm",
      props: {
        ...ElDialog["props"],
        destroyOnClose: {
          type: Boolean,
          default: true,
        },
        form: {
          type: Function as PropType<
            (props: FormBoxProps<FormValue, FormType, OverlayOkType>) => VNode
          >,
          required: true,
        },
      },
    }
  );

  return [DialogWithForm, DialogRef] as [
    typeof DialogWithForm,
    typeof DialogRef
  ];
};

export default withDialog;
