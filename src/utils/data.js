import {
  DEFAULT_COLUMNS,
  EMPTY_CELL_VALUE,
  mapAttributesToColumns,
} from "./table";

export const getDataAndColumns = (
  userData,
  updateUser,
  sortedInfo,
  filteredInfo
) => {
  const { processedUserData, customAttributes } = processUserData(userData);

  const customColumns = mapAttributesToColumns(
    customAttributes,
    updateUser,
    processedUserData,
    filteredInfo
  );

  return {
    dataSource: processedUserData,
    attributes: customAttributes,
    columns: [
      ...DEFAULT_COLUMNS(false, sortedInfo, filteredInfo),
      ...customColumns,
    ],
  };
};

export const getUpdatedUserData = (username, key, value, userData) => {
  return userData.map((data) => {
    if (data.sub !== username) {
      return data;
    }

    return {
      ...data,
      [key]: value,
    };
  });
};

const processUserData = (data) => {
  const userDataObjects = data?.map((user) => user?.Attributes);

  const customAttributes = new Set();

  const processedUserData = userDataObjects?.map((userDataObject, index) => ({
    ...userDataObject.reduce((result, object) => {
      const objectName = object.Name;

      result[objectName] = object.Value;

      if (objectName.includes("custom:")) {
        customAttributes.add(objectName);
      }

      return result;
    }, {}),
    key: index,
  }));

  addMissingKeysToArrayOfObjects(processedUserData, customAttributes);

  return { processedUserData, customAttributes: Array.from(customAttributes) };
};

const addMissingKeysToArrayOfObjects = (arrayOfObjects, setOfKeys) => {
  for (let i = 0; i < arrayOfObjects?.length; i++) {
    const obj = arrayOfObjects[i];
    for (const key of setOfKeys) {
      if (!(key in obj)) {
        obj[key] = EMPTY_CELL_VALUE;
      }
    }
  }
};
