import { defineComponent, ref, toRaw, type PropType, type VNode } from "vue";
import { type FormInstance, ElDialog, type DialogProps } from "element-plus";
import type {
  WEFormMode,
  WEOpenOverlayParams,
  WEWithOverlaysParams,
  WEFormBoxProps,
  FormBoxOkHandle,
} from "./types";
import { getFormValueByFields } from "./utils";

type WithDialogOpen<FormValue, RecordValue, FormType> = (
  openParams: WEOpenOverlayParams<FormValue, RecordValue, FormType>
) => void;

export type WithDialog<
  FormValue extends object = object,
  RecordValue extends object = object,
  FormType extends string = string
> = {
  open: WithDialogOpen<FormValue, RecordValue, FormType>;
};

const withDialog = <
  FormValue extends object,
  RecordValue extends object = object,
  FormType extends string = string,
  OkType extends string = string
>(
  params?: WEWithOverlaysParams<FormValue, RecordValue, FormType, OkType>
) => {
  const visible = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const title = ref<string>();
  const mode = ref<WEFormMode>("add");
  const data = ref<FormValue>();
  const record = ref<RecordValue>();
  const loading = ref<boolean>(false);
  const type = ref<FormType>();
  const DialogRef = ref<WithDialog<FormValue, RecordValue, FormType>>();

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

  const open: WithDialogOpen<FormValue, RecordValue, FormType> = (
    openParams
  ) => {
    if (!openParams) {
      return;
    }
    data.value = openParams.data;
    record.value = openParams.record;
    if (openParams.mode) {
      mode.value = openParams.mode;
    }
    type.value = openParams.type;
    title.value = openParams.title ?? "";
    visible.value = true;
  };

  const ok: FormBoxOkHandle<FormValue, OkType> = async (okParams) => {
    if (!formRef.value) {
      return;
    }
    const isValid = await formRef.value.validate().catch((error) => {});

    if (!isValid) {
      return;
    }

    const formValue =
      okParams?.data ?? getFormValueByFields<FormValue>(formRef.value.fields);
    loading.value = true;

    function done() {
      data.value = formValue;
      loading.value = false;
      close();
    }
    params?.submit?.(
      {
        mode: mode.value,
        data: formValue,
        record: toRaw(record.value),
        okType: okParams?.type,
        formType: type.value,
      },
      done
    );
  };

  const DialogWithForm = defineComponent<
    Partial<DialogProps> & {
      form: (
        props: WEFormBoxProps<FormValue, RecordValue, FormType, OkType>
      ) => VNode;
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
              modelValue={visible.value}
              onClose={close}
              title={title.value}
            >
              {form({
                loading: loading.value,
                reference: formRef,
                mode: mode.value,
                ok,
                close,
                type: type.value,
                record: toRaw(record.value),
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
            (props: WEFormBoxProps<FormValue, RecordValue, FormType>) => VNode
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
