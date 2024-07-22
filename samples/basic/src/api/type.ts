export interface CommonResponse<Data extends object = object> {
  code: number;
  message?: string;
  data?: Data;
}

export interface PaginationResponse<Data extends object = object> {
  code: number;
  message?: string;
  data: {
    list: Data[];
    total: number;
  };
}
