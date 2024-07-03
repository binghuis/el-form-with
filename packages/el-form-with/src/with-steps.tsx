import { defineComponent, ref } from "vue";
import { ElSteps, type StepsProps } from "element-plus";
import type { WEFormContainer, WEPlainObject } from "./types";
import { getFormValueByFields } from "./utils";

const withSteps = <
  FormsValue extends object[] = WEPlainObject[],
  RecordValue extends object = WEPlainObject,
  FormType extends string = string
>() => {
  return (FormsContainer: any) => {
    const StepsWithFormsRef = ref();
    const hasPrev = ref(false);
    const hasNext = ref(true);
    const active = ref(1);
    const formsCount = FormsContainer.length;

    const next = () => {
      if (active.value < formsCount) {
        active.value++;
      } else {
        hasNext.value = false;
      }
    };

    const prev = () => {
      if (active.value === 0) {
        hasPrev.value = false;
      } else {
        active.value--;
      }
    };

    const StepsWithForms = defineComponent(
      (props, { expose, slots }) => {
        return () => {
          return (
            <div>
              {slots["default"]?.()}
              {slots["steps"]?.({
                prev,
                next,
                active: active.value,
              })}
            </div>
          );
        };
      },
      { name: "StepsWithForms" }
    );

    return [StepsWithForms, StepsWithFormsRef] as [
      typeof StepsWithForms,
      typeof StepsWithFormsRef
    ];
  };
};

export default withSteps;
