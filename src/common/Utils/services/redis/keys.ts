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
  JobApplication: (jobId: number, page: number | '*', limit: number | '*') =>
    `jobApplications:${jobId}:page:${page}:limit:${limit}`,
  allCompanies: (
    page: number | '*',
    limit: number | '*',
    search?: string | '*',
  ) => `allCompanies:search:${search}:page${page}:limit:${limit}`,
  companyJobs: (companyId: number, page: number | '*', limit: number | '*') =>
    `allCompanyJobs:companyId:${companyId}:page${page}:limit:${limit}`,
  allJobs: (page: number | '*', limit: number | '*', filter?: string | '*') =>
    `allJObs:search:${filter}:page${page}:limit:${limit}`,
  allJobReports: (jobId: number, page: number | '*', limit: number | '*') =>
    `allJobsReports:job_${jobId}:page${page}:limit:${limit}`,
  jobDetails: (jobId: number) => `jobDetails:${jobId}`,
  notification: (userId: number, page: number | '*', limit: number | '*') =>
    `notifications:userId:${userId}:page${page}:limit:${limit}`,
  socketKey: (userId: number) => `user_sockets:${userId}`,
};
