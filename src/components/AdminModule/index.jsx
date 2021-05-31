import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Drawer,
  Button,
  message,
  notification,
  Divider,
} from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import Uppy from "@uppy/core";
import "uppy/dist/uppy.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import { Dashboard, useUppy } from "@uppy/react";
import { Context } from "../../context";
import "./adminModule.scss";
import SideNav from "../SideNav";
import MyVideos from "../MyVideos";
import AddVideo from "../AddVideo";
import MyProfile from "../MyProfile";
import Login from "../../Login";
import Plans from "../AllPlan";
import Loading from "../Loading";
import {
  FILE_LIST,
  FILE_UPLOADED,
  FOLDER_NAME,
  UPPY_SUCCESS,
  UPPY_BATCHID,
  UPPY_FAILED,
  PAGE,
} from "../../reducer/types";
import {
  dbAddObj,
  dbGetObjByPath,
  deleteAfterUpload,
  GetFiles,
  GetUserdetails,
  url,
  getPublicItems,
} from "../API";
import EditVideo from "../EditVideo";
import ManageVideos from "../ManageVideos";
import ManageUsers from "../ManageUsers";
import ShareAccess from "../ShareAccess";
import impLogo from "../../assets/images/Meander_Logo.svg";
import Settings from "../Settings";
import ResellerReports from "../Reseller-Reports";
import axios from "axios";
import { PlayerPage } from "../Player";
import TopHeader from "../TopHeader";

const AdminModule = (props) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;
  const videomime = "video/*";
  const audiomime = "audio/*";
  const [selectedTab, setSelectedTab] = useState("videos");
  const [uploadVideo, setUploadVideo] = useState(false);
  const [logedIn, setLogedIn] = useState(false);
  const [stateEdit, setStateEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(Context);

  const localUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  function updateFiles(id, folderName) {
    //if( state.folderName === "")
    //dbGetObjByPath(state,dispatch,"bucket-"+state.userId+"/" , true  );
    //else
    //dbGetObjByPath(state,dispatch,"bucket-"+state.userId+"/"+state.folderName+"/" , true  );
  }

  const uppy = useUppy(() => {
    return new Uppy({
      allowMultipleUploads: false,
      autoProceed: false,
      debug: true,
      restrictions: { allowedFileTypes: [videomime, audiomime] },
    }).use(AwsS3Multipart, {
      limit: 1,
      companionUrl: url,
      getChunkSize(file) {
        var chunks = Math.ceil(file.size / (5 * 1024 * 1024));
        return file.size < 5 * 1024 * 1024
          ? 5 * 1024 * 1024
          : Math.ceil(file.size / (chunks - 1));
      },
    });
  });

  const completeEvent = (result) => {
    console.log(result, "inside uppy complete event");
    let succes = result.successful;
    let failed = result.failed;
    let batchId = result.uploadID;
    let insertObj = [];
    succes.map((obj, ind) => {
      if (obj.progress.uploadComplete === true) {
        let idt = obj.s3Multipart.uploadId;
        dispatch({ type: FILE_UPLOADED, payload: { fileName: obj.name } });
        //deleteAfterUpload(idt);
        let path =
          "bucket-" +
          idt.split("-")[0] +
          "/" +
          idt.split("-")[1] +
          "/" +
          idt.split("-")[2];
        let builtObj = {
          name: obj.name,
          title: obj.meta.title,
          description: obj.meta.description,
          itempath: path,
          itemtype: obj.type,
          itemsize: obj.size,
          upload_state: "complete",
          scope: "private",
          updatetime: obj.meta.time,
        };
        insertObj.push(builtObj);
      }
    });
    dispatch({ type: UPPY_SUCCESS, payload: { uppySuccess: succes } });
    dispatch({ type: UPPY_FAILED, payload: { uppyFailed: failed } });
    dispatch({ type: UPPY_BATCHID, payload: { uppyBatchId: batchId } });
    if (insertObj.length > 0) {
      setLoading(true);
      if (stateEdit === false) {
        dbAddObj(state, dispatch, insertObj);
        setStateEdit(insertObj[0].itempath);
      }
    }
  };

  useEffect(() => {
    uppy.on("complete", (result) => {
      completeEvent(result);
    });
    return () => uppy.off("complete");
  }, [uppy]);

  useEffect(() => {
    if (stateEdit !== false) {
      setStateEdit(false);
      setLoading(false);
      closeUploadVideo();
      dispatch({ type: "PAGE", payload: { page: "edit-video" } });
    }
  }, [state.editVideo]);

  useEffect(() => {
    if (state.folderCreated !== null && state.folderCreated !== "") {
      setUploadVideo(true);
    }
  }, [state.folderCreated]);

  const closeUploadVideo = () => {
    uppy.reset();
    setUploadVideo(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch({ type: "FOLDER_LIST", payload: { folderList: [] } });
    dispatch({ type: "FILE_LIST", payload: { fileList: [] } });
    dispatch({ type: "VIDEO_LIST", payload: { videoList: [] } });
    //window.location.reload();
    dispatch({
      type: "LOGOUT_SUCCESS",
    });
  };

  const userMenu = (
    <Menu>
      {
        state.archiveAccount !== null ? (
          <Menu.Item onClick={() => switchToSelf(state, dispatch)}>
            Switch To Own Account
          </Menu.Item>
        ) : null
        /*<Menu.Item onClick={() => { setSelectedTab('profile') ;
      dispatch({ type: PAGE, payload: { page: 'profile' } }); }}>
        My Profile
      </Menu.Item>*/
      }
      <Menu.Item onClick={(e) => logout()}>Logout</Menu.Item>
    </Menu>
  );

  const page = {
    "videos": (
      <MyVideos
        openUploadVideo={() => {
          setUploadVideo(true);
        }}
      />
    ),
    "add-video": <AddVideo />,
    "profile": <MyProfile />,
    "edit-video": <EditVideo />,
    "manage-videos": <ManageVideos />,
    "accounts": <ManageUsers />,
    "share-access": <ShareAccess />,
    "reseller-settings": <Settings />,
    "usage": <ResellerReports />,
    "player": <PlayerPage />,
    "login": <Login />,
    "appplans": <Plans />,
    "forbidden": (
      <>
        <div>
          {" "}
          <p> You have no permission to view this page</p>
        </div>
      </>
    ),
  };

  useEffect(() => {
    console.log("Admin modules context - ", state , props);
    console.log("Page name - ", state.page);
    console.log("Got user id - ", state.userId);
    localUserId ? setLogedIn(true) : setLogedIn(false);
    //Dashboard( { locale :{ strings : { dropHere : "hint"} }        } )

    const dispName = state.dbfolderList.find(
      (ob) => ob.id === state.folderName
    );
    uppy.setOptions({
      onBeforeFileAdded: (currentFile, files) => {
        let time = Date.now();
        let uuid = state.userId + String(time);
        const modifiedFile = {
          ...currentFile,
          name: uuid + "." + currentFile.name.split(".")[1],
          meta: {
            title: currentFile.name,
            description: currentFile.name,
            time: time,
            uuidname: uuid,
          },
        };
        return modifiedFile;
      },
      locale: {
        strings: {
          dropPaste:
            dispName === undefined || dispName === null
              ? `Drop files here or paste or %{browse} to upload files `
              : `Drop files here or paste or %{browse} to upload files to : ` +
                dispName.foldername,
        },
      },
    });
    uppy.setMeta({
      userId: state.userId,
      foldername: state.folderName === "" ? "default" : state.folderName,
    });
  }, [state.folderName, localUserId]);

  const switchToSelf = (state, dispatch) => {
    if (state.archiveAccount !== null) {
      localStorage.setItem("userId", state.archiveAccount.userId);
      localStorage.setItem("token", state.archiveAccount.token);
      localStorage.setItem("archive", null);
      dispatch({ type: "ARCHIVE_ACCOUNT", payload: { archiveAccount: null } });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: state.archiveAccount.token,
          userId: state.archiveAccount.userId,
          page: "videos",
        },
      });
      GetUserdetails(state, dispatch, state.userId);
    }
  };

  return (
    <>
      {loading ? <Loading show={loading} /> : null}
      <Layout>
        <TopHeader  dyHeaderBG={props.dyHeaderBG} dyLogo={props.dyLogo}/>
       <Layout>
          {localUserId ? (
            <Sider
              collapsedWidth={0}
              breakpoint="md"
              style={{ backgroundColor: "whitesmoke" }}
              trigger={true}
            >
              <SideNav
                updateTab={(tab) => setSelectedTab(tab)}
                openUploadVideo={() => {
                  setUploadVideo(true);
                }}
              />
            </Sider>
          ) : null}
          {page[state.page] ||
            "You do not have permissions to view this module"}
          {localUserId ? (
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
              <div className="uploadSelectfolderBlock">
                <Select
                  size="medium"
                  style={{ width: "60%" }}
                  placeholder="search folder"
                  optionFilterProp="children"
                  showSearch={true}
                  value={state.folderName === "" ? "default" : state.folderName}
                  onChange={(value) => {
                    dispatch({
                      type: FOLDER_NAME,
                      payload: { folderName: value },
                    });
                    if (state.folderName !== "")
                      GetFiles(state, dispatch, state.userId, state.folderName);
                  }}
                >
                  {state.dbfolderList.length > 0
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
                </Select>{" "}
              </div>
              <div className="uploadFileUppyBlock" style={{ height: "80vh" }}>
                <Dashboard
                  uppy={uppy}
                  showProgressDetails={true}
                  proudlyDisplayPoweredByUppy={false}
                  showRemoveButtonAfterComplete={true}
                  showLinkToFileUploadResult={false}
                  fileManagerSelectionType={"files"}
                  inline={true}
                />
              </div>
            </Drawer>
          ) : null}

          {/*<UploadVideoFloatingBtn onClick={() => setUploadVideo(true)} />*/}
        </Layout>
      </Layout>
    </>
  );
};

export default AdminModule;
