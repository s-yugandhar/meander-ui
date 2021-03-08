import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { PlusCircleFilled, CloudUploadOutlined } from "@ant-design/icons";

import {
  Layout,
  Breadcrumb,
  Menu,
  List,
  Avatar,
  Button,
  Skeleton,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Image,
  Card,
  Typography,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import VideoCard from "../Shared/VideoCard";
import "../MyVideos/MyVideos.scss";
import UploadVideoFloatingBtn from "../Shared/UploadVideoFloatingBtn";
import { url } from "../API/index";
import { AuthContext } from '../../context';

const MyVideos = ({ updateTab, openUploadVideo }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;

  const [ellipsis, setEllipsis] = useState(true);
  const [addVideo, setAddvideo] = useState("");

  const auth = useContext(AuthContext);

  const container = {
    hidden: { opacity: 0, y: 5 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    updateTab = addVideo;
    console.log('All Videos updateTab - ', updateTab);

    axios.post(url + '/list_objects?id=5&recursive=true', null, {
      headers: {
        accept: 'application/json'
      }
    })


  });

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
        <Row align="middle">
          <Col span={12}>
            <h2 className="page-title">Your Uploaded Videos</h2>
          </Col>
          <Col span={6} style={{ paddingRight: "15px" }}>
            {/* <Row justify="end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => updateTab("add-video")}
              >
                Add New
              </Button>
            </Row> */}
          </Col>
          <Col span={6}>
            <Search
              placeholder="Enter keyword..."
              allowClear
              onSearch=""
              enterButton
            />
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
        <motion.div
          className="ant-row"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default MyVideos;
