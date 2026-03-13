export const redisKeys = {
  refreshToken: (userId: number, jti: string) =>
    `refreshToken_${userId}:${jti}`,
  OTP: (email: string) => `otp_${email}`,
  resetPassword: (email: string) => `otp_reset:${email}`,
  token_blackList: (accessToken: string) => `tokens_blacklist:${accessToken}`,
  dataForAdmin: (page: number | '*', limit: number | '*', type: string) =>
    `dataForAdmin:${type}:${page}:${limit}`,
  idempotencyKey: (key: string, op: string, id: number) =>
    `idempotencyKey:${key}:${op}:${id}`,
};
