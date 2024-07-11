import { defineComponent, ref, toRaw, type PropType, type VNode } from "vue";
import { type FormInstance, ElDialog, type DialogProps } from "element-plus";
import type {
  WEFormMode,
  WEOpenOverlayParams,
  WEWithOverlaysParams,
  WEFormBoxProps,
  FormBoxOkHandle,
  MaybeNull,
} from "./types";
import { DefaultMode, getFormValueByFields } from "./utils";

type WithDialogOpen<FormValue, FormType> = (
  openParams?: WEOpenOverlayParams<FormValue, FormType>
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
  OkType extends string = string
>(
  params: WEWithOverlaysParams<FormValue, FormType, OkType>
) => {
  const visible = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const title = ref<string>();
  const id = ref<string | number>();
  const mode = ref<WEFormMode>(DefaultMode);
  const data = ref<MaybeNull<FormValue>>();
  const extra = ref<MaybeNull<object>>();
  const loading = ref<boolean>(false);
  const type = ref<FormType>();
  const DialogRef = ref<WithDialogRefValue<FormValue, FormType>>();

  const close = () => {
    function done() {
      visible.value = false;
      formRef.value?.resetFields();
    }
    if (params?.beforeClose) {
      params.beforeClose(done);
    } else {
      done();
    }
    params?.afterClose?.();
  };

  const open: WithDialogOpen<FormValue, FormType> = (openParams) => {
    data.value = openParams?.data;
    mode.value = openParams?.mode ?? DefaultMode;
    type.value = openParams?.type;
    title.value = openParams?.title;
    id.value = openParams?.id;
    extra.value = openParams?.extra;
    visible.value = true;
  };

  const ok: FormBoxOkHandle<FormValue, OkType> = async (okParams) => {
    let formValue: FormValue | null = null;
    if (formRef.value) {
      const isValid = await formRef.value.validate().catch((error) => {});

      if (!isValid) {
        return;
      }

      formValue = getFormValueByFields<FormValue>(formRef.value.fields);
    }
    if (okParams?.data) {
      formValue = okParams.data;
    }
    loading.value = true;

    function done() {
      data.value = formValue;
      loading.value = false;
      close();
    }

    params.submit?.(
      {
        mode: mode.value,
        data: formValue,
        okType: okParams?.type,
        formType: type.value,
        id: id.value,
        extra: extra.value,
      },
      done
    );
  };

  const DialogWithForm = defineComponent<
    Partial<DialogProps> & {
      form: (props: WEFormBoxProps<FormValue, FormType, OkType>) => VNode;
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
              modelValue={visible.value}
              onClose={close}
              title={title.value}
              closeOnClickModal={mode.value === "view" ? true : false}
              closeOnPressEscape={mode.value === "view" ? true : false}
            >
              {form({
                loading: loading.value,
                reference: formRef,
                mode: mode.value,
                ok,
                close,
                type: type.value,
                data: toRaw(data.value),
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
            (props: WEFormBoxProps<FormValue, FormType, OkType>) => VNode
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
