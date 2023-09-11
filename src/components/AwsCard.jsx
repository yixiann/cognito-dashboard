import React from "react";
import { Typography, Card, Form, Input } from "antd";
import {
  hasMissingInformation,
  hasNoRegion,
  hasNoAwsAccessKeyId,
  hasNoAwsSecretAccessKey,
  hasNoAwsUserPoolId,
} from "../utils/env";

const { Title } = Typography;

const AwsCard = ({ awsForm }) => {
  return (
    <>
      {hasMissingInformation && (
        <Card
          style={{
            width: 500,
            margin: "20px 0",
          }}
          title={<Title level={3}>AWS Credentials</Title>}
        >
          <Form form={awsForm} layout="horizontal">
            {hasNoRegion && (
              <Form.Item name="region">
                <Input placeholder="Region" />
              </Form.Item>
            )}
            {hasNoAwsAccessKeyId && (
              <Form.Item name="accessKeyId">
                <Input placeholder="Access Key Id" />
              </Form.Item>
            )}
            {hasNoAwsSecretAccessKey && (
              <Form.Item name="secretAccessKey">
                <Input placeholder="Secret Access Key" />
              </Form.Item>
            )}
            {hasNoAwsUserPoolId && (
              <Form.Item name="userPoolId">
                <Input placeholder="User Pool Id" />
              </Form.Item>
            )}
          </Form>
        </Card>
      )}
    </>
  );
};

export default AwsCard;
