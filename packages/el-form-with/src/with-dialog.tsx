import { defineComponent, ref } from "vue";
import { type FormInstance, ElDialog, type DialogProps } from "element-plus";
import type {
  WEFormMode,
  WEFormContainer,
  WEOpenOverlayParams,
  WEPlainObject,
  WEWithDialogParams
} from "./types";
import { getFormValueByFields } from "./utils";

type WithDialogOpen<FormValue, RecordValue> = (
  openParams: WEOpenOverlayParams<FormValue, RecordValue>
) => void;

export type WithDialogRef<
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
> = {
  open: WithDialogOpen<FormValue, RecordValue>;
};

const withDialog = <
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
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
    const type = ref<string>();

    const close = () => {
      visible.value = false;
      formRef.value?.resetFields();
    };

    const open: WithDialogOpen<FormValue, RecordValue> = openParams => {
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
      const isValid = await formRef.value.validate().catch(error => {});

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
          record: record.value,
          type: okParams?.type
        },
        done
      );
    };

    return defineComponent<Partial<DialogProps>>({
      name: "ModalWithForm",
      props: ElDialog["props"],
      setup(props, { expose, attrs }) {
        expose({
          open
        });
        return () => {
          return (
            <div>
              <ElDialog
                {...props}
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
                />
              </ElDialog>
            </div>
          );
        };
      }
    });
  };
};

export default withDialog;
