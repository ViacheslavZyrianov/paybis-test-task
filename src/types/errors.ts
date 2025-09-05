export type ErrorCode = 400 | 401 | 403 | 404 | 500 | 'NETWORK'

/** Error object coming from API or thrown manually */
export type ApplicationError = {
  code?: ErrorCode | number
  message?: string
  response?: { status: number }
}
