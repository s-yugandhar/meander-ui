import React, {useState, useEffect, useContext} from 'react';
import {
  Layout,  Menu, Dropdown,  Avatar,
  Row,  Col,  Input,  Select,
  Typography,  Drawer,  Button,
  message,  notification,  Divider
} from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
// custom imports
import impLogo from "../../assets/images/Meander_Logo.svg";
import {
  GetUserdetails,
  url, getPublicItems,
  GetSharedUsersdetails
} from "../API";
import axios from 'axios';
import { Context } from "../../context";
import { Header } from 'antd/lib/layout/layout';


const TopHeader = (props) => {
   let Logo = impLogo;
   let HeaderBG = "black";
   const dyHeaderBG = props.dyHeaderBG;
   const dyLogo = props.dyLogo;
   const { Option } = Select;
   const { state, dispatch } = useContext(Context);
   const localUserId = localStorage.getItem("userId");
   const [listUsers , setListUsers] = useState([]);
   const [acUser,setAcUser] = useState(null);

   const archive  = JSON.parse(localStorage.getItem("archive"));

   const toggleToUser = async( state , dispatch , record)=>{
    let flag = window.confirm("Do you really want to switch profile");
    if (flag === false){return;}
    let userId = state.userId;
    let token = state.token;
    if(state.archiveAccount !== null) {
      userId = state.archiveAccount.userId;
      token = state.archiveAccount.token;}

    const tempFolders = await axios.get(url + `/sharedtoken/${userId}/${record.id}`, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+token,
            }
   }).then(res => {
     //message.success(`No of rows updated ${res.data}`);
          switchToProfile(state,dispatch, res.data.id , res.data.access_token);
     return res.data;   })
   console.log(" userdata in get manageuser ", tempFolders);
   return tempFolders;
  }

  const switchToProfile = (state,dispatch , sharedid , sharedtoken)=>{
    let previd = localStorage.getItem("userId");
    let prevtoken = localStorage.getItem("token");
    localStorage.setItem("userId",sharedid);
    localStorage.setItem("token",sharedtoken);
    const archive  = JSON.parse(localStorage.getItem("archive"));
    if( archive === null){
    localStorage.setItem("archive",JSON.stringify({"userId":previd , "token" : prevtoken  } ));
    dispatch({type:"ARCHIVE_ACCOUNT", payload:{ archiveAccount : { token : prevtoken , userId :previd } }});
    }
    dispatch({type:"LOGIN_SUCCESS", payload:{  token : sharedtoken , userId : sharedid,page:"videos" } });
    GetUserdetails(state,dispatch, state.userId);
    window.location.reload();
}


   const switchToSelf = (state, dispatch , archive) => {
     if (archive !== null) {
       localStorage.setItem("userId", archive.userId);
       localStorage.setItem("token", archive.token);
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
       GetUserdetails(state, dispatch, state.userId).then(res=>
        window.location.reload());
     }
   };

   const GetAllUserdetails= async (state,dispatch ,userId)=>{
    if (userId === undefined )
       return [];
    const tempFolders = await axios.get(url + `/users/${userId}/getusers`, {
       headers: {
          accept: 'application/json', Authorization : "bearer "+state.token,
             }
    }).then(res => {
       if ( res.status== 200)        setListUsers(res.data);
       return res.data;   })
    console.log(" userdata in get ", tempFolders);
    return tempFolders;
 }

   const GetSharedUsersdetails= async (state,dispatch ,userId)=>{
    if (userId === undefined )
       return []; 
    let ob = state.userObj;
    let prems = [ ...ob.access.viewer , ...ob.access.user , ...ob.access.admin ];
    state.accessIn.map( (obj )=>{
        let dex = prems.indexOf(obj.id);
            if(dex > -1 ) prems.splice(dex,1);
    }); 
    prems.map(async(access_id)=>{
    const tempFolders = await axios.get(url + `/getfriend/${userId}/${access_id}`, {
       headers: {
          accept: 'application/json', Authorization : "bearer "+state.token,
             }
    }).then(res => {
       if ( res.status== 200)    
        dispatch({ type:"ACCESS_IN",  payload : {  accessIn : [ ...state.accessIn , res.data ] } });
       return res.data;   })
    return tempFolders;
  });
  }

   const userMenu = (
     <Menu>
       {
         state.archiveAccount !== null ? (
           <Menu.Item onClick={() => switchToSelf(state, dispatch,archive)}>
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
     localStorage.removeItem("archive");
     dispatch({ type: "FOLDER_LIST", payload: { folderList: [] } });
     dispatch({ type: "FILE_LIST", payload: { fileList: [] } });
     dispatch({ type: "VIDEO_LIST", payload: { videoList: [] } });
     dispatch({ type: "ARCHIVE_ACCOUNT", payload:{ archiveAccount : null}  });
     //window.location.reload();
     dispatch({
       type: "LOGOUT_SUCCESS",
     });
   };

   useEffect(()=>{
    GetUserdetails(state,dispatch,state.userId);
    console.log("headerroles" ,archive);
     if( state.userObj){
      setAcUser( state.userObj !== undefined && state.userObj !== null ? state.userObj.email : null);}
      if((state.userObj && (state.userObj.roles === "reseller" || state.userObj.roles === "super_admin"))
      ||(archive !== null )){
        let userId = state.userId;
        let token = state.token;
        if(archive !== null) {
          userId = archive.userId;
          token = archive.token;}
        GetAllUserdetails( {token:token},dispatch,userId);
      }
      else{}
    },[state.videoList]);

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
         <Col span={6}>
         {/*<Input.Search
             onChange={(e) => getPublicItems(state, dispatch, e.target.value)}
             placeholder={
               "Search Public videos by title or description & play, Eg : Luke"
             }
             style={{ marginTop: "15px" }}
           ></Input.Search>*/}
         </Col>
         <Col span={6}>
         
         { (state.userObj && (state.userObj.roles === "reseller" || state.userObj.roles === "super_admin"))
         || archive !== null ?
         <Select                 
                  size="middle"
                  style={{width:"auto"}}
                  placeholder="search email"
                  optionFilterProp="children"
                  showSearch={true}
                  value={ acUser !== null ? acUser : null }
                  onChange={(value) => { 
                    if(value === "Switch to Self"){
                        switchToSelf(state,dispatch,archive);
                      return ;}
                    if(acUser !== value){
                      let user = listUsers.find(o => o.email === value );
                      if(user)
                    setAcUser(user.email) ;toggleToUser(state,dispatch,{id:user.id}); }     }}
                >
                  {listUsers.length > 0
                    ? listUsers.map((obj, ind) => {
                        return  (
                          <>  {" "}
                            <Option key={obj.id} value={
                              archive === null ? obj.email :
                              archive && archive.userId !== obj.id ? obj.email : "Switch to Self"}>
                              {" "}
                              { archive === null ? obj.email :
                              archive && archive.userId !== obj.id ? obj.email : "Switch to Self"}
                              {"   "}{" "}
                            </Option>{" "}
                          </>
                        ) 
                      })
                    : null}
                </Select>: null }
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