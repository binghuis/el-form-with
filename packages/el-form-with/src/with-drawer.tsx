import { defineComponent, ref, type PropType, type VNode } from "vue";
import { type FormInstance, ElDrawer, type DrawerProps } from "element-plus";
import type {
  WEFormMode,
  WEOpenOverlayParams,
  WEWithOverlaysParams,
  WEFormBoxProps,
  FormBoxOkHandle,
} from "./types";
import { DefaultMode, getFormValueByFields, raw } from "./utils";

type WithDrawerOpen<FormValue, FormType> = (
  openParams?: WEOpenOverlayParams<FormValue, FormType>
) => void;

export type WithDrawerRefValue<
  FormValue extends object = object,
  FormType extends string = string
> = {
  open: WithDrawerOpen<FormValue, FormType>;
};

const withDrawer = <
  FormValue extends object,
  FormType extends string = string,
  OverlayOkType extends string = string
>(
  params: WEWithOverlaysParams<FormValue, FormType, OverlayOkType>
) => {
  const visible = ref<boolean>(false);
  const formRef = ref<FormInstance>();
  const title = ref<string>();
  const id = ref<string>();
  const mode = ref<WEFormMode>(DefaultMode);
  const data = ref<FormValue>();
  const extra = ref<object>();
  const loading = ref<boolean>(false);
  const type = ref<FormType>();
  const DrawerRef = ref<WithDrawerRefValue<FormValue, FormType>>();

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

  const open: WithDrawerOpen<FormValue, FormType> = (openParams) => {
    data.value = openParams?.data;
    mode.value = openParams?.mode ?? DefaultMode;
    type.value = openParams?.type;
    title.value = openParams?.title;
    id.value = openParams?.id;
    extra.value = openParams?.extra;
    visible.value = true;
  };

  const ok: FormBoxOkHandle<OverlayOkType> = async (okParams) => {
    let formValue: FormValue | undefined = undefined;
    if (formRef.value) {
      const isValid = await formRef.value.validate().catch((error) => {});

      if (!isValid) {
        return;
      }

      formValue = getFormValueByFields<FormValue>(formRef.value.fields);
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
        overlayOkType: okParams?.type,
        formType: type.value,
        id: id.value,
        extra: extra.value,
      },
      done
    );
  };

  const DrawerWithForm = defineComponent<
    Partial<DrawerProps> & {
      form: (
        props: WEFormBoxProps<FormValue, FormType, OverlayOkType>
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
                data: raw(data.value),
                extra: raw(extra.value),
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
            (props: WEFormBoxProps<FormValue, FormType, OverlayOkType>) => VNode
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
