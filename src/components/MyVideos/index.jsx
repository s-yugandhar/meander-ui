import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const MyVideos = ({ updateTab }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;

  const [ellipsis, setEllipsis] = useState(true);
  const [addVideo, setAddvideo] = useState("");

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
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
          <motion.div className="ant-col-6 eachVideo" variants={item}>
            <VideoCard />
          </motion.div>
        </motion.div>
      </Content>
      <Tooltip placement="left" title="Upload New Video">
        <Button
          type="button"
          onClick={() => updateTab("add-video")}
          className="floating-btn add-new-video-btn"
        >
          <CloudUploadOutlined key="add-video" />
        </Button>
      </Tooltip>
    </Layout>
  );
};

export default MyVideos;
