import type { FormRules } from "element-plus";
import { reactive } from "vue";

export function createRules() {
  return reactive<FormRules>({});
}
