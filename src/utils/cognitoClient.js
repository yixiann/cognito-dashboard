import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_USER_POOL_ID,
} from "./env";

const getCognitoClient = (awsInfo) => {
  const region = awsInfo.region || REGION;
  const accessKeyId = awsInfo.accessKeyId || AWS_ACCESS_KEY_ID;
  const secretAccessKey = awsInfo.secretAccessKey || AWS_SECRET_ACCESS_KEY;

  return new CognitoIdentityProviderClient({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: "",
    },
  });
};

export const sendListUsersCommand = async (awsInfo) => {
  const allUsers = [];

  const userPoolId = awsInfo.userPoolId || AWS_USER_POOL_ID;

  let paginationToken = null;

  do {
    console.log("sendListUsersCommand");
    const response = await getCognitoClient(awsInfo).send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        PaginationToken: paginationToken,
      })
    );

    const users = response.Users || [];
    allUsers.push(...users);

    paginationToken = response.PaginationToken;
  } while (paginationToken);

  return allUsers;
};

export const sendUpdateUserAttributesCommand = async (
  awsInfo,
  username,
  key,
  value
) => {
  console.log("sendUpdateUserAttributesCommand", username, key, value);
  const userPoolId = awsInfo.userPoolId || AWS_USER_POOL_ID;

  return getCognitoClient(awsInfo).send(
    new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [{ Name: key, Value: value }],
    })
  );
};

export const sendUpdateUsersAttributesCommand = async (
  awsInfo,
  users,
  key,
  value
) => {
  const updatePromises = users.map((user) =>
    sendUpdateUserAttributesCommand(awsInfo, user.sub, key, value)
  );

  return Promise.all(updatePromises);
};
