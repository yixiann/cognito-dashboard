import React from "react";
import { Typography, Card, Button, Row, Col } from "antd";
import { isObjectEmptyOrAllNullValues, makePlural } from "../utils/utils";

const { Title, Paragraph } = Typography;

const FilterCard = ({
  filterInformation,
  setModalVisible,
  selectedRows,
  resetTable,
}) => {
  const hasUserSelectedRows = selectedRows.length > 0;

  const hasUserAppliedFilters =
    !isObjectEmptyOrAllNullValues(filterInformation);

  const hasUserPerformedAction = hasUserSelectedRows || hasUserAppliedFilters;

  const attributeArray = Object.entries(filterInformation).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <Card
      style={{
        width: 500,
        margin: "20px 0",
      }}
      title={<Title level={3}>Filters Applied</Title>}
    >
      {!hasUserPerformedAction ? (
        <FilterCardEmpty />
      ) : (
        <FilterCardContent
          attributeArray={attributeArray}
          selectedRows={selectedRows}
          setModalVisible={setModalVisible}
          hasUserAppliedFilters={hasUserAppliedFilters}
          resetTable={resetTable}
        />
      )}
    </Card>
  );
};

const FilterCardEmpty = () => (
  <Col>
    <Paragraph
      style={{
        textAlign: "center",
        padding: "15px 0 20px",
      }}
    >
      Apply filters and select rows to update users in batches
    </Paragraph>
    <Card style={{ textAlign: "center" }}>
      Note: custom attributes can be updated from the table
    </Card>
  </Col>
);

const FilterCardContent = ({
  hasUserAppliedFilters,
  attributeArray,
  selectedRows,
  setModalVisible,
  resetTable,
}) => (
  <Col
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minHeight: "143px",
    }}
  >
    {hasUserAppliedFilters &&
      attributeArray.map(([key, value]) => (
        <Row key={key} justify="space-between">
          <Paragraph>{key}</Paragraph>
          <Paragraph>{value ? value.toString() : "-"}</Paragraph>
        </Row>
      ))}

    <Paragraph style={{ textAlign: "center", padding: "15px 0 20px" }}>
      {`${selectedRows.length} 
          ${makePlural("row", selectedRows.length)} selected`}
    </Paragraph>

    <Row justify="space-between">
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        disabled={selectedRows.length === 0}
      >
        Update Selected Rows
      </Button>
      <Button type="primary" onClick={resetTable}>
        Reset Selection
      </Button>
    </Row>
  </Col>
);

export default FilterCard;
