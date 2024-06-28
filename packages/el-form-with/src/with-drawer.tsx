import { defineComponent, ref } from "vue";
import { type FormInstance, ElDrawer, type DrawerProps } from "element-plus";
import {
  WEFormMode,
  type WEFormContainer,
  type WEOpenOverlayParams,
  type WEPlainObject,
  type WEWithDrawerParams,
} from "./types";
import { getFormValueByFields } from "./utils";

type WithDrawerOpen<FormValue, RecordValue> = (
  openParams: WEOpenOverlayParams<FormValue, RecordValue>
) => void;

export type WithDrawerRef<
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
> = {
  open: WithDrawerOpen<FormValue, RecordValue>;
};

const withDrawer = <
  FormValue extends object = WEPlainObject,
  RecordValue extends object = WEPlainObject
>(
  params?: WEWithDrawerParams<FormValue, RecordValue>
) => {
  const { submit, beforeClose, afterClose } = params ?? {};

  return (FormArea: WEFormContainer<FormValue, RecordValue>) => {
    return defineComponent<Partial<DrawerProps>>({
      name: "DrawerWithForm",
      props: ElDrawer["props"],
      setup(props, { expose, attrs }) {
        const visible = ref<boolean>(false);
        const formRef = ref<FormInstance>();
        const title = ref<string>();
        const mode = ref<WEFormMode>("add");
        const data = ref<FormValue>();
        const record = ref<RecordValue>();
        const loading = ref<boolean>(false);
        const extra = ref<WEPlainObject>();

        const close = async () => {
          const res = await beforeClose?.();
          if (res === "confirm") {
            visible.value = false;
            formRef.value?.resetFields();
          }
        };

        const open: WithDrawerOpen<FormValue, RecordValue> = (openParams) => {
          if (!openParams) {
            return;
          }
          data.value = openParams.data;
          record.value = openParams.record;
          if (openParams.mode) {
            mode.value = openParams.mode;
          }
          title.value = openParams.title ?? "";
          extra.value = openParams.extra;
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

          const FormValue = getFormValueByFields<FormValue>(
            formRef.value.fields
          );

          loading.value = true;
          const result = await submit?.({
            mode: mode.value,
            data: FormValue,
            record: record.value,
          });

          if (result === "success") {
            data.value = FormValue;
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
