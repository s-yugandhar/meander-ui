import React, { useEffect, useState, useContext, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {  Layout, Menu,  Row,
  Col,  Divider,  Input,
  Select,  Typography,  Empty,
  Modal,  Form,  Button,
  message, Card ,
  notification,} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import VideoCard from "../Shared/VideoCard";
import "../MyVideos/MyVideos.scss";
import Loading from "../Loading";
import { EDIT_VIDEO , FOLDER_LIST, FILE_LIST, FOLDER_NAME, PAGE } from "../../reducer/types";
import { dbGetObjByPath ,url, GetFolders, GetFiles, CreateNewFolder } from "../API/index";
import { Context } from "../../context";
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
  const [toggleEmbed, setToggleEmbed] = useState(false);
  const [embedCode, setEmbedCode] = useState(null);

  const { state, dispatch } = useContext(Context);

  let initialAnimate;
  let animateOpen;

  const code = useRef(null);

  const headersAuthorization = {
    headers: {
      Authorization: "bearer " + state.token,
      Accept: "application/json",
    },
  };

  const container = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1,      y: 0,
      transition: { staggerChildren: 0.2,   },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 },
  };


  function countVideos(val) {
    let cnt = 0;
    state.folderList.map((obj, ind) => {
      //&& obj._object_name.includes(state.userId) === false
      if (obj._object_name.includes(val)) cnt = cnt + 1;
    });
    return cnt - 1;
  }

  const innerFolder = (folderName) => {
    setLoading(true);
    GetFiles(state,dispatch ,state.userId, folderName)
      .then((res) => {
        console.log("My Videos Files res - ", res);
        setLoading(false);
        dispatch({ type: FILE_LIST, payload: { fileList: res } });
        dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  // Show Embed code popup
  const embedPopup = (state,dispatch,obj) => {
    let temppath = obj.itempath;
    console.log( state.videoList );
    let dbobj = state.videoList.find((ob)=>ob.itempath === temppath );
    if( dbobj !== undefined){
    let frame = `<iframe src='${url}/${state.userId}/player/${dbobj.id}' width='560' 
    height='315' frameborder='0' allow=' autoplay; fullscreen; picture-in-picture' 
    allowfullscreen title='${dbobj.title}'></iframe>`;
    setToggleEmbed(true);
    setEmbedCode(frame); }
    else{
      notification.open({message:"Sorry, Embed code is not available now"});
    }
  };

  // close Embed Code Popup
  const closeEmbedPopup = () => {
    setToggleEmbed(false);
    setEmbedCode(null);
  };

  // Copy code to clipboard
  const copyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code.current.resizableTextArea.props.value);
      message.success("Code Copied");
    } else {
      alert("Sorry your browser does not support, please copy manually");
    }
  };

  // Go to Edit video page
  
  //window.addEventListener('load',(e)=>
  //{   GetFolders(state , dispatch,state.userId);
   //   if(state.folderList.length === 0 ) CreateNewFolder(state,dispatch,state.userId ,"default");
  //}) ;

  useEffect(() => {
    setLoading(true);
    updateTab = addVideo;
    console.log("All Videos updateTab - ", updateTab);
    dispatch({ type:"VIDEO_LIST" , payload : { videoList : []}})
    GetFolders(state , dispatch,state.userId);
      if(state.folderList === undefined ||
        (state.folderList !== undefined && state.folderList.length === 0) ) 
      CreateNewFolder(state,dispatch,state.userId ,"default");
  }, []);


  return (
    <>
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
              <h2 className="page-title">
                Videos in current folder - {state.videoList === undefined ? 0 : state.videoList.length}
              </h2>
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
          {  ( state.folderList !== undefined && state.folderList.length > 0) 
          || (state.fileList !== undefined && state.fileList.length > 0) ? (
            <motion.div
              className="ant-row ant-row-stretch position-relative"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {state.folderName === "" &&
                state.folderList.map((folder, index) => {
                  return folder._object_name.includes("temp.dod") ? (
                    <motion.div
                      key={"folder-" + index}
                      className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo"
                      variants={item}
                    >
                      <FolderCard
                        folderName={folder._object_name.split("/")[0]}
                        folderObject={folder}
                        userId={state.userId}
                        videosCount={countVideos(
                          folder._object_name.split("/")[0]
                        )}
                        folderOnClick={() =>
                          innerFolder(folder._object_name.split("/")[0])
                        }
                      />
                    </motion.div>
                  ) : null;
                })}

              {state.folderName === "" &&
                state.videoList.map((obj, index) => {
                  //&& folder._object_name.includes(state.userId) === false
                  return  (
                    <motion.div
                      className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo"
                      variants={item}
                      key={"file-" + index}
                    >
                      <VideoCard
                        videoTitle={ obj.title}
                        fileObject={obj}
                        userId={state.userId}
                        embedClick={() =>
                          embedPopup(state,dispatch,obj)
                        }
                        
                      />
                    </motion.div>
                  );
                })}

              {
                // Showing Files
                state.folderName !== "" && state.videoList.length > 0
                  ? state.videoList.map((file, index) => (
                      <motion.div
                        className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo"
                        variants={item}
                        key={"file-" + index}
                      >
                        <VideoCard
                          videoTitle={file.title}
                          fileObject={file}
                          userId={state.userId}
                          embedClick={() =>
                            embedPopup(state,dispatch,file)
                          }
                        />
                      </motion.div>
                    ))
                  : ""
              }
            <Divider></Divider>
              
            {/* 
            // build a board to provide to delete temporary files when upload fails
            <h2>{"Failed upload temporary files"}</h2>
              {
                // Showing Files
                 state.fileList.length > 0
                  ?  
                  state.fileList.map((file, index) => (
                     file._object_name.includes(state.userId) ?
                    <motion.div
                        className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 eachVideo"
                        variants={item}
                        key={"file-" + index}
                      >
                        <Card
                          title={file._object_name}
                        > 
                        <Button   onClick={(e)=>{ }}> "Delete"</Button>
                        </Card>
                      </motion.div>: null 
                    ))
                  : ""
              } */}


            </motion.div>
          ) : (
            <Empty style={{ marginTop: "80px" }} />
          )}
        </Content>
      </Layout>
      <Modal
        title="Your Video Embed Code"
        destroyOnClose={true}
        visible={toggleEmbed}
        onOk=""
        onCancel={closeEmbedPopup}
        footer={null}
      >
        <div className="embed-form">
          <div className="embed-info text-center">
            Copy below code and paste in your page
          </div>
          <div className="embed-code-block">
            <Input.TextArea
              readOnly={true}
              className="embed-code-input"
              rows="3"
              value={embedCode}
              ref={code}
            />
          </div>
          {navigator.clipboard ? (
            <div className="embed-copy-block">
              <Button
                type="primary"
                htmlType="button"
                size="large"
                className="embed-copy-btn"
                onClick={() => copyCode()}
              >
                Copy Code
              </Button>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default MyVideos;
