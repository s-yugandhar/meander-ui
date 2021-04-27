import React, { useContext, useState, useEffect } from "react";
import {
  Layout,  Row,  Divider,  Table,  Switch,
  Button,  Form,  Col,  Upload,  message,
  Input,  Select,} from "antd";
import {
  EditOutlined,  DeleteOutlined,  LinkOutlined,
  PlusOutlined,  ReloadOutlined,  FileImageOutlined,
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from "axios";
import { url } from "../API/index";

const Settings = () => {
  const { Content } = Layout;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handlePreview = (file) => {
    /* setSeePreview(true);
    setPreviewImage(file.thumbUrl); */
  };

  const handleUpload = (fileList) => {
    /* console.log(JSON.stringify(fileList));
    setFileList(fileList.fileList); */
  };

  const uploadButton = (
    <div>
      <FileImageOutlined />
      <div className="ant-upload-text">Upload Logo</div>
    </div>
  );

  const uploadButtonBanner = (
    <div>
      <FileImageOutlined />
      <div className="ant-upload-text">Upload Banner</div>
    </div>
  );


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
            <h2 className="page-title">Settings</h2>
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
        <Row>
          <Col span={24}>
            {/* Form Starts */}
            <Form
              name="basic"
              form={form}
              onFinish={(values) => console.log(values)}
              layout="vertical"
            >
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Company Name:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem">
                    <Input value="" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Logo
                </Col>
                <Col span={12} xs={12} md={16} lg={18}>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleUpload}
                    beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
                  >
                    {uploadButton}
                  </Upload>
                </Col>
              </Row>

              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Banner
                </Col>
                <Col span={12} xs={12} md={16} lg={18}>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleUpload}
                    beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
                  >
                    {uploadButtonBanner}
                  </Upload>
                </Col>
              </Row>

              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Header Background Color:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem">
                    <Input value="" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Email:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem">
                    <Input value="" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Mobile:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem">
                    <Input value="" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Password:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Button htmlType="button" type="dashed">
                    Change Password
                  </Button>
                </Col>
              </Row>
              <Divider />
              <Row style={{ marginTop: "20px" }}>
                <Col span={12} xs={12} md={8} lg={6}></Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Button htmlType="button" type="primary">
                    Save Settings
                  </Button>
                  <Button htmlType="reset" type="default" style={{marginLeft: '20px'}}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
            {/* Form Ends */}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Settings;
