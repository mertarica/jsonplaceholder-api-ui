export interface PaginationParams {
  _start: number;
  _limit: number;
}

export interface ApiError {
  message: string;
  status: number;
}
