import type { FormItemContext } from "element-plus";
import { isProxy, toRaw } from "vue";
import type { WEPlainObject } from "./types";
import { klona } from "klona";

export const isDate = (val: any) => val instanceof Date;

export function isInEnum<T extends {}>(enumObj: T, value: unknown): boolean {
  if (!value) {
    return false;
  }
  return Object.values(enumObj).includes(value);
}

export function getFormValueByFields<FormValue>(fields?: FormItemContext[]) {
  if (!fields || fields?.length === 0) {
    return null;
  }
  return fields.reduce<WEPlainObject>((acc, cur) => {
    let field = cur.fieldValue;

    field = raw(field);

    if (Array.isArray(field)) {
      field = field.map((item) => {
        return raw(item);
      });
    }

    if (cur.prop) {
      acc[cur.prop.toString()] = field;
    }

    return acc;
  }, {}) as FormValue;
}

export const DefaultMode = "add";

export function raw(value: any) {
  return klona(isProxy(value) ? toRaw(value) : value);
}
