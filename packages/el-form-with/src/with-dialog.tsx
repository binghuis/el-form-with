import { defineComponent, ref, toRaw } from "vue";
import { type FormInstance, ElDialog, type DialogProps } from "element-plus";
import type {
  WEFormMode,
  WEFormContainer,
  WEOpenOverlayParams,
  WEPlainObject,
  WEWithDialogParams,
} from "./types";
import { getFormValueByFields } from "./utils";

type WithDialogOpen<FormValue, RecordValue, FormType> = (
  openParams: WEOpenOverlayParams<FormValue, RecordValue, FormType>
) => void;

export type WithDialogRef<
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject,
  FormType extends string = string
> = {
  open: WithDialogOpen<FormValue, RecordValue, FormType>;
};

const withDialog = <
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject,
  FormType extends string = string
>(
  params?: WEWithDialogParams<FormValue, RecordValue>
) => {
  return (FormArea: WEFormContainer<FormValue, RecordValue>) => {
    const visible = ref<boolean>(false);
    const formRef = ref<FormInstance>();
    const title = ref<string>();
    const mode = ref<WEFormMode>("add");
    const data = ref<FormValue>();
    const record = ref<RecordValue>();
    const loading = ref<boolean>(false);
    const type = ref<FormType>();
    const DialogRef = ref<WithDialogRef<FormValue, RecordValue, FormType>>();

    const close = () => {
      visible.value = false;
      formRef.value?.resetFields();
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

    const ok = async (okParams?: { type?: string }) => {
      if (!formRef.value) {
        return;
      }
      const isValid = await formRef.value.validate().catch((error) => {});

      if (!isValid) {
        return;
      }

      const FormValue = getFormValueByFields<FormValue>(formRef.value.fields);
      loading.value = true;

      function done() {
        data.value = FormValue;
        loading.value = false;
        close();
      }
      params?.submit?.(
        {
          mode: mode.value,
          data: FormValue,
          record: toRaw(record.value),
          type: okParams?.type,
        },
        done
      );
    };

    const DialogWithForm = defineComponent<Partial<DialogProps>>({
      name: "DialogWithForm",
      props: {
        ...ElDialog["props"],
        destroyOnClose: {
          type: Boolean,
          default: true,
        },
      },
      setup(props, { expose, attrs }) {
        expose({
          open,
        });

        return () => {
          return (
            <div>
              <ElDialog
                {...props}
                destroyOnClose={props.destroyOnClose}
                modelValue={visible.value}
                onClose={close}
                title={title.value}
              >
                <FormArea
                  loading={loading.value}
                  form={formRef}
                  mode={mode.value}
                  ok={ok}
                  close={close}
                  type={type.value}
                  record={toRaw(record.value)}
                  data={toRaw(data.value)}
                />
              </ElDialog>
            </div>
          );
        };
      },
    });

    return [DialogWithForm, DialogRef] as [
      typeof DialogWithForm,
      typeof DialogRef
    ];
  };
};

export default withDialog;
