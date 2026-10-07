export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR'
  | 'FORBIDDEN';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode | string;
    message: string;
  };
}
