import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Typography,
  Empty,
  Modal,
  Form,
  Button,
  message,
  Card,
  notification,
  Table,
  Tag,
  Space,
  Switch,
  Tooltip,
  Badge,
  Tabs,
  Collapse,
} from "antd";

import { CloudDownloadOutlined, PrinterOutlined } from "@ant-design/icons";

const MyBilling = (props) => {
  const { Option } = Select;
  const { Panel } = Collapse;

  const callback = (key) => {
    console.log("Accordion Key - ", key);
  };

  return (
    <>
      <Layout className="main page-layout">
        <Row
          className="p-15"
          align="middle"
          style={{ backgroundColor: "#fff" }}
        >
          <Col span="12" style={{ fontSize: "18px", fontWeight: "600" }}>
            My Billing
          </Col>
          <Col
            span="12"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button type="default" style={{ marginLeft: "10px" }}>
              <CloudDownloadOutlined />
              Download CSV
            </Button>
            <Button type="default" style={{ marginLeft: "10px" }}>
              <PrinterOutlined />
              Print
            </Button>
          </Col>
        </Row>
        <Row className="my-15 pb-2" style={{ borderBottom: "1px solid #ddd" }}>
          <Col span="6">
            <Select defaultValue="aug" style={{ width: "100%" }}>
              <Option value="aug">August 2021</Option>
              <Option value="sep">September 2021</Option>
              <Option value="oct">October 2021</Option>
            </Select>
          </Col>
          <Col span="6"></Col>
          <Col
            span="12"
            style={{ textAlign: "right", fontSize: "20px", fontWeight: "600" }}
          >
            Estimated Total - Rs.20,000
          </Col>
        </Row>
        <Row className="mb-1">
          <Col span="24" style={{ fontSize: "18px", color: "#999" }}>
            Your invoiced total will be displayed once an invoice is issued.
          </Col>
        </Row>
        <Row className="pb-1 mb-15" style={{ borderBottom: "1px solid #ddd" }}>
          <Col span="24" style={{ fontSize: "24px", fontWeight: "600" }}>
            Meander Service Charges
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Collapse defaultActiveKey={["1"]} onChange={callback}>
              <Panel header="Data Transfer" key="1">
                <Collapse defaultActiveKey={["11"]} onChange={callback}>
                  <Panel header="India" key="11">
                    <Row>
                      <Col
                        span="24"
                        className="pb-1"
                        style={{
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <strong>Bandwidth</strong>
                      </Col>
                      <Col span="24">
                        <Row className="mt-1">
                          <Col span="18">
                            â‚¹2 per GB of data transferred out per month
                          </Col>
                          <Col span="6" style={{ textAlign: "right" }}>
                            200GB
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="Cloud Storage" key="2">
                <Collapse defaultActiveKey={["21"]} onChange={callback}>
                  <Panel header="India" key="21">
                    <Row>
                      <Col
                        span="24"
                        className="pb-1"
                        style={{
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <strong>Storage</strong>
                      </Col>
                      <Col span="24">
                        <Row className="mt-1">
                          <Col span="18">
                            â‚¹2 per GB of data transferred out per month
                          </Col>
                          <Col span="6" style={{ textAlign: "right" }}>
                            200GB
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </Panel>
              <Panel header="NSFW Filters" key="3">
                <Collapse defaultActiveKey={["31"]} onChange={callback}>
                  <Panel header="India" key="31">
                    <Row>
                      <Col
                        span="24"
                        className="pb-1"
                        style={{
                          borderBottom: "1px solid #ddd",
                        }}
                      >
                        <strong>NSFW API</strong>
                      </Col>
                      <Col span="24">
                        <Row className="mt-1">
                          <Col span="18">
                            â‚¹2 per minute of videos processed per month
                          </Col>
                          <Col span="6" style={{ textAlign: "right" }}>
                            2000 min.
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Panel>
                </Collapse>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default MyBilling;
