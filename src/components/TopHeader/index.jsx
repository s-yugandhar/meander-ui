import React, {useState, useEffect, useContext} from 'react';
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



// custom imports
import impLogo from "../../assets/images/Meander_Logo.svg";
import {
  dbAddObj,
  dbGetObjByPath,
  deleteAfterUpload,
  GetFiles,
  GetUserdetails,
  url,
  getPublicItems,
} from "../API";
import { Context } from "../../context";
import { Header } from 'antd/lib/layout/layout';




const TopHeader = (props) => {
   let Logo = impLogo;
   let HeaderBG = "black";
   const dyHeaderBG = props.dyHeaderBG;
   const dyLogo = props.dyLogo;
   const { state, dispatch } = useContext(Context);
   const localUserId = localStorage.getItem("userId");

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



   return (
     <Header
       className="header"
       style={{ backgroundColor: HeaderBG, borderBottom: "1px solid #ddd" }}
     >
       <Row>
         <Col span={6}>
           {window.location.hostname === "portal.meander.video" ? (
             <div style={{ color: "white" }} className="brandingLogoBlock">
               <img src={Logo} alt="" className="brandingLogo" />
             </div>
           ) : (
             <div style={{ color: dyHeaderBG }} className="brandingLogoBlock">
               <img src={dyLogo} alt="" className="brandingLogo" />
             </div>
           )}
         </Col>
         <Col span={12}>
           <Input.Search
             onChange={(e) => getPublicItems(state, dispatch, e.target.value)}
             placeholder={
               "Search Public videos by title or description & play, Eg : Luke"
             }
             style={{ marginTop: "15px" }}
           ></Input.Search>
         </Col>
         <Col span={6}>
           <Row justify="end">
             <Col>
               {localUserId ? (
                 <Dropdown overlay={userMenu} trigger={["click"]}>
                   <Button
                     htmlType="button"
                     type="link"
                     className="ant-dropdown-link"
                     onClick={(e) => e.preventDefault()}
                     style={{
                       color: HeaderBG === "black" ? "white" : "black",
                     }}
                   >
                     <Avatar
                       size={30}
                       icon={<UserOutlined />}
                       style={{ marginRight: "5px" }}
                     />{" "}
                     {state.archiveAccount !== null
                       ? "Shared Account"
                       : state.userObj !== undefined && state.userObj !== null
                       ? state.userObj.username
                       : "My Account"}
                     <DownOutlined />
                   </Button>
                 </Dropdown>
               ) : (
                 <Button
                   type="primary"
                   onClick={() =>
                     dispatch({ type: "PAGE", payload: { page: "login" } })
                   }
                 >
                   Login
                 </Button>
               )}
             </Col>
           </Row>
         </Col>
       </Row>
     </Header>
   );

}


export default TopHeader;