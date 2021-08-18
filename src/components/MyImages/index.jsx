import React, { useEffect, useState, useContext, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Layout,
  Menu,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Typography,
  Empty,
  Modal,
  Form,
  Button,
  message,
  Card,
  notification,
  Table,
  Tag,
  Space,
  Switch,
  Tooltip,
  Badge,
  Tabs,
} from "antd";

import {
  InfoCircleOutlined,
  FolderOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FolderAddOutlined,
  CloudUploadOutlined,
  RightOutlined,
} from "@ant-design/icons";
import VideoCard from "../Shared/VideoCard";
import "./MyImages.scss";
import Loading from "../Loading";
import { FILE_LIST, FOLDER_NAME } from "../../reducer/types";
import {
  url,
  GetFolders,
  dbGetObjByPath,
  GetFiles,
  GetUserdetails,
  CreateNewFolder,
  listPlaylist,
  createPlaylist,
  getPublicItems,
} from "../API/index";
import { Context } from "../../context";
import FolderCard from "../Shared/FolderCard";
import UppyUpload from "../UppyUpload";

const MyImages = ({ updateTab, openUploadVideo }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;
  const [ellipsis, setEllipsis] = useState(true);
  const [addVideo, setAddvideo] = useState("");
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState(null);
  const [buildRoles, setBuildRoles] = useState(false);
  const [toggleEmbed, setToggleEmbed] = useState(false);
  const [embedCode, setEmbedCode] = useState(null);
  const [folderSubmitBtn, setFolderSubmitBtn] = useState(false);
  const [cModal, setCModal] = useState(false);
  const { state, dispatch } = useContext(Context);
  const [sortState, setSortState] = useState(null);
  const [nfApi, setNFApi] = useState(false);
  const { Column } = Table;

  const [tabActive, setTabActive] = useState("videos");

  const { TabPane } = Tabs;

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
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  };

  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 },
  };

  function countVideos(val) {
    let cnt = 0;
    state.videoList.map((obj, ind) => {
      //&& obj._object_name.includes(state.userId) === false
      if (obj.itempath.includes("/" + val + "/")) cnt = cnt + 1;
    });
    return cnt;
  }

  const innerFolder = (folderName) => {
    setLoading(true);
    if (folderName === "All") {
      GetFolders(state, dispatch, state.userId);
      return;
    }
    if (folderName === "") folderName = "default";
    GetFiles(state, dispatch, state.userId, folderName)
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
  /* const embedPopup = (state, dispatch, obj) => {
    let temppath = obj.itempath;

    console.log(state.videoList);
    let dbobj = state.videoList.find((ob) => ob.itempath === temppath);
    console.log(dbobj);
    if (dbobj !== undefined) {
      let frame = `<iframe src='${url}/watch/${state.userId}/${dbobj.id}?embed=true' width='1920'
    height='1080' frameborder='0' allow=' autoplay; fullscreen; picture-in-picture'
    allowfullscreen title='${dbobj.title}'></iframe>`;
      setToggleEmbed(true);
      setEmbedCode(frame);
    } else {
      notification.open({ message: "Sorry, Embed code is not available now" });
    }
  }; */

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

  const showCreateFolder = () => {
    setCModal(true);
  };

  const createFolderModalClose = () => {
    setCModal(false);
  };

  const callCreateFolder = (values) => {
    console.log(state);
    CreateNewFolder(state, dispatch, state.userId, values.folderName);

    createPlaylist(state, dispatch, values.folderName, "folder")
      .then((res) => {
        //notification.open({message:"Folder Created succesfully"});
        listPlaylist(state, dispatch);
      })
      .catch(
        (err) => {}
        //notification.open({message:"Cannot create duplicate folder"});
      );
    createFolderModalClose();
  };

  useEffect(() => {
    const uobj = state.userObj;

    if (buildRoles) {
      if (uobj !== null && uobj !== undefined) {
        const VL = [];
        state.videoList.map((ob) => {
          if (uobj.access !== undefined && uobj.access !== null) {
            if (uobj.access.admin.includes(ob.owner_id)) ob.userRole = "admin";
            if (uobj.access.user.includes(ob.owner_id)) ob.userRole = "user";
            if (uobj.access.viewer.includes(ob.owner_id))
              ob.userRole = "viewer";
          }
          if (uobj.userId === ob.owner_id) ob.userRole = "admin";
          if (uobj.roles === "user") ob.userRole = "user";
          if (uobj.roles === "viewer") ob.userRole = "viewer";
          //if(uobj.roles === "super_admin" || uobj.roles === "reseller") ob.userRole = "admin";
          console.log(ob.userRole);
          VL.push(ob);
        });
        dispatch({ type: "VIDEO_LIST", payload: { videoList: VL } });
        setBuildRoles(false);
      }
    }
  }, [buildRoles]);

  useEffect(() => {
    let filterType = state.filterType;
    if (filterType === "all" || filterType === "folder")
      GetFolders(state, dispatch, state.userId);
    if (filterType === "audio" || filterType === "video")
      GetFiles(state, dispatch, state.userId, state.folder.id);
  }, [state.filterType]);

  useEffect(() => {
    //setFilterType("all");
    dispatch({ type: "FILTER_TYPE", payload: { filterType: "video" } });
    console.log("Folder type - ", state.filterType);
    console.log("Folders list - ", state.dbfolderList);
  }, [state.folder.id]);

  useEffect(() => {
    setLoading(true);
    listPlaylist(state, dispatch).then((res) => {
      if (state.dbfolderList.length === 0)
        createPlaylist(state, dispatch, "default", "folder");
    });
    updateTab = addVideo;
    console.log("All Videos updateTab - ", updateTab);
    dispatch({ type: "VIDEO_LIST", payload: { videoList: [] } });
    GetFolders(state, dispatch, state.userId);
    GetUserdetails(state, dispatch, state.userId);
    console.log("State - ", state);
  }, []);

  const sortvideoList = () => {
    console.log(sortState);
    if (sortState === null) return;
    let temp = [];
    if (sortState === "asc")
      temp = state.videoList.sort(
        (a, b) => Number(a.updatetime) - Number(b.updatetime)
      );
    if (sortState === "desc")
      temp = state.videoList.sort(
        (a, b) => Number(b.updatetime) - Number(a.updatetime)
      );
    dispatch({ type: "VIDEO_LIST", payload: { videoList: temp } });
  };

  const triggerSearch = (value) => {
    let key = value.target.value;
    let temp = [];
    temp = state.videoList.sort((a, b) => {
      return a.title.includes(key) ? -1 : b.title.includes(key) ? 1 : 0;
    });
    dispatch({ type: "VIDEO_LIST", payload: { videoList: temp } });
  };

  const folderDetail = (folderName) => {
    dispatch({ type: "PAGE", payload: { page: "videos" } });
    dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
    dbGetObjByPath(
      state,
      dispatch,
      "bucket-" + state.userId + "/" + folderName,
      true
    );
    GetFiles(state, dispatch, state.userId, folderName).then((res) => {
      console.log("My Videos Files in sidenav - ", res);
      dispatch({ type: FILE_LIST, payload: { fileList: res } });
    });
  };

  return (
    <>
      <Layout className="main page-layout">
        <Row className="p-15 bg-white">
          <Col span="12" className="foldersLinksList">
            <Button
              type="link"
              className={
                tabActive === "videos"
                  ? "fodlerLinkItem active"
                  : "fodlerLinkItem"
              }
              onClick={() => setTabActive("videos")}
            >
              All Videos
            </Button>

            <Button
              type="link"
              className={
                tabActive === "folders"
                  ? "fodlerLinkItem active"
                  : "fodlerLinkItem"
              }
              onClick={() => setTabActive("folders")}
            >
              Folders
            </Button>

            <Button
              type="link"
              className={
                tabActive === "channels"
                  ? "fodlerLinkItem active"
                  : "fodlerLinkItem"
              }
              onClick={() => setTabActive("channels")}
            >
              Channels
            </Button>
          </Col>

          <Col
            span="12"
            style={{ textAlign: "right" }}
            className="foldersLinksList"
          >
            <Button type="link" className="fodlerLink">
              New Channel
            </Button>

            <Button
              type="link"
              className="fodlerLink"
              onClick={showCreateFolder}
            >
              New Folder
            </Button>

            <Button
              type="link"
              className="fodlerLink"
              onClick={() => setTabActive("upload")}
            >
              Upload Video
            </Button>
          </Col>
        </Row>

        <Content className="">
          {(state.folderList !== undefined && state.folderList.length > 0) ||
          (state.fileList !== undefined && state.videoList.length > 0) ? (
            <motion.div
              className="ant-column ant-row-stretch "
              variants={container}
              initial="hidden"
              animate="show"
            >
              {tabActive && tabActive === "folders" ? (
                <Row>
                  <Col span="24">
                    <Row align="middle" style={{ paddingTop: "10px" }}>
                      <Col>
                        <Button
                          type="link"
                          style={{ paddingLeft: "10px", paddingRight: "10px" }}
                        >
                          Folders
                        </Button>
                      </Col>
                      <Col style={{ fontSize: "13px", color: "#888" }}>
                        <RightOutlined color="#888" />
                      </Col>
                      <Col
                        style={{
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        Folder Name
                      </Col>
                    </Row>
                  </Col>
                  <Col span="24">
                    <Row className="py-2" align="middle">
                      <Col span="4" className="">
                        <Select
                          defaultValue="dateModified"
                          style={{ width: "100%" }}
                          onChange=""
                        >
                          <Option value="dateModified">Date Modified</Option>
                          <Option value="">Date Added</Option>
                          <Option value="">By Title</Option>
                        </Select>
                      </Col>
                      <Col span="16" className=""></Col>
                      <Col
                        span="4"
                        className="text-right"
                        style={{ color: "#777" }}
                      >
                        Total Videos - 1000
                      </Col>
                      <Divider
                        orientation="left"
                        className="mt-2 mb-0"
                      ></Divider>
                    </Row>
                  </Col>
                  <Col>
                    <Row gutter={15}>
                      {state.dbfolderList.map((folder, index) => {
                        return folder.foldertype === "folder" ? (
                          <Col
                            key={"folder-" + index}
                            className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 mb-15"
                          >
                            <FolderCard
                              folderName={folder.foldername}
                              userId={state.userId}
                              videosCount={0}
                              folderOnClick={() => innerFolder(folder)}
                            />
                          </Col>
                        ) : (
                          <Empty style={{ marginTop: "80px" }} />
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              ) : tabActive === "videos" ? (
                <>
                  <Row
                    style={{
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "15px",
                      paddingTop: "15px",
                    }}
                  >
                    {" "}
                    <Col span="6">
                      <Select
                        size="medium"
                        style={{ width: "100%" }}
                        placeholder="search folder"
                        optionFilterProp="children"
                        showSearch={true}
                        value={
                          state.folder.id === "" ? "default" : state.folder.id
                        }
                        onChange={(value) => {
                          dispatch({
                            type: FOLDER_NAME,
                            payload: { folderName: value },
                          });
                          if (state.folder.id !== "")
                            GetFiles(
                              state,
                              dispatch,
                              state.userId,
                              state.folder.id
                            );
                        }}
                      >
                        {state.dbfolderList !== undefined &&
                        state.dbfolderList !== null
                          ? state.dbfolderList.map((obj, ind) => {
                              return obj.foldertype === "folder" ? (
                                <>
                                  {" "}
                                  <Option key={obj.id} value={obj.id}>
                                    {" "}
                                    {obj.foldername}
                                    {"   "}{" "}
                                  </Option>{" "}
                                </>
                              ) : null;
                            })
                          : null}
                      </Select>
                    </Col>
                    <Col span="12"></Col>
                    <Col span="6"></Col>
                  </Row>
                  <Row gutter={15} className="py-2">
                    {state.folder.id === "" &&
                      state.videoList.map((obj, index) => {
                        return state.filterType === "all" ||
                          obj.itemtype.includes(state.filterType) ? (
                          <Col
                            className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 mb-15"
                            key={"file-" + index}
                          >
                            <VideoCard
                              videoTitle={obj.title}
                              fileObject={obj}
                              userId={state.userId}
                            />
                          </Col>
                        ) : null;
                      })}
                  </Row>
                  <Row gutter={15} className="py-2">
                    {
                      // Showing Files
                      state.folder.id !== "" && state.videoList.length > 0
                        ? state.videoList.map((file, index) => {
                            return state.filterType === "all" ||
                              file.itemtype.includes(state.filterType) ? (
                              <Col
                                className="ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 mb-15"
                                variants={item}
                                key={"file-" + index}
                              >
                                <VideoCard
                                  videoTitle={file.title}
                                  fileObject={file}
                                  userId={state.userId}
                                />
                              </Col>
                            ) : (
                              <Empty style={{ marginTop: "80px" }} />
                            );
                          })
                        : ""
                    }
                  </Row>
                </>
              ) : tabActive === "upload" ? (
                <Col span="24">
                  <Row className="py-2">
                    <Col span="24" className="uploadVideoTitle">
                      Upload Video
                    </Col>
                  </Row>
                  <Row className="py-2 bg-white">
                    <Col span="16" push="4">
                      <UppyUpload />
                    </Col>
                  </Row>
                </Col>
              ) : (
                <Empty style={{ marginTop: "80px" }} />
              )}
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
      <Modal
        title="Create New Folder"
        destroyOnClose={true}
        visible={cModal}
        onOk=""
        onCancel={createFolderModalClose}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{}}
          onFinish={callCreateFolder}
          layout="vertical"
        >
          {/*errMsg ? (
            <Alert   message={errMsg}
              closable type="error"
              onClose={() => setErrMsg(null)}
              style={{ marginBottom: "20px" }}
            />
          ) : null */}
          <Form.Item
            label="Folder Name"
            name="folderName"
            rules={[
              {
                required: true,
                message: "Please enter any name!",
              },
              { max: 35, message: "Maximum 35 characters" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Access to"
            name="accessTo"
            rules={[
              {
                require: true,
              },
            ]}
          >
            <Select
              mode="multiple"
              size="middle"
              placeholder="Please select"
              onChange=""
              style={{ width: "100%" }}
            >
              <Option>Access 1</Option>
              <Option>Access 2</Option>
              <Option>Access 3</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              disabled={folderSubmitBtn}
            >
              Create Folder
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default MyImages;
