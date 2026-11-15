export const AUTH_ERROR_MESSAGES = {
  NO_ACCOUNT: 'No account found. Please contact your administrator.',
  EMAIL_NOT_VERIFIED: 'Your Google account email is not verified.',
  OAUTH_FAILED: 'Google sign-in failed. Please try again.',
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;

export function isAuthErrorCode(value: string): value is AuthErrorCode {
  return value in AUTH_ERROR_MESSAGES;
}
