import type { FormItemContext } from "element-plus";
import { isProxy, toRaw } from "vue";
import type { PlainObject } from "./types";

export const isDate = (val: any) => val instanceof Date;

export function isInEnum<T extends {}>(enumObj: T, value: unknown): boolean {
  if (!value) {
    return false;
  }
  return Object.values(enumObj).includes(value);
}

export function getFormDataByFields<FormData extends object>(
  fields?: FormItemContext[]
): FormData {
  if (!fields || fields?.length === 0) {
    return null as unknown as FormData;
  }
  return fields.reduce((acc, cur) => {
    let field = cur.fieldValue;

    if (isProxy(field)) {
      field = toRaw(field);
    }

    if (isDate(field)) {
      field = field.valueOf();
    }

    if (cur.prop) {
      (acc as PlainObject)[cur.prop.toString()] = field;
    }

    return acc;
  }, {} as FormData);
}
