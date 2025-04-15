export interface ApiResponse<T> {
  info: ResponseInfo;
  results: T[];
}

export interface ResponseInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}


