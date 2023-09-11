import React from "react";
import { Typography, Tag } from "antd";

export const EMPTY_CELL_VALUE = "-";

const { Paragraph } = Typography;

const SHADED_BACKGROUND_COLOR = "#1d1d1d";

const editableCellRenderer = (text, username, key, updateUserAttribute) => (
  <Paragraph
    style={{ margin: 0, cursor: "pointer" }}
    editable={{
      onChange: (value) => {
        if (value !== EMPTY_CELL_VALUE && value !== text) {
          updateUserAttribute(username, key, value);
        }
      },
      triggerType: "text",
    }}
  >
    {text}
  </Paragraph>
);

const cellRenderer = (text) => (
  <Paragraph style={{ margin: 0 }} strong>
    {text}
  </Paragraph>
);

const cellTagRenderer = (text) => (
  <Tag style={{ margin: 0 }} color={text === "true" ? "green" : "red"}>
    {text === "true" ? "Verified" : "Not Verified"}
  </Tag>
);

const getFilters = (userData, attribute) => {
  const filters = Array.from(new Set(userData.map((data) => data[attribute])));

  filters.sort((a, b) => a.localeCompare(b));

  return filters.map((attribute) => ({
    text: attribute,
    value: attribute,
  }));
};

export const mapAttributesToColumns = (
  attributes,
  updateUser,
  userData,
  filteredInfo
) =>
  attributes.map((attribute) => ({
    key: attribute,
    dataIndex: attribute,
    title: attribute,
    width: 80,
    filters: getFilters(userData, attribute),
    filteredValue: filteredInfo[attribute] || null,
    filterSearch: true,
    onFilter: (value, record) => {
      return record[attribute] === value;
    },
    render: (text, record) =>
      editableCellRenderer(text, record.sub, attribute, updateUser),
  }));

export const DEFAULT_COLUMNS = (
  functionsDisabled = false,
  sortedInfo = {},
  filteredInfo = {}
) => {
  const columns = [
    {
      key: "sub",
      dataIndex: "sub",
      title: "Username",
      width: 320,
      editable: false,
      sorter: (a, b) => a.sub.localeCompare(b.sub),
      sortOrder: sortedInfo.columnKey === "sub" ? sortedInfo.order : null,
      render: cellRenderer,
      onCell: () => ({
        style: {
          backgroundColor: SHADED_BACKGROUND_COLOR,
        },
      }),
    },
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
      width: 200,
      editable: false,
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === "email" ? sortedInfo.order : null,
      render: cellRenderer,
      onCell: () => ({
        style: {
          backgroundColor: SHADED_BACKGROUND_COLOR,
        },
      }),
    },
    {
      key: "email_verified",
      dataIndex: "email_verified",
      title: "Email Verified",
      width: 120,
      editable: false,
      filters: [
        {
          text: "Verified",
          value: "true",
        },
        {
          text: "Not Verified",
          value: "false",
        },
      ],
      filteredValue: filteredInfo.email_verified || null,
      onFilter: (value, record) => record.email_verified === value,
      render: cellTagRenderer,
      onCell: () => ({
        style: {
          backgroundColor: SHADED_BACKGROUND_COLOR,
          textAlign: "center",
        },
      }),
    },
    {
      key: "family_name",
      dataIndex: "family_name",
      title: "Family Name",
      width: 120,
      editable: false,
      sorter: (a, b) => a.family_name.localeCompare(b.family_name),
      sortOrder:
        sortedInfo.columnKey === "family_name" ? sortedInfo.order : null,
      render: cellRenderer,
      onCell: () => ({
        style: {
          backgroundColor: SHADED_BACKGROUND_COLOR,
        },
      }),
    },
    {
      key: "given_name",
      dataIndex: "given_name",
      title: "Given Name",
      width: 120,
      editable: false,
      sorter: (a, b) => a.given_name.localeCompare(b.given_name),
      sortOrder:
        sortedInfo.columnKey === "given_name" ? sortedInfo.order : null,
      render: cellRenderer,
      onCell: () => ({
        style: {
          backgroundColor: SHADED_BACKGROUND_COLOR,
        },
      }),
    },
  ];

  if (functionsDisabled) {
    columns.forEach((column) => {
      delete column.sortOrder;
      delete column.filteredValue;
    });
  }

  return columns;
};
