import { defineComponent, ref } from "vue";
import { type FormInstance, ElDialog, type DialogProps } from "element-plus";
import {
  WEFormMode,
  type WEFormContainer,
  type WEOpenOverlayParams,
  type WEPlainObject,
  type WEWithModalParams,
} from "./types";
import { getFormValueByFields } from "./utils";

type WithModalOpen<FormValue, RecordValue> = (
  openParams: WEOpenOverlayParams<FormValue, RecordValue>
) => void;

export type WithModalRef<
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
> = {
  open: WithModalOpen<FormValue, RecordValue>;
};

const withModal = <
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
>(
  params?: WEWithModalParams<FormValue, RecordValue>
) => {
  return (FormArea: WEFormContainer<FormValue, RecordValue>) => {
    const visible = ref<boolean>(false);
    const formRef = ref<FormInstance>();
    const title = ref<string>();
    const mode = ref<WEFormMode>("add");
    const data = ref<FormValue>();
    const record = ref<RecordValue>();
    const loading = ref<boolean>(false);
    const extra = ref<WEPlainObject>();

    const close = () => {
      visible.value = false;
      formRef.value?.resetFields();
    };

    const open: WithModalOpen<FormValue, RecordValue> = (openParams) => {
      if (!openParams) {
        return;
      }
      data.value = openParams.data;
      record.value = openParams.record;
      if (openParams.mode) {
        mode.value = openParams.mode;
      }
      extra.value = openParams.extra;
      title.value = openParams.title ?? "";
      visible.value = true;
    };

    const ok = async () => {
      if (!formRef.value) {
        return;
      }
      const isValid = await formRef.value.validate().catch((error) => {});

      if (!isValid) {
        return;
      }

      const FormValue = getFormValueByFields<FormValue>(formRef.value.fields);
      loading.value = true;
      const result = await params?.submit?.({
        mode: mode.value,
        data: FormValue,
        record: record.value,
      });

      if (result === "success") {
        data.value = FormValue;
        loading.value = false;
        close();
      }
    };

    return defineComponent<Partial<DialogProps>>({
      name: "ModalWithForm",
      props: ElDialog["props"],
      setup(props, { expose, attrs }) {
        expose({
          open,
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
                  extra={extra.value}
                />
              </ElDialog>
            </div>
          );
        };
      },
    });
  };
};

export default withModal;
