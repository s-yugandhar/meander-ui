import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from 'axios';

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
  Empty
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
import Loading from '../Loading';
import {
  FOLDER_CREATED,
  FILE_UPLOADED,
  FOLDER_NAME
} from '../../reducer/types'
import { url, GetFolders, GetFiles } from "../API/index";
import { Context } from '../../Context';
import FolderCard from "../Shared/FolderCard";



const MyVideos = ({ updateTab, openUploadVideo }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;

  const [ellipsis, setEllipsis] = useState(true);
  const [addVideo, setAddvideo] = useState("");
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState(null);

  const { state, dispatch } = useContext(Context);

  const headersAuthorization = {
    headers: {
      'Authorization': 'bearer ' + state.token,
      Accept: "application/json",
    }
  }




  const container = {
    hidden: { opacity: 0, y: 5 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 },
  };

  const getFolders = () => {

    GetFolders(state.userId).then(res => {
      setFolders(res);
    });

  }


  const innerFolder = (folderName) => {
    setLoading(true);
    GetFiles(state.userId, folderName).then(res => {
      console.log('My Videos Files res - ', res);
      setFolders([]);
      setLoading(false);
      setFiles(res);
      /* dispatch({
        type: FOLDER_NAME,
        payload: {
          folderName: folderName
        }
      }); */
    }).catch(err => {
      setLoading(false);
    });

  }


  useEffect(() => {
    setLoading(true);
    updateTab = addVideo;
    console.log('All Videos updateTab - ', updateTab);

    getFolders();

  }, [state]);

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
        {
          // Show Folders
          folders.length > 0 || files.length > 0 ?
            <motion.div
              className="ant-row ant-row-stretch position-relative"
              variants={container}
              initial="hidden"
              animate="show"
            >

              {folders.length ? folders.map((folder, index) => {
                return (
                  <motion.div key={'folder-' + index} className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo" variants={item}>
                    <FolderCard folderName={folder.split('/')[0]} videosCount={0} folderOnClick={() => innerFolder(folder.split('/')[0])} />
                  </motion.div>
                )
              }
              ) :
                <Loading show={loading} />
              }


              {
                // Showing Files
                files.length ?
                  files.map((file, index) => (
                    <motion.div className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo" variants={item} key={'file-' + index}>
                      <VideoCard videoTitle={file.split('/')[1]} />
                    </motion.div>
                  )) : ""
              }

            </motion.div>
            : <Empty style={{ marginTop: '80px' }} />

        }
      </Content>
    </Layout>
  );
};

export default MyVideos;
