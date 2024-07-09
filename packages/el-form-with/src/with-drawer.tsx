import { defineComponent, ref, toRaw, type PropType, type VNode } from "vue";
import { type FormInstance, ElDrawer, type DrawerProps } from "element-plus";
import type {
  WEFormMode,
  WEOpenOverlayParams,
  WEWithOverlaysParams,
  WEFormBoxProps,
  FormBoxOkHandle,
  MaybeNull,
} from "./types";
import { DefaultMode, getFormValueByFields } from "./utils";

type WithDrawerOpen<FormValue, RecordValue, FormType> = (
  openParams?: WEOpenOverlayParams<FormValue, RecordValue, FormType>
) => void;

export type WithDrawerRefValue<
  FormValue extends object = object,
  RecordValue extends object = object,
  FormType extends string = string
> = {
  open: WithDrawerOpen<FormValue, RecordValue, FormType>;
};

const withDrawer = <
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
  const mode = ref<WEFormMode>(DefaultMode);
  const data = ref<MaybeNull<FormValue>>();
  const record = ref<MaybeNull<RecordValue>>();
  const loading = ref<boolean>(false);
  const type = ref<FormType>();
  const DrawerRef = ref<WithDrawerRefValue<FormValue, RecordValue, FormType>>();

  const close = () => {
    function done() {
      visible.value = false;
      formRef.value?.resetFields();
      mode.value = DefaultMode;
    }
    if (params?.beforeClose) {
      params.beforeClose(done);
    } else {
      done();
    }
    params?.afterClose?.();
  };

  const open: WithDrawerOpen<FormValue, RecordValue, FormType> = (
    openParams
  ) => {
    if (openParams) {
      data.value = openParams.data;
      record.value = openParams.record;
      if (openParams.mode) {
        mode.value = openParams.mode;
      }
      type.value = openParams.type;
      title.value = openParams.title ?? "";
    }
    visible.value = true;
  };

  const ok: FormBoxOkHandle<FormValue, OkType> = async (okParams) => {
    let formValue: FormValue | null = null;
    if (formRef.value) {
      const isValid = await formRef.value.validate().catch((error) => {});

      if (!isValid) {
        return;
      }

      formValue =
        okParams?.data ?? getFormValueByFields<FormValue>(formRef.value.fields);
    }
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

  const DrawerWithForm = defineComponent<
    Partial<DrawerProps> & {
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
            <ElDrawer
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
                record: toRaw(record.value),
                data: toRaw(data.value),
              })}
            </ElDrawer>
          </div>
        );
      };
    },
    {
      name: "DrawerWithForm",
      props: {
        ...ElDrawer["props"],
        destroyOnClose: {
          type: Boolean,
          default: true,
        },
        form: {
          type: Function as PropType<
            (
              props: WEFormBoxProps<FormValue, RecordValue, FormType, OkType>
            ) => VNode
          >,
          required: true,
        },
      },
    }
  );

  return [DrawerWithForm, DrawerRef] as [
    typeof DrawerWithForm,
    typeof DrawerRef
  ];
};

export default withDrawer;
