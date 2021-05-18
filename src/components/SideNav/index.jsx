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

const location = window.location;

const SideNav = ({ updateTab, openUploadVideo }) => {
  const [selectedKeys, setSelectedKeys] = useState(["videos"]);
  const [errMsg, setErrMsg] = useState(null);
  /* const [api, contextHolder] = notification.useNotification(); */
  const [fsrch, setFsrch] = useState("");
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  const { state, dispatch } = useContext(Context);

  const loadPage = (name) => {
    dispatch({ type: PAGE, payload: { page: name } });
  };

  const pushIntoHistory=(state,dispatch,name)=>{
      window.history.pushState(state,name,name);
      loadPage(name);
  }

  useEffect(() => {
    let path = location.pathname;
    console.log(location);
    GetUserdetails(state,dispatch,state.userId).then( res => {
      if(path.replace("/","") === "accounts"){
      if(   state.userObj !== null &&
            state.userObj !== undefined && 
          (state.userObj.roles === "super_admin" || state.userObj.roles === "reseller") )
           loadPage("accounts");else loadPage("forbidden");}
    else 
      loadPage(path.replace("/","")); }).catch(err=> loadPage("videos"));
    
  }, []);

  const switchToSelf = (state,dispatch)=>{
    if(state.archiveAccount !== null){
      localStorage.setItem("userId",state.archiveAccount.userId);
      localStorage.setItem("token",state.archiveAccount.token);
      localStorage.setItem("archive",null);
      dispatch({type:"ARCHIVE_ACCOUNT", payload : {archiveAccount :null }});
      dispatch({type:"LOGIN_SUCCESS", payload:{  token:state.archiveAccount.token,userId : state.archiveAccount.userId,page:"videos" } });
      GetUserdetails(state,dispatch, state.userId);
      window.location.reload(false);
    }
  }

  return (
    <>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultOpenKeys={["products-menu"]}
          selectedKeys={selectedKeys}
          onSelect={(info) => setSelectedKeys(info.selectedKeys)}
          style={{ height: "100%", borderRight: 0 }}
        >
          { state.userObj !== null &&
            state.userObj !== undefined && 
          (state.userObj.roles === "super_admin" || state.userObj.roles === "reseller") ? 
          <SubMenu key="partners-submenu" title={ state.userObj.roles === "super_admin" ? "Super Admin Panel":"Partners"}>
            {/*<Menu.Item key="customers">Customers</Menu.Item>*/}
            <Menu.Item key="listu" onClick={() => 
            pushIntoHistory(state,dispatch,"accounts") }>
              Accounts
            </Menu.Item>
          </SubMenu> : "" }
          <SubMenu key="products-menu" title="Products">
            <Menu.Item
              key="dashboard"
              onClick={() => {GetFolders(state, dispatch, state.userId);
                pushIntoHistory(state,dispatch,"videos") }}
            >
              All Videos
            </Menu.Item>
            </SubMenu>
            {state.archiveAccount !== null ?
            <Menu.Item onClick={()=> switchToSelf(state,dispatch)}>
                Switch To Own Account     </Menu.Item> :null }
              {state.userObj !== null && state.userObj !== undefined && 
            state.userObj.roles !== "user" && state.userObj.roles !== "editor"  ?
            <Menu.Item onClick={() => { 
              pushIntoHistory(state,dispatch,"profile")  }}>
                My Account  </Menu.Item> : null}
            <Menu.Item key="ureport" title="Coming soon"
              onClick={() => pushIntoHistory(state,dispatch,"usage")} >
               Usage Report              
            </Menu.Item>          
        </Menu>
      </Sider>      
    </>
  );
};

export default SideNav;
