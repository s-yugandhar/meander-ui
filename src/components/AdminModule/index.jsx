import React, { useState, useEffect } from "react";

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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import SideNav from "../SideNav";
import MyVideos from "../MyVideos";
import AddVideo from "../AddVideo";

const AdminModule = () => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;

  const [ellipsis, setEllipsis] = useState(true);
  const [addVideo, setAddvideo] = useState(false);

  const [selectedTab, setSelectedTab] = useState("my-videos");

  useEffect(() => {}, [selectedTab]);

  const content = {
    "my-videos": <MyVideos />,
    "add-video": <AddVideo />,
  };

  return (
    <Layout>
      <Header className="header">
        <Row>
          <Col span={6}>
            <div style={{ color: "white" }}>Logo</div>
          </Col>
          <Col span={18}>
            <Row justify="end">
              <Col>
                <Button type="primary">Logout</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      <Layout style={{ paddingBottom: "50px" }}>
        <SideNav updateTab={(tab) => setSelectedTab(tab)} />
        {content[selectedTab] ||
          "You do not have permissions to view this module"}
      </Layout>
    </Layout>
  );
};

export default AdminModule;
