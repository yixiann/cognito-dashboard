export const REGION = process.env.REACT_APP_REGION;
export const AWS_ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY =
  process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
export const AWS_USER_POOL_ID = process.env.REACT_APP_AWS_USER_POOL_ID;

export const hasNoRegion = REGION === undefined;
export const hasNoAwsAccessKeyId = AWS_ACCESS_KEY_ID === undefined;
export const hasNoAwsSecretAccessKey = AWS_SECRET_ACCESS_KEY === undefined;
export const hasNoAwsUserPoolId = AWS_USER_POOL_ID === undefined;
export const hasMissingInformation =
  hasNoRegion ||
  hasNoAwsAccessKeyId ||
  hasNoAwsSecretAccessKey ||
  hasNoAwsUserPoolId;
