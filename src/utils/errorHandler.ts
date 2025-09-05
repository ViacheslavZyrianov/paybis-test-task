import type { ApplicationError, ErrorCode } from '@/types/errors.ts'

/** Map of error codes to messages */
const errorMessages: Record<ErrorCode, string> = {
  400: 'Bad request. Please check your input.',
  401: 'Unauthorized. Please login again.',
  403: 'Forbidden. You do not have access.',
  404: 'Not found. Resource does not exist.',
  500: 'Server error. Please try again later.',
  NETWORK: 'Network error. Check your connection.',
}

/** Get user-friendly message from typed error */
export function getErrorMessage(error: ApplicationError): string {
  if (error.code && errorMessages[error.code as ErrorCode]) {
    return errorMessages[error.code as ErrorCode]
  }

  if (error.response?.status && errorMessages[error.response.status as ErrorCode]) {
    return errorMessages[error.response.status as ErrorCode]
  }

  if (error.message?.includes('Network')) {
    return errorMessages['NETWORK']
  }

  return error.message ?? 'An unknown error occurred.'
}
