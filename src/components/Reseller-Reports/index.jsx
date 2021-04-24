import React, { useContext, useState, useEffect } from "react";
import {
  Layout,
  Row,
  Divider,
  Table,
  Switch,
  Button,
  Form,
  Col,
  Upload,
  message,
  Input,
  Select,
  Progress,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from "axios";
import { url } from "../API/index";
import "./reseller-reports.scss";

const ResellerReports = () => {
  const { Content } = Layout;
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    console.log("Storage - ", state.userObj.originsize / 4096);

    return () => {};
  }, []);

  return (
    <Layout className="main">
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: "100vh",
        }}
      >
        <Row align="middle">
          <Col span={12}>
            <h2 className="page-title">Reports</h2>
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
        <Row>
          <Col span={24}>
            {/* Form Starts */}
            <Row gutter={24}>
              <Col span={24} md={12}>
                <div className="each-report-block full-width">
                  <h2 className="each-report-title full-width">
                    <strong>Storage Usage</strong>
                  </h2>
                  <div className="full-width">
                    {state.userObj && state.userObj.originsize ? (
                      <>
                        <div className="full-width storage-capacity-block">
                          {(state.userObj.originsize / 4096).toFixed(0)}
                          GB / 1000000GB
                        </div>
                        <div className="full-width storage-current-block">
                          <Progress
                            strokeColor={{
                              from: "#43A047",
                              to: "#43A047",
                            }}
                            percent={65}
                          />
                        </div>{" "}
                      </>
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col span={24} md={12}>
                <div className="each-report-block full-width">
                  <h2 className="each-report-title full-width">
                    <strong>BandWidth</strong>
                  </h2>
                  <div className="full-width">
                    {state.userObj && state.userObj.originserved ? (
                      <>
                        <div className="full-width storage-capacity-block">
                          {(state.userObj.originserved / 4096).toFixed(0)}
                          GB / 1000000GB
                        </div>
                        <div className="full-width storage-current-block">
                          <Progress
                            strokeColor={{
                              from: "#43A047",
                              to: "#43A047",
                            }}
                            percent={40}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Form Ends */}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ResellerReports;
