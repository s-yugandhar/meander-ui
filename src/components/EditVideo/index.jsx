import React from "react";
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
  Switch,
  Tooltip,
} from "antd";

import {
  ReloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./editVideo.scss";

const EditVideo = () => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Option } = Select;
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
        <Row align="stretch">
          <Col span={10}>
            <div className="editVideoFormBlock full-width">
              <Form
                name="basic"
                initialValues={{}}
                onFinish=""
                layout="vertical"
              >
                <h3>
                  <strong>General Info</strong>
                </h3>
                <Form.Item
                  label="Video Title"
                  name="folderName"
                  className="editFormItem"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Video Description"
                  name="folderName"
                  className="editFormItem"
                >
                  <Input.TextArea rows="3" />
                </Form.Item>
                <Form.Item
                  label="Video Maturity"
                  name="folderName"
                  className="editFormItem"
                >
                  <Select
                    showSearch
                    placeholder="Select Maturity"
                    onChange=""
                    onFocus=""
                    onBlur=""
                    onSearch=""
                  >
                    <Option value="u">U</Option>
                    <Option value="pg">PG</Option>
                    <Option value="a">A</Option>
                    <Option value="18+">18+</Option>
                  </Select>
                </Form.Item>
                <Divider />
                <h3>
                  <strong>Privacy</strong>
                  <Switch
                    defaultChecked
                    onChange=""
                    style={{ marginLeft: "20px" }}
                  />
                </h3>
                <Form.Item
                  label="Who can see?"
                  name="folderName"
                  className="editFormItem"
                >
                  <Select
                    showSearch
                    placeholder="Select Maturity"
                    onChange=""
                    onFocus=""
                    onBlur=""
                    onSearch=""
                  >
                    <Option value="u">Shared</Option>
                    <Option value="pg">Loggedin</Option>
                    <Option value="a">EveryOne</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <div style={{ float: "right" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      disabled=""
                    >
                      Update Information
                    </Button>
                  </div>
                  <div style={{ float: "left", paddingTop: "5px" }}>
                    <Button
                      type="ghost"
                      danger
                      htmlType="button"
                      size="middle"
                      disabled=""
                      style={{ marginRight: "5px" }}
                    >
                      <Tooltip title="Delete Video">
                        <DeleteOutlined />
                      </Tooltip>
                    </Button>
                    <Button
                      type="ghost"
                      htmlType="button"
                      size="middle"
                      disabled=""
                      className="ant-btn-warning"
                    >
                      Replace Video <ReloadOutlined />
                    </Button>
                  </div>
                </Form.Item>

                <Form.Item></Form.Item>
              </Form>
            </div>
          </Col>
          <Col span={1} />
          <Col span={13}>
            <div className="full-width edit-video-block">
              <h3>
                <strong>Your Video</strong>
              </h3>
              <div className="video-container">
                <video className="video" />
              </div>
              <div className="edit-video-actions">
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="small"
                  style={{ float: "right" }}
                  shape="round"
                  ghost
                >
                  Download
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default EditVideo;
