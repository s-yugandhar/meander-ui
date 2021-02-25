import React, { useState } from "react";
import "./addVideo.scss";

import {
  Divider,
  Layout,
  Row,
  Col,
  Form,
  Input,
  Button,
  Radio,
  Select,
  Upload,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

const AddVideo = () => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const [requiredMark, setRequiredMarkType] = useState("optional");
  const { Header, Footer, Sider, Content } = Layout;

  const onRequiredTypeChange = ({ requiredMark }) => {
    setRequiredMarkType(requiredMark);
  };

  return (
    <Layout style={{ padding: "24px" }}>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: "100vh",
        }}
      >
        <Row>
          <Col>
            <h3 className="page-title">Add New Video</h3>
          </Col>
        </Row>
        <Divider orientation="left" style={{ margin: "10px 0" }} />
        <Form
          form={form}
          layout="vertical"
          initialValues={{ requiredMark }}
          onValuesChange={onRequiredTypeChange}
          requiredMark={requiredMark}
        >
          <Row gutter={16} align="stretch">
            <Col span={24} sm={12}>
              <Form.Item
                label="Video Title"
                required
                requiredMark
                tooltip="Maximum 64 characters including spaces"
              >
                <Input placeholder="Enter video title" />
              </Form.Item>
              <Form.Item
                label="Video Description"
                tooltip="Maximum 2048 characters including spaces"
              >
                <Input.TextArea placeholder="Enter Description"></Input.TextArea>
              </Form.Item>
              <Form.Item
                label="Director(s)"
                tooltip="For multiple Directors use comma (,) seprated names"
              >
                <Input placeholder="Enter Director name" />
              </Form.Item>
              <Form.Item
                label="Producer(s)"
                tooltip="For multiple Producer use comma (,) after each name"
              >
                <Input placeholder="Enter Producer name" />
              </Form.Item>
              <Form.Item
                label="Maturity"
                tooltip="For multiple Producer use comma (,) after each name"
              >
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select Maturity"
                  optionFilterProp="children"
                  onChange=""
                  onFocus=""
                  onBlur=""
                >
                  <Option value="pg">PG</Option>
                  <Option value="13">13</Option>
                  <Option value="18+">18+</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Row className="upload-blocks">
                <Col width="100%" className="each-upload-block">
                  <div>
                    <Upload>
                      <Button icon={<UploadOutlined />} className="upload-btn">
                        Click to Upload Video
                      </Button>
                      <div className="infoBlock">
                        Accepted only .mp4, .avi, .mkv
                      </div>
                    </Upload>
                  </div>
                </Col>
                <Col width="100%" className="each-upload-block">
                  <div>
                    <Upload>
                      <Button icon={<UploadOutlined />} className="upload-btn">
                        Click to Upload Thumbnail
                      </Button>
                      <div className="infoBlock">
                        Accepted only .jpg, .png, .gif
                      </div>
                    </Upload>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row justify="center">
            <Col>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  style={{ paddingLeft: "20px", paddingRight: "20px" }}
                >
                  Add Video
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Content>
    </Layout>
  );
};

export default AddVideo;
