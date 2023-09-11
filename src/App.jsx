import React, { useState, useEffect, useCallback } from "react";
import { Table, Typography, message, Input, Row, Button, Form } from "antd";
import { ConfigProvider, theme } from "antd";
import { getDataAndColumns, getUpdatedUserData } from "./utils/data";
import {
  sendListUsersCommand,
  sendUpdateUserAttributesCommand,
  sendUpdateUsersAttributesCommand,
} from "./utils/cognitoClient";
import UpdateModal from "./components/UpdateModal";
import FilterCard from "./components/FilterCard";
import "./app.css";
import { SearchOutlined } from "@ant-design/icons";
import AwsCard from "./components/AwsCard";
import { fakeData } from "./fakedata";

const { Title } = Typography;

const { darkAlgorithm } = theme;

const STORAGE_KEY = "cognitoFilterSorter";

const App = () => {
  // Page State
  const [isPreview, setIsPreview] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();

  // Table State
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [filterInformation, setFilterInformation] = useState({});

  const [sortedInfo, setSortedInfo] = useState({});

  // Modal State
  const [isModalVisible, setModalVisible] = useState(false);

  // User Data State
  const [rawUserData, setRawUserData] = useState(undefined);

  const [userData, setUserData] = useState([]);

  const [userColumns, setUserColumns] = useState([]);

  const [attributes, setAttributes] = useState([]);

  // Search User Data State
  const [searchValue, setSearchValue] = useState("");

  const [filteredUserData, setFilteredUserData] = useState([]);

  // AWS Info State
  const [awsForm] = Form.useForm();

  // Store Filters and Sorters in localStorage
  const getFiltersSorters = () => {
    return (
      JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {
        filters: {},
        sorters: {},
      }
    );
  };

  const setFiltersSorters = (sorters, filters) => {
    const filterSorterObject = JSON.stringify({ filters, sorters });
    window.localStorage.setItem(STORAGE_KEY, filterSorterObject);
  };

  // Table and Row Handlers
  const handleTableChange = (_, filters, sorters) => {
    resetRowSelection();
    setSortedInfo(sorters);
    setFilterInformation(filters);
    setFiltersSorters(sorters, filters);
  };

  const resetTable = () => {
    handleTableChange(undefined, {}, {});
  };

  const handleRowSelectionChange = (keys, rows) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  const resetRowSelection = useCallback(() => {
    handleRowSelectionChange([], []);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectionChange,
  };

  const filterData = useCallback(
    (searchValue) => {
      resetRowSelection();

      if (searchValue === "") {
        setFilteredUserData(userData);
      }

      const searchWords = searchValue.toLowerCase().trim().split(" ");

      setFilteredUserData(
        userData?.filter((data) => {
          const lowerCaseUserData = Object.values(data)
            ?.filter((value) => typeof value === "string")
            ?.join(" ")
            ?.toLowerCase();

          return searchWords.every((word) => lowerCaseUserData.includes(word));
        })
      );
    },
    [resetRowSelection, userData]
  );

  const handleRefresh = () => {
    if (isPreview) {
      setUserData([]);

      setFilteredUserData([]);
    }

    setIsLoading(true);

    listUsers();
  };

  // Data APIs
  const listUsers = useCallback(async () => {
    try {
      let data = fakeData;

      if (!isPreview) {
        data = await sendListUsersCommand(awsForm.getFieldsValue());
      } else {
        setIsLoading(false);
      }

      messageApi.open({
        type: "success",
        content: "Users succesfully fetched!",
      });

      setRawUserData(data);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Failed to fetch users! " + error,
      });
      setIsLoading(false);
    } finally {
      resetRowSelection();
    }
  }, [awsForm, isPreview, messageApi, resetRowSelection]);

  const updateUser = useCallback(
    async (username, key, value) => {
      setIsLoading(true);

      setUserData((prevUserData) =>
        getUpdatedUserData(username, key, value, prevUserData)
      );
      setFilteredUserData((prevUserData) =>
        getUpdatedUserData(username, key, value, prevUserData)
      );

      try {
        if (!isPreview) {
          await sendUpdateUserAttributesCommand(
            awsForm.getFieldsValue(),
            username,
            key,
            value
          );
        }

        messageApi.open({
          type: "success",
          content: `${username}: ${key} updated to ${value} successfully!`,
        });

        if (!isPreview) {
          listUsers();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "Failed to update user! " + error,
        });
      }
    },
    [awsForm, listUsers, messageApi, isPreview]
  );

  const updateUsers = useCallback(
    async (users, key, value) => {
      setIsLoading(true);

      for (let i = 0; i < users.length; i++) {
        setUserData((prevUserData) =>
          getUpdatedUserData(users[i].sub, key, value, prevUserData)
        );
        setFilteredUserData((prevUserData) =>
          getUpdatedUserData(users[i].sub, key, value, prevUserData)
        );
      }

      try {
        if (!isPreview) {
          await sendUpdateUsersAttributesCommand(
            awsForm.getFieldsValue(),
            users,
            key,
            value
          );
        }

        messageApi.open({
          type: "success",
          content: "Users succesfully updated!",
        });

        if (!isPreview) {
          listUsers();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "Failed to update users! " + error,
        });
      }
    },
    [awsForm, listUsers, messageApi, isPreview]
  );

  // React Hooks
  useEffect(() => {
    const { filters, sorters } = getFiltersSorters();

    setFilterInformation(filters);

    setSortedInfo(sorters);

    // Redirect all other urls to origin
    if (
      window.location.pathname !== "/preview" &&
      window.location.pathname !== "/"
    ) {
      window.location.pathname = "/";
    }

    if (window.location.pathname === "/preview") {
      setIsPreview(true);
    } else {
      // https://legacy.reactjs.org/docs/strict-mode.html#ensuring-reusable-state
      listUsers(); // Called twice on render due to <React.StrictMode>
    }
  }, [listUsers]);

  useEffect(() => {
    filterData(searchValue);
  }, [filterData, searchValue, userData]);

  useEffect(() => {
    if (isPreview) {
      listUsers();
    }
  }, [listUsers, isPreview]);

  useEffect(() => {
    if (!rawUserData) {
      return;
    }

    const { dataSource, columns, attributes } = getDataAndColumns(
      rawUserData,
      updateUser,
      sortedInfo,
      filterInformation
    );

    if (isPreview && userData.length === 0) {
      setUserData(dataSource);
    }

    setUserColumns(columns);

    setAttributes(attributes);

    setIsLoading(false);
  }, [
    rawUserData,
    sortedInfo,
    filterInformation,
    listUsers,
    updateUser,
    isPreview,
    userData.length,
  ]);

  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      {contextHolder}
      <div className="heading">
        <Title>
          {isPreview ? "Cognito Dashboard Preview" : "Cognito Dashboard"}
        </Title>
        <Button
          onClick={() =>
            (window.location.pathname = isPreview ? "/" : "/preview")
          }
          disabled={isLoading}
        >
          {!isPreview ? "Enter Preview Mode" : "Leave Preview Mode"}
        </Button>
      </div>
      <div className="main-content">
        <Row justify="space-between">
          <FilterCard
            filterInformation={filterInformation}
            setModalVisible={setModalVisible}
            selectedRows={selectedRows}
            resetTable={resetTable}
          />
          {!isPreview && <AwsCard awsForm={awsForm} />}
        </Row>
        <Row justify="space-between">
          <Input
            prefix={<SearchOutlined />}
            style={{ margin: "20px 0", width: "600px" }}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
          ></Input>
          <Button onClick={handleRefresh} style={{ margin: "20px 0" }}>
            Refresh
          </Button>
        </Row>
        <Table
          loading={isLoading}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          columns={userColumns}
          dataSource={filteredUserData}
          scroll={{ x: userColumns.length * 200 }}
          pagination={false}
        />
        <UpdateModal
          userData={selectedRows}
          updateUsers={updateUsers}
          attributes={attributes}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      </div>
    </ConfigProvider>
  );
};

export default App;
