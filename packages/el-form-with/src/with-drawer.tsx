import { defineComponent, ref, isProxy, toRaw } from "vue";
import {
  type FormInstance,
  ElDrawer,
  type DrawerProps,
  ElMessageBox,
  ElMessage,
  type ElMessageBoxOptions,
  type MessageOptions,
} from "element-plus";
import {
  FormMode,
  type FormComponent,
  type OpenOverlayParams,
  type WithDrawerParams,
} from "./types";
import { getFormDataByFields, isDate, isInEnum } from "./utils";

const DefaultSuccessMsgOpts: Partial<MessageOptions> = {
  message: "创建成功",
  plain: true,
  type: "success",
};

const DefaultCancelMsgBoxOpts: Partial<ElMessageBoxOptions> = {
  title: "确认退出当前表单?",
  message: "关闭表单当前已填信息将会丢失。",
  type: "warning",
  confirmButtonText: "关闭",
  cancelButtonText: "取消",
};

const withDrawer = <FormData extends object, RecordData extends object>(
  params?: WithDrawerParams<FormData, RecordData>
) => {
  const {
    submit,
    successMsgOpts = true,
    cancelMsgBoxOpts = true,
  } = params ?? {};

  return (FormCom: FormComponent) => {
    return defineComponent<Partial<DrawerProps>>({
      props: ElDrawer["props"],
      setup(props, { expose, attrs }) {
        const visible = ref<boolean>(false);
        const formRef = ref<FormInstance>();
        const title = ref<string>();
        const mode = ref<FormMode>(FormMode.Add);
        const data = ref<FormData | null>();
        const record = ref<RecordData | null>();
        const loading = ref<boolean>(false);

        const close = () => {
          if (cancelMsgBoxOpts) {
            const localCancelMsgBoxOpts =
              typeof cancelMsgBoxOpts === "boolean"
                ? DefaultCancelMsgBoxOpts
                : { ...DefaultCancelMsgBoxOpts, ...cancelMsgBoxOpts };

            ElMessageBox.confirm(
              localCancelMsgBoxOpts.message,
              localCancelMsgBoxOpts.title,
              {
                confirmButtonText: localCancelMsgBoxOpts.confirmButtonText,
                cancelButtonText: localCancelMsgBoxOpts.cancelButtonText,
                type: localCancelMsgBoxOpts.type,
              }
            )
              .then(() => {
                visible.value = false;
                formRef.value?.resetFields();
              })
              .catch(() => {});
          }
        };

        const open = (openParams: OpenOverlayParams<FormData, RecordData>) => {
          if (!openParams || !isInEnum(FormMode, openParams.mode)) {
            return;
          }
          data.value = openParams.initialValue ?? null;
          record.value = openParams.record ?? null;
          if (openParams.mode) {
            mode.value = openParams.mode;
          }
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
          const result = await submit?.({
            mode: mode.value,
            data: formData,
            record: record.value,
          });

          if (result === "success") {
            data.value = formData;
            loading.value = false;
            close();
            if (successMsgOpts) {
              ElMessage({
                ...DefaultSuccessMsgOpts,
                ...(typeof successMsgOpts === "boolean" ? {} : successMsgOpts),
              });
            }
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
                <FormCom
                  form={formRef}
                  mode={mode.value}
                  ok={ok}
                  close={close}
                  loading={loading.value}
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
