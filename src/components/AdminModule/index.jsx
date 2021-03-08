import React, { useState, useEffect, useContext } from "react";

import {
  Layout,
  Breadcrumb,
  Menu,
  Dropdown,
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
  Drawer,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
  UserOutlined,
  DownOutlined
} from "@ant-design/icons";

import Uppy from '@uppy/core';
import 'uppy/dist/uppy.min.css';
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { Dashboard, useUppy } from '@uppy/react';

import { Context, AuthContext } from '../../context';
import "./adminModule.scss";

import SideNav from "../SideNav";
import MyVideos from "../MyVideos";
import AddVideo from "../AddVideo";
import MyProfile from "../MyProfile";
import UploadVideoFloatingBtn from "../Shared/UploadVideoFloatingBtn";

const AdminModule = (props) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;

  const [ellipsis, setEllipsis] = useState(true);
  const [addVideo, setAddvideo] = useState(false);
  const [selectedTab, setSelectedTab] = useState("my-videos");
  const [uploadVideo, setUploadVideo] = useState(false)

  const context = useContext(Context);
  const auth = useContext(AuthContext);

  const uppy = useUppy(() => {
    return new Uppy({
      meta: {
        userId: 5,
        foldername: 'Demo',
      }
    }).use(AwsS3Multipart, {
      limit: 4,
      companionUrl: 'http://182.142.97.42:3020/',
      getChunkSize(file) {
        var chunks = Math.ceil(file.size / (5 * 1024 * 1024));
        return file.size < 5 * 1024 * 1024 ? 5 * 1024 * 1024 : Math.ceil(file.size / (chunks - 1));
      }
    })
  });



  const closeUploadVideo = () => {
    setUploadVideo(false);
  }


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.reload();
  }

  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => setSelectedTab('my-proifle')}>
        My Profile
      </Menu.Item>
      <Menu.Item onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  useEffect(() => { }, [selectedTab]);

  const content = {
    "my-videos": <MyVideos />,
    "add-video": <AddVideo />,
    "my-profile": <MyProfile />,
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
                <Dropdown overlay={userMenu} trigger={['click']}>
                  <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{ color: 'white', }}>
                    <Avatar
                      size={30}
                      icon={<UserOutlined />}
                      style={{ marginRight: '5px' }}
                    /> My Account <DownOutlined />
                  </a>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
      <Layout style={{ paddingBottom: "50px" }}>

        <SideNav updateTab={(tab) => setSelectedTab(tab)} openUploadVideo={(toggle) => setUploadVideo(toggle)} />
        {content[selectedTab] ||
          "You do not have permissions to view this module"}

        <Drawer
          title="Upload Videos"
          placement="right"
          closable={true}
          onClose={closeUploadVideo}
          visible={uploadVideo}
          key="right"
          mask={false}
          className="uploadVideoDrawer"
        >
          <Dashboard
            uppy={uppy}
            showProgressDetails={true}
          />

        </Drawer>

        <UploadVideoFloatingBtn onClick={() => setUploadVideo(true)} />
      </Layout>
    </Layout >

  );
};

export default AdminModule;
