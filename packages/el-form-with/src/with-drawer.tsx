import { defineComponent, ref } from "vue";
import { type FormInstance, ElDrawer, type DrawerProps } from "element-plus";
import {
  FormMode,
  type FormContainer,
  type OpenOverlayParams,
  type PlainObject,
  type WithDrawerParams,
} from "./types";
import { getFormDataByFields, isInEnum } from "./utils";

const withDrawer = <FormData extends object, RecordData extends object>(
  params?: WithDrawerParams<FormData, RecordData>
) => {
  const { submit, beforeClose, afterClose } = params ?? {};

  return (FormArea: FormContainer) => {
    return defineComponent<Partial<DrawerProps>>({
      props: ElDrawer["props"],
      setup(props, { expose, attrs }) {
        const visible = ref<boolean>(false);
        const formRef = ref<FormInstance>();
        const title = ref<string>();
        const mode = ref<FormMode>("add");
        const data = ref<FormData | null>();
        const record = ref<RecordData | null>();
        const loading = ref<boolean>(false);
        const extra = ref<PlainObject | null>();

        const close = async () => {
          const res = await beforeClose?.();
          if (res === "confirm") {
            visible.value = false;
            formRef.value?.resetFields();
          }
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
          title.value = openParams.title ?? "";
          extra.value = openParams.extra ?? null;
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
          const result = await submit?.({
            mode: mode.value,
            data: formData,
            record: record.value,
          });

          if (result === "success") {
            data.value = formData;
            loading.value = false;
            close();
            afterClose?.();
          }
        };

        expose({
          open,
        });

        return () => {
          return (
            <div>
              <ElDrawer
                {...props}
                beforeClose={close}
                modelValue={visible.value}
                title={title.value}
              >
                <FormArea
                  form={formRef}
                  mode={mode.value}
                  ok={ok}
                  close={close}
                  loading={loading.value}
                  extra={extra.value}
                />
              </ElDrawer>
            </div>
          );
        };
      },
    });
  };
};

export default withDrawer;
