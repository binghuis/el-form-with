import { defineComponent, ref } from "vue";
import { type FormInstance, ElDialog, type DialogProps } from "element-plus";
import {
  FormMode,
  type FormContainer,
  type OpenOverlayParams,
  type PlainObject,
  type WithModalParams,
} from "./types";
import { getFormDataByFields, isInEnum } from "./utils";

const withModal = <FormData extends object, RecordData extends object>(
  params?: WithModalParams<FormData, RecordData>
) => {
  return (FormArea: FormContainer) => {
    const visible = ref<boolean>(false);
    const formRef = ref<FormInstance>();
    const title = ref<string>();
    const mode = ref<FormMode>("add");
    const data = ref<FormData | null>();
    const record = ref<RecordData | null>();
    const loading = ref<boolean>(false);
    const extra = ref<PlainObject | null>();

    const close = () => {
      visible.value = false;
      formRef.value?.resetFields();
    };

    const open = (openParams: OpenOverlayParams<FormData, RecordData>) => {
      if (!openParams) {
        return;
      }
      data.value = openParams.initialValue ?? null;
      record.value = openParams.record ?? null;
      if (openParams.mode) {
        mode.value = openParams.mode;
      }
      extra.value = openParams.extra ?? null;
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

      const formData = getFormDataByFields<FormData>(formRef.value.fields);
      loading.value = true;
      const result = await params?.submit?.({
        mode: mode.value,
        data: formData,
        record: record.value,
      });

      if (result === "success") {
        data.value = formData;
        loading.value = false;
        close();
      }
    };

    return defineComponent<Partial<DialogProps>>({
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
