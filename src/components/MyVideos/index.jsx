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
import FolderCard from "../Shared/FolderCard";
import Loading from "../Loading";

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


  const auth = useContext(AuthContext);

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

  const getFolders = (recursive) => {

    axios.post(url + '/list_objects?id=' + auth.userId + '&recursive=' + recursive, null, {
      headers: {
        accept: 'application/json',
      }
    }).then(res => {
      console.log('get folders res - ', res.data);
      let tempFolders = [];
      res.data.map(Ob => {
        if (Ob._object_name.includes('temp.dod')) {
          tempFolders.push(Ob._object_name);
        }
      });
      setFolders(tempFolders);
      setLoading(false);
    })
  }


  const innerFolder = (folderName) => {
    axios.post(url + '/list_objects?id=' + auth.userId + '&foldername=' + folderName + '&recursive=false', null, {
      headers: {
        accept: 'application/json',
      }
    }).then(res => {
      console.log('get files res - ', res.data);
      let tempFiles = [];
      let tempFold = [];
      res.data.map(Ob => {
        if (!Ob._object_name.includes('temp.dod')) {
          tempFiles.push(Ob._object_name);
        } else {
          tempFold.push(Ob._object_name);
        }
      });
      setFiles(tempFiles);
      console.log('Temp Fold - ', tempFold);
      setFolders([]);
      setLoading(false);
      console.log('Files res - ', tempFiles);
    })
  }

  const del = () => {
    axios.get(url + '/users/' + auth.userId, null, {
      headers: {
        Authorization: 'Bearer ' + auth.token,
        accept: 'application/json'
      }
    }).then(res => {
      console.log('User Detials - ', res);
    })
  }



  useEffect(() => {
    setLoading(true);
    updateTab = addVideo;
    console.log('All Videos updateTab - ', updateTab);

    getFolders(true);
    del();

  }, []);

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
            <Loading show={loading} />}


          {files.map((file, index) => (
            <motion.div className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo" variants={item} key={'file-' + index}>
              <VideoCard videoTitle={file.split('/')[1]} />
            </motion.div>
          ))
          }




        </motion.div>
      </Content>
    </Layout>
  );
};

export default MyVideos;
