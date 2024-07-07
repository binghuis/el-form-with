import {
  defineComponent,
  ref,
  type FunctionalComponent,
  type VNode,
} from "vue";
import { ElSteps, type StepsProps } from "element-plus";
import type { WEPlainObject } from "./types";
import { getFormValueByFields } from "./utils";

type StepsWithFormsProps = {
  formsBox: (props: any) => VNode;
};

const withSteps = (params: { FormBoxs: FunctionalComponent[] }) => {
  const { FormBoxs } = params;

  return () => {
    const StepsWithFormsRef = ref();
    const hasPrev = ref(false);
    const hasNext = ref(true);
    const active = ref(1);

    const next = () => {
      active.value++;
      hasNext.value = false;
    };

    const prev = () => {
      if (active.value === 0) {
        hasPrev.value = false;
      } else {
        active.value--;
      }
    };

    const StepsWithForms = defineComponent<StepsWithFormsProps>(
      (props, { expose, slots }) => {
        return () => {
          return (
            <div>
              {slots["default"]?.()}
              {props.formsBox({
                prev,
                next,
                active: active.value,
              })}
            </div>
          );
        };
      },
      { name: "StepsWithForms", props: ["formsBox"] }
    );

    return [StepsWithForms, StepsWithFormsRef] as [
      typeof StepsWithForms,
      typeof StepsWithFormsRef
    ];
  };
};

export default withSteps;
