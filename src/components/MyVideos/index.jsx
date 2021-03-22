import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import {  Layout,  Menu,  Row,  Col,  Divider,  Input,  Select,  Typography,  Empty} from "antd";
import {  EditOutlined,  DeleteOutlined,  LinkOutlined,  PlusOutlined,} from "@ant-design/icons";
import VideoCard from "../Shared/VideoCard";
import "../MyVideos/MyVideos.scss";
import Loading from '../Loading';
import { FOLDER_LIST  ,FILE_LIST , FOLDER_NAME } from '../../reducer/types';
import { url, GetFolders, GetFiles } from "../API/index";
import { Context } from '../../Context.jsx';
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
      dispatch({
        type: FOLDER_LIST,
        payload: {
          folderList: res
        }   });
    });

  }

  function countVideos(val){
    let cnt = 0;
    state.folderList.map((obj , ind)=>{
        if( obj._object_name.includes(val) && obj._object_name.includes(state.userId) === false  ) cnt = cnt + 1;
    });
    return cnt-1;
  }

  const innerFolder = (folderName) => {
    setLoading(true);
    GetFiles(state.userId, folderName).then(res => {
      console.log('My Videos Files res - ', res);
      setLoading(false);
       dispatch({ type: FILE_LIST,  payload: {  fileList: res    } });
       dispatch({ type: FOLDER_NAME,  payload: {  folderName: folderName    } }); 
    }).catch(err => {
      setLoading(false);
    });

  }


  useEffect(() => {
    setLoading(true);
    updateTab = addVideo;
    console.log('All Videos updateTab - ', updateTab);

    getFolders();

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
        <h2 className="page-title">Your Uploaded Videos - { state.folderList.length}</h2>
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
          state.folderList.length > 0 || state.fileList.length > 0 ?
            <motion.div
              className="ant-row ant-row-stretch position-relative"
              variants={container}
              initial="hidden"
              animate="show"
            >

              { state.folderName === '' && state.folderList.map((folder, index) => {

                return  folder._object_name.includes("temp.dod") ?    (
                  <motion.div key={'folder-' + index} className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo" variants={item}>
                    <FolderCard folderName={folder._object_name.split('/')[0]} videosCount={ countVideos(folder._object_name.split('/')[0])} folderOnClick={() => innerFolder(folder._object_name.split('/')[0])} />
                  </motion.div>
                ) : null
              })   }

              { state.folderName === '' && state.folderList.map((folder, index) => {

              return  folder._object_name.includes("temp.dod") === false && folder._object_name.includes(state.userId) === false   ?    (
                <motion.div className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo" variants={item} key={'file-' + index}>
                <VideoCard videoTitle={folder._object_name.split('/')[1]} />
              </motion.div>
        ) : null
              })   }

              {
                // Showing Files
                state.folderName !== '' && state.fileList.length > 0 ?
                  state.fileList.map((file, index) => (
                    <motion.div className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo" variants={item} key={'file-' + index}>
                      <VideoCard videoTitle={file._object_name.split('/')[1]} />
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
