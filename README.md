# Cognito Dashboard

An optimised interface for AWS Cognito, focusing on enhanced user management. With features like sorting, filtering by custom attributes, and quick editing, user management has never been this effortless!

![cognitodashboard]

## Why?

From the offical [AWS Documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/how-to-manage-user-accounts.html#cognito-user-pools-searching-for-users-using-listusers-api), we note that we can only search for standard attributes

![image]

This application covers this limitation by providing us a means to sort, filter and quickly edit custom attributes. We are also able to update users in batches depending on their attributes.

Disclaimer:

**This dashboard was created in a day to perform rapid testing of applications dependent on custom attributes. It is not optimised to handle applications having more than 1,000 users smoothly.**

## Initial Configuration

To ensure that we have access to Amazon Cognito, create a .env file in the directory and include the relevant information.

If no environment variables are provided or the variables are provided incorrectly, a form will be rendered to allow you to dynamically change these values.

```
REACT_APP_REGION=
REACT_APP_AWS_USER_POOL_ID=
REACT_APP_AWS_ACCESS_KEY_ID=
REACT_APP_AWS_SECRET_ACCESS_KEY=
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
