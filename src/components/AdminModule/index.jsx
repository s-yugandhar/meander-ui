import React, { useState, useEffect, useContext } from "react";
import {  Layout, Menu,  Dropdown, Avatar,   Row,  Col, Input,  Select, Typography,  Drawer, Button,} from "antd";
import {  UserOutlined,  DownOutlined} from "@ant-design/icons";
import Uppy from '@uppy/core';
import 'uppy/dist/uppy.min.css';
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import ThumbnailGenerator from '@uppy/thumbnail-generator';
import { Dashboard, useUppy    } from '@uppy/react';
import { Context } from '../../context';
import "./adminModule.scss";
import SideNav from "../SideNav";
import MyVideos from "../MyVideos";
import AddVideo from "../AddVideo";
import MyProfile from "../MyProfile";
import UploadVideoFloatingBtn from "../Shared/UploadVideoFloatingBtn";
import Login from "../../Login";
import {FILE_LIST, FILE_UPLOADED ,FOLDER_NAME , UPPY_SUCCESS ,UPPY_BATCHID,UPPY_FAILED,PAGE } from "../../reducer/types";
import { dbAddObj,dbGetObjByPath,deleteAfterUpload , GetFiles  , url}  from '../API'
import EditVideo from "../EditVideo";
import ManageVideos from "../ManageVideos";
import ManageUsers from "../ManageUsers";
import Logo from "../../assets/images/Meander_Logo.svg";

const AdminModule = (props) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;
  const videomime = "video/*";
  const audiomime = "audio/*";
  const [selectedTab, setSelectedTab] = useState("my-videos");
  const [uploadVideo, setUploadVideo] = useState(false);
  const [logedIn, setLogedIn] = useState(false);

  const { state, dispatch } = useContext(Context);

  const localUserId = localStorage.getItem('userId');

  function updateFiles(id , folderName){

    GetFiles(state,dispatch ,id , folderName).then(res => {
      console.log('My Videos Files in sidenav - ', res);
      dispatch({ type: FILE_LIST, payload: { fileList: res }});
     });
     if( state.folderName === "")
     dbGetObjByPath(state,dispatch,"bucket-"+state.userId+"/" , true  );
     else
     dbGetObjByPath(state,dispatch,"bucket-"+state.userId+"/"+state.folderName+"/" , true  );
  }

  const uppy = useUppy(() => {
    return new Uppy({allowMultipleUploads  : false
      ,autoProceed : false,debug:true,restrictions:{ allowedFileTypes : [ videomime , audiomime ]},
      onBeforeFileAdded: (currentFile, files) => {
        const modifiedFile = {
          ...currentFile,
          name: Date.now() + '.' + currentFile.name.split(".")[1],
          meta : {title: currentFile.name ,
          description : currentFile.name }
        }
        uppy.log(modifiedFile.name);
        return modifiedFile;
      }
    }).use(ThumbnailGenerator,{ waitForThumbnailsBeforeUpload : false,
      thumbnailWidth: 200,  thumbnailHeight: 200,  thumbnailType: 'image/jpeg',
    }).use(AwsS3Multipart, {
      limit: 1,
      companionUrl: url,
      getChunkSize(file) {
        var chunks = Math.ceil(file.size / (5 * 1024 * 1024));
        return file.size < 5 * 1024 * 1024 ? 5 * 1024 * 1024 : Math.ceil(file.size / (chunks - 1));
      }
    }).on('complete', result => {
      console.log(result , "inside uppy complete event")
      let succes = result.successful;
      let failed = result.failed;
      let batchId = result.uploadID;
      let insertObj = [];
      succes.map((obj,ind)=>{
         if( obj.progress.uploadComplete=== true){
          let idt = obj.s3Multipart.uploadId;
            dispatch({ type: FILE_UPLOADED,  payload: { fileName:  obj.name }   });
            deleteAfterUpload(idt);
            let path = "bucket-"+idt.split("-")[0]+"/"+idt.split("-")[1]+"/"+idt.split("-")[2] ;
            let builtObj= { "name":obj.name  ,"title" : obj.meta.title , "description" : obj.meta.description , "itempath" : path ,
          "itemtype": obj.type , "itemsize" : obj.size ,"upload_state":"complete" ,"scope":"private"  };
            insertObj.push(builtObj);;
         }
      });
       if (insertObj.length > 0) dbAddObj(state , dispatch , insertObj );
      dispatch({ type: UPPY_SUCCESS,  payload: { uppySuccess: succes  }   });
      dispatch({ type: UPPY_FAILED,  payload: { uppyFailed: failed  }   });
      dispatch({ type: UPPY_BATCHID,  payload: { uppyBatchId: batchId  }   });
      updateFiles(state.userId,state.folderName);
      dispatch({ type: 'EDIT_VIDEO',  payload: { editVideo: null  }   });
     dbGetObjByPath(state,dispatch, insertObj[0].itempath,false);
      if (insertObj.length > 0) dispatch({ type: 'PAGE',  payload: { page : "edit-video"  }   });
          closeUploadVideo();      
    })
  });

  uppy.on('thumbnail:generated', (file, preview) => {
    console.log( " thumbnail generated"  , file , preview);
  });


  const closeUploadVideo = () => {
    uppy.reset();
    setUploadVideo(false);
    
  }

  const logout = () => {
     localStorage.removeItem('token');
    localStorage.removeItem('userId');
    dispatch({  type: 'FOLDER_LIST', payload:{ folderList : []} });
    dispatch({  type: 'FILE_LIST', payload:{ fileList : []} });
    dispatch({  type: 'VIDEO_LIST', payload:{ videoList : []} });
    //window.location.reload();
    dispatch({
      type: 'LOGOUT_SUCCESS'
    })
  }

  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => { setSelectedTab('my-profile') ;
      dispatch({ type: PAGE, payload: { page: 'my-profile' } }); }}>
        My Profile
      </Menu.Item>
      <Menu.Item onClick={(e)=>logout()}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const page = {
    "my-videos": <MyVideos />,
    "add-video": <AddVideo />,
    "my-profile": <MyProfile />,
    "edit-video": <EditVideo />,
    "manage-videos": <ManageVideos />,
    "manage-users": <ManageUsers />,
  };



  useEffect(() => {
    console.log('Admin modules context - ', state);
    console.log('Page name - ', state.page);
    console.log('Got user id - ', state.userId);
    localUserId ? setLogedIn(true) : setLogedIn(false);
    //Dashboard( { locale :{ strings : { dropHere : "hint"} }        } )
    uppy.setOptions( {  locale : {strings :
      {  'dropPaste' :state.folderName === ""?
      `Drop files here or paste or %{browse} to upload files to default` :
       `Drop files here or paste or %{browse} to upload files to `+state.folderName      }} })
      uppy.setMeta( { userId: state.userId, foldername: state.folderName === "" ? "default" : state.folderName })
  }, [ state.folderName ]);

  /* const content = {
    "my-videos": <MyVideos />,
    "add-video": <AddVideo />,
    "my-profile": <MyProfile />,
  }; */



  return (
    <>
      {localUserId ? (
        <Layout>
          <Header className="header">
            <Row>
              <Col span={6}>
                <div style={{ color: "white" }} className="brandingLogoBlock">
                  <img src={Logo} alt=""  className="brandingLogo" />
                </div>
              </Col>
              <Col span={18}>
                <Row justify="end">
                  <Col>
                    <Dropdown overlay={userMenu} trigger={["click"]}>
                      <Button
                        htmlType="button"
                        type="link"
                        className="ant-dropdown-link"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: "white" }}
                      >
                        <Avatar
                          size={30}
                          icon={<UserOutlined />}
                          style={{ marginRight: "5px" }}
                        />{" "}
                        {state.userObj !== undefined && state.userObj !== null
                          ? state.userObj.username
                          : "My Account"}
                        <DownOutlined />
                      </Button>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Header>
          <Layout>
            <SideNav
              updateTab={(tab) => setSelectedTab(tab)}
              openUploadVideo={() => setUploadVideo(true)}
            />
            {page[state.page] ||
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
              <div className="uploadSelectfolderBlock">
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="search folder"
                  optionFilterProp="children"
                  value={state.folderName === "" ? "default" : state.folderName}
                  onChange={(value) =>
                    dispatch({
                      type: FOLDER_NAME,
                      payload: { folderName: value },
                    })
                  }
                >
                  {state.folderList !== undefined && state.folderList.length > 0
                    ? state.folderList.map((obj, ind) => {
                        return obj._object_name.includes("temp.dod") ? (
                          <Option
                            key={obj._object_name.split("/")[0]}
                            value={obj._object_name.split("/")[0]}
                          >
                            {" "}
                            {obj._object_name.split("/")[0]}{" "}
                          </Option>
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

            {/*<UploadVideoFloatingBtn onClick={() => setUploadVideo(true)} />*/}
          </Layout>
        </Layout>
      ) : (
        <Login />
      )}
    </>
  );
};

export default AdminModule;
