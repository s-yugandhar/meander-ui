import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Modal,
  Divider,
  Button,
  Form,
  Input,
  notification,
  Alert,
} from "antd";
import {
  FolderAddOutlined,
  CheckCircleOutlined,
  FolderOutlined,
  CloudUploadOutlined,
  VideoCameraAddOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  PAGE,
  FOLDER_CREATED,
  FILE_UPLOADED,
  FOLDER_NAME,
  FILE_LIST,
  FOLDER_LIST,
} from "../../reducer/types";
import {
  dbGetObjByPath,
  GetFolders,
  url,
  GetFiles,
  CreateNewFolder,
  GetUserdetails
} from "../API/index";

import { Context } from "../../context";

const SideNav = ({ updateTab, openUploadVideo }) => {
  const [selectedKeys, setSelectedKeys] = useState(["my-videos"]);
  const [errMsg, setErrMsg] = useState(null);
  /* const [api, contextHolder] = notification.useNotification(); */
  const [fsrch, setFsrch] = useState("");
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  const { state, dispatch } = useContext(Context);

  const loadPage = (name) => {
    dispatch({ type: PAGE, payload: { page: name } });
  };

  useEffect(() => {
    //getFolders();
  }, []);

  const switchToSelf = (state,dispatch)=>{
    if(state.archiveAccount !== null){
      localStorage.setItem("userId",state.archiveAccount.userId);
      localStorage.setItem("token",state.archiveAccount.token);
      localStorage.setItem("archive",null);
      dispatch({type:"ARCHIVE_ACCOUNT", payload : {archiveAccount :null }});
      dispatch({type:"LOGIN_SUCCESS", payload:{  token:state.archiveAccount.token,userId : state.archiveAccount.userId,page:"my-videos" } });
      GetUserdetails(state,dispatch, state.userId);
      window.location.reload(false);
    }
  }

  return (
    <>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultOpenKeys={["my-videos-submenu"]}
          selectedKeys={selectedKeys}
          onSelect={(info) => setSelectedKeys(info.selectedKeys)}
          style={{ height: "100%", borderRight: 0 }}
        >
          { state.userObj !== null &&
            state.userObj !== undefined && 
          (state.userObj.roles === "super_admin" || state.userObj.roles === "reseller") ? 
          <SubMenu key="partners-submenu" title={ state.userObj.roles === "super_admin" ? "Super Admin Panel":"Partners"}>
            {/*<Menu.Item key="customers">Customers</Menu.Item>*/}
            <Menu.Item key="listu" onClick={() => loadPage("manage-users")}>
              Accounts
            </Menu.Item>
          </SubMenu> : "" }
          <SubMenu key="my-videos-submenu" title="Products">
            <Menu.Item
              key="dashboard"
              onClick={() => GetFolders(state, dispatch, state.userId)}
            >
              All Videos
            </Menu.Item>
            {/*<Menu.Item
              disabled={true}
              className="createFolderMenuItem"
              key="cfv"
            >
              <Button
                key={"xcvz"}
                type="primary"
                shape="round"
                icon={<FolderAddOutlined className="createFolderBtnIcon" />}
                size="middle"
                onClick={showCreateFolder}
                className="createFolderBtn"
              >
                {" "}
                Create Folder
              </Button>
            </Menu.Item>*/}
            {/*<Menu.Item>
            <><SearchOutlined/>
            <Input  placeholder="folder, 3 letters" value={fsrch}
             onChange={(e)=>{ setFsrch(e.target.value);   }}  />
             </>
              </Menu.Item>
              {state.folderList !== undefined && state.folderList.length > 0
              ? state.folderList.map((folder, index) => {
                  return fsrch.length>2 && folder.includes(fsrch)?
                  (
                    <Menu.Item
                      key={"folder-" + index}
                      onClick={() => folderDetail(folder)}
                      title={folder}
                    >
                      <FolderOutlined /> {folder}
                    </Menu.Item>
                  ): null;
                })
              : null}
              // search in menu above , do not delete 
              <Menu key="foldersearch" 
             title={ state.folderList !== undefined && state.folderList.length > 0
             ? "Folders "+state.folderList.length : "Folders "+0 }> 
              {state.folderList !== undefined && state.folderList.length > 0
              ? state.folderList.map((folder, index) => {
                  return (
                    <Menu.Item
                      key={"folder-" + index}
                      onClick={() => folderDetail(folder)}
                      title={folder}
                    >
                       {folder}
                    </Menu.Item>
                  );
                })
              : null}
            </Menu>*/}
            </SubMenu>
            {/* <Menu.Item key="" onClick={() => openUploadVideo(true)}>
              Add Video
            </Menu.Item> */}
            {state.archiveAccount !== null ?
            <Menu.Item onClick={()=> switchToSelf(state,dispatch)}>
                Switch To Own Account     </Menu.Item> :null }
              {state.userObj !== null && state.userObj !== undefined && 
            state.userObj.roles !== "user" && state.userObj.roles !== "editor"  ?
            <Menu.Item onClick={() => { 
                  dispatch({ type: PAGE, payload: { page: 'my-profile' } }); }}>
                My Account  </Menu.Item> : null}
            <Menu.Item key="ureport" title="Coming soon"
              onClick={() => loadPage("reseller-reports")}>
              Usage Report
            </Menu.Item>          
        </Menu>
      </Sider>      
    </>
  );
};

export default SideNav;
