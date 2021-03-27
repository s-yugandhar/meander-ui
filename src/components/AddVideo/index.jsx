import React, { useState, useContext, useEffect } from "react";
import "./addVideo.scss";
import {  Divider,  Layout,  Row,  Col,  Form,  Input,  Button,  Select,  Upload,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

import UppyUpload from "../UppyUpload";

const AddVideo = () => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const [requiredMark, setRequiredMarkType] = useState("optional");
  const { Header, Footer, Sider, Content } = Layout;


  /*  const uppy = new Uppy({
     id: 'videoUpload',
     autoProceed: false,
     allowMultipleUploads: true,
     debug: true,
     infoTimeout: 5000,
     meta: { userId: auth.userId }
   }).use(Tus, { endpoint: '' }); */

  /* uppy.use(Dashboard, {
    id: 'videoUpload',
    target: '#videoUpload',
    width: '100%',
    height: '100%'
  })
 */

  const onRequiredTypeChange = ({ requiredMark }) => {
    setRequiredMarkType(requiredMark);
  };

  const addVideo = () => { };

  useEffect(() => {
    return () => {
      //alert('Are you sure, do you want to leave');
    };
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
        <Row>
          <Col>
            <h3 className="page-title">Upload Video</h3>
          </Col>
        </Row>
        <Divider orientation="left" style={{ margin: "10px 0" }} />
        <Row>
          <Col span={24}>
            <UppyUpload height={350} width="100%" />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AddVideo;
