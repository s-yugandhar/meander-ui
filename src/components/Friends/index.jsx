import React, { useContext, useState , useEffect } from "react";
import { Layout, Row, Divider, Table, Switch, Button,
  Form,Col,message, Input,Select } from "antd";
import {  EditOutlined,  DeleteOutlined,
  LinkOutlined,  PlusOutlined, ReloadOutlined
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from 'axios';
import {url} from '../API/index';
import Modal from "antd/lib/modal/Modal";

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


const Friends = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);
  const {Option} = Select;
  const {form} = Form.useForm();
 
useEffect(()=>{
  let sh = [];  let ob = state.userObj;
    let prems = [ ...ob.access.viewer , ...ob.access.user , ...ob.access.admin ];
    prems.map( (ob )=>{
        let dex =  state.accessIn.find( e=> e.id == ob);
        if(dex !== undefined) sh.push(dex)
    }); 
    dispatch({type:"ACCESS_IN",payload:{ accessIn : sh }});
    GetSharedUsersdetails(state,dispatch,state.userId);
},[state.userObj])


 let tableData = [];

  if ( state.accessIn !== undefined &&  state.accessIn.length > 0) {
    state.accessIn.map((itm, ind) => {
      tableData.push({
        key: ind,    pos : ind+1,    id: itm.id,
        username: itm.username,  email: itm.email,    phone: itm.phone,
        domain_name : itm.domain_name,  roles : itm.roles,   is_active : itm.is_active,
        access : itm.access === null ? {viewer:[],user:[],admin:[]} : itm.access,
        items : itm.items,   originsize: itm.originsize,
        originserved: itm.originserved,     bridgeserved: itm.bridgeserved
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
      title: "SharedWithRole",
      dataIndex: "access",
      key: "access",
      render:(e,record)=>(
        state.userObj.access.viewer.includes(record.id)? "Viewer": 
        state.userObj.access.user.includes( record.id)? "Editor" : "Admin"
         )
    },
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
