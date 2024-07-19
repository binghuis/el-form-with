export interface CommonResponse<Data extends object = object> {
  code: number;
  message?: string;
  data?: Data;
}
