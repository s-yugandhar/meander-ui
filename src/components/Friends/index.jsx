import React, { useContext, useState , useEffect , ReactDOM } from "react";
import { Layout, Row, Divider, Table, Switch, Button,
  Form,Col,message, Input,Select,Alert,Space } from "antd";
import {  EditOutlined,  DeleteOutlined,
  LinkOutlined,  PlusOutlined, ReloadOutlined
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from 'axios';
import {GetUserdetails, url} from '../API/index';
import Modal from "antd/lib/modal/Modal";

const GetIncomingRoledetails= async (state,dispatch ,userId)=>{
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


const Friends = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);
  const {Option} = Select;
  const {form} = Form.useForm();
 
useEffect(()=>{
  let sh = [];  let ob = state.userObj;
  if( ob !== null && ob !== undefined && ob.access !== null){
    let prems = [ ...ob.access.viewer , ...ob.access.user , ...ob.access.admin ];
    prems.map( (ob )=>{
        let dex =  state.accessIn.find( e=> e.id == ob);
        if(dex !== undefined) sh.push(dex)
    }); 
    GetIncomingRoledetails(state,dispatch,state.userId);
  }
    dispatch({type:"ACCESS_IN",payload:{ accessIn : sh }});
    
},[state.userObj])

const toggleToUser = async( state , dispatch , record)=>{
  const tempFolders = await axios.get(url + `/sharedtoken/${state.userId}/${record.id}`, {
    headers: {
       accept: 'application/json', Authorization : "bearer "+state.token,
          }
 }).then(res => {
   //message.success(`No of rows updated ${res.data}`);
   let flag = window.confirm("Do you really want to switch profile");
   if (flag !== false){
        switchToProfile(state,dispatch, res.data.id , res.data.access_token);
   }     
   return res.data;   })
 console.log(" userdata in get manageuser ", tempFolders);
 return tempFolders;
}

const switchToProfile = (state,dispatch , sharedid , sharedtoken)=>{
    let previd = localStorage.getItem("userId");
    let prevtoken = localStorage.getItem("token");
    localStorage.setItem("userId",sharedid);
    localStorage.setItem("token",sharedtoken);
    localStorage.setItem("archive",JSON.stringify({"userId":previd , "token" : prevtoken  } ));
    dispatch({type:"ARCHIVE_ACCOUNT", payload:{ archiveAccount : { token : prevtoken , userId :previd } }});
    dispatch({type:"LOGIN_SUCCESS", payload:{  token : sharedtoken , userId : sharedid,page:"videos" } });
    GetUserdetails(state,dispatch, state.userId);
}


const switchToSelf = (state,dispatch)=>{
    if(state.archiveAccount !== null){
      localStorage.setItem("userId",state.archiveAccount.userId);
      localStorage.setItem("token",state.archiveAccount.token);
      localStorage.setItem("archive",null);
      dispatch({type:"ARCHIVE_ACCOUNT", payload : {archiveAccount :null }});
      dispatch({type:"LOGIN_SUCCESS", payload:{  token:state.archiveAccount.token,userId : state.archiveAccount.userId  } });
      GetUserdetails(state,dispatch, state.userId);
    }
}

 let tableData = [];

  if ( state.accessIn !== null && state.accessIn !== undefined &&  
    state.accessIn.length > 0) {
    state.accessIn.map((itm, ind) => {
      tableData.push({
        key: ind,    pos : ind+1,    id: itm.id,
        username: itm.username,  email: itm.email,    phone: itm.phone,
        domain_name : itm.domain_name,  roles : itm.roles,   is_active : itm.is_active,
        access : itm.access === null ? {viewer:[],user:[],admin:[]} : itm.access,
        items : itm.items,   originsize: itm.originsize,
        originserved: itm.originserved,     bridgeserved: itm.bridgeserved ,
        rolehere : state.userObj.access.viewer.includes(itm.id)? "Viewer": 
        state.userObj.access.user.includes(itm.id)? "Editor" : "Admin"
      });
    });
  }

   // Table Columns
  let tableColmnsTitle = [
    {
      title: "#",
      dataIndex: "pos",
      key: "pos"
    },
     {
      title: "SharedWithRole",
      dataIndex: "access",
      key: "access",
      render:(e,record)=>(
        state.userObj.access.viewer.includes(record.id)? "Viewer": 
        state.userObj.access.user.includes( record.id)? "Editor" : "Admin"
         )
    },   
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Videos",
      dataIndex: "items",
      key: "items",
      render:(e,record)=>( record.items === undefined ? 0 : record.items.length )
     },
     {
        title: "Browse As",
        dataIndex: "id",
        key: "id",
        render :(e,record)=>(
           state.archiveAccount === null ?
          <Button  onClick={e => toggleToUser(state,dispatch,record)}>Switch to profile</Button> : null
          
        )
     }
  ];

  return (    
      <>
        <Row >
        <Col span={16}><h4 className="">
            {" Users whose data you can view/edit -  "}
              { state.accessIn.length}
            </h4></Col>          
        </Row>
        <Row  >
          <Col span={24}>
            <Table
            dataSource={tableData} columns={tableColmnsTitle}
            pagination={{ defaultPageSize: 50  }}
            ></Table>
          </Col>
        </Row>
        <Row  >        </Row>
      </>
    
  );
};

export default Friends;
