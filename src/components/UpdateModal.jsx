import React from "react";
import {
  Typography,
  Modal,
  Table,
  Form,
  Input,
  Select,
  Card,
  Button,
} from "antd";
import { DEFAULT_COLUMNS } from "../utils/table";

const { Title } = Typography;

const UpdateModal = ({
  userData,
  updateUsers,
  attributes,
  isModalVisible,
  setModalVisible,
}) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    const formValues = form.getFieldsValue();

    form.resetFields();

    updateUsers(userData, formValues.key, formValues.value ?? "");

    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const columns = DEFAULT_COLUMNS(true);

  return (
    <Modal
      open={isModalVisible}
      onCancel={handleCancel}
      width={"80%"}
      bodyStyle={{ height: "60vh", border: 0 }}
      footer={
        <Card>
          <Form
            form={form}
            layout="inline"
            colon={false}
            onFinish={onFinish}
            initialValues={{ key: attributes[0] }}
          >
            <Form.Item name="key" label="Set">
              <Select
                style={{
                  width: 300,
                }}
                options={attributes.map((attribute) => ({
                  value: attribute,
                  label: attribute,
                }))}
              />
            </Form.Item>
            <Form.Item name="value" label="to">
              <Input placeholder="value" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Card>
      }
    >
      <Title>Update Selected Users</Title>
      <Table
        dataSource={userData}
        columns={columns}
        scroll={{ x: columns.length * 200, y: "40vh" }}
        bodyStyle={{ height: "70vh" }}
      />
    </Modal>
  );
};

export default UpdateModal;
