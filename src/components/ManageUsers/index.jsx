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

const ManageUsers = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);
  const [listUsers , setListUsers] = useState([]); 
  const [editUser , setEditUser] = useState(null);

  const {Option} = Select;
  const {form} = Form.useForm();
  
 const GetAllUserdetails= async (state,dispatch ,userId)=>{
    if (userId === undefined )
       return [];
    const tempFolders = await axios.get(url + `/users/${userId}/getusers`, {
       headers: {
          accept: 'application/json', Authorization : "bearer "+state.token,
             }
    }).then(res => {
       console.log(res);
       if ( res.status== 200)
        setListUsers(res.data);
       return res.data;   })
    console.log(" userdata in get ", tempFolders);
    return tempFolders;
 }
 
 const updateRecord= async (state,dispatch ,obj , switchValue)=>{
  if (state.userId === undefined || state.userId === null)
     return ;
     if(switchValue === "toggle")
    obj.is_active = !obj.is_active;
  const tempFolders = await axios.post(url + `/users/${state.userId}/updateuser`, obj ,{
     headers: {
        accept: 'application/json', Authorization : "bearer "+state.token,
           }
  }).then(res => {
    message.success(`No of rows updated ${res.data}`);
    setEditUser(null);
     return res.data;   })
  console.log(" userdata in get manageuser ", tempFolders);
  return tempFolders;
}

const setUpdateRecord=(values)=>{
  let objinit = editUser;
objinit.username=values.username;
  objinit.phone=values.phone;
  objinit.email =values.email;
console.log(values,objinit);
  updateRecord(state,dispatch,objinit,"notoggle");
}





 useEffect(()=>{
  GetAllUserdetails(state,dispatch,state.userId);
 },[]);
 
  // Table Columns
  let tableColmnsTitle = [
    {
      title: "#",
      dataIndex: "pos",
      key: "pos"
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
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
      title: state.userObj.roles === "super_admin"?"domain" : "",
      dataIndex: "domain_name",
      key: "domain_name",
      render:(e,record)=>(state.userObj.roles === "super_admin"? e : ""),
    },
    {
      title: "roles",
      dataIndex: "roles",
      key: "roles",
    },
    {
      title: "Active",
      dataIndex : "is_active",
      key: "is_active",
      render:(e,record)=>(<><Switch size={"small"} 
      defaultChecked={e} onChange={()=>updateRecord(state,dispatch,record ,"toggle") }></Switch>
      &nbsp;&nbsp;&nbsp;&nbsp;
        <Button icon={<EditOutlined />} onClick={(value)=>{ setEditUser({...record})}} />
        {/*<Button icon={<DeleteOutlined />} onClick="" /> */}
      </>),
    },
    {/*
      title: "Actions",  key: "actions",
      render: (e,record) => (
        <>  
        <Button icon={<EditOutlined />} onClick={(value)=>{ setEditUser({...record})}} />
        <Button icon={<DeleteOutlined />} onClick="" />   </>
      ),
      */},
  ];

  let tableData = [];

  if (listUsers.length > 0) {
    listUsers.map((itm, ind) => {
      tableData.push({
        key: ind,
        pos : ind+1,
        id: itm.id,
        username: itm.username,
        email: itm.email,
        phone: itm.phone,
        domain_name : itm.domain_name,
        roles : itm.roles,
        is_active : itm.is_active,
        items : itm.items
      });
    });
  }

  return (
    <Layout className="main">
      <Content
        className="site-layout-background"
        style={{
          padding: 12,
          margin: 0,
          minHeight: "100vh",
        }}
      >
        <Row align="middle">
        <ReloadOutlined  title={"refresh data"}  onClick={()=>{GetAllUserdetails(state,dispatch,state.userId);}}/>
            <h2 className="page-title">
            {"   Manage Users -  "}
              { listUsers.length}
            </h2>
        </Row>
        <Row align="middle" >
          <Col span={24}>
            <Table 
            dataSource={tableData} columns={tableColmnsTitle}  
            pagination={{ defaultPageSize: 50  }}
            ></Table>
          </Col>
        </Row>
        <Row align="middle" >
          { editUser !== null ?
          <Modal title={"Edit User "}  visible={ editUser !== null }  centered={true}
          onCancel={()=>setEditUser(null)} closable={true} >
          <Form      name="basic"
              initialValues={{ username: editUser.username, email: editUser.email, 
                phone : editUser.phone }}
              onFinish={setUpdateRecord}
              layout="vertical" form={form}
            >         
              <Form.Item
                label="Name"
                name="username"
                rules={[
                  { required: true, message: "Please enter your email!" },
                ]}
              >
              <Input type={"text"} key={editUser.id+"un"}  ></Input>
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter correct email!",
                  },
                ]}
              >
            <Input  type={"email"} key={editUser.id+"em"}  ></Input>
              </Form.Item>
              <Form.Item
                label="Mobile"
                name="phone"
                rules={[
                  {
                    message: "Please enter a mobile",
                  },
                ]}
              >
            <Input  type={"text"} key={editUser.id+"ph"}  ></Input>
              </Form.Item>
              <Form.Item
                label="Role"
                name="roles"
                rules={[
                  { 
                    message: "Please select a role",
                  },
                ]}
              >
            <Select  key={editUser.id+"ro"} value={editUser.roles} 
              onChange={(value)=>{ setEditUser({ ...editUser, roles: value}); console.log(editUser)} }     >
              { state.userObj.roles === "super_admin" ?
              <Option key="reseller" value="reseller">reseller</Option>:null}
              <Option key="team" value="team">team</Option>
              <Option key="admin" value="admin">admin</Option>
              <Option key="user" value="user">user</Option>
              <Option key="viewer" value="viewer">viewer</Option>                                    
              </Select>   </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Update
                </Button>
              </Form.Item>
        </Form>
          </Modal>  : null }
        </Row>
      </Content>
    </Layout>
  );
};

export default ManageUsers;
