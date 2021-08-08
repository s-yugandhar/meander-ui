import React, { useContext, useState , useEffect } from "react";
import { Layout, Row, Divider, Table, Switch, Button,
  Form,Col,message, Input,Select, Tooltip, Tag } from "antd";
import { InfoCircleOutlined, EditOutlined,  DeleteOutlined,
  LinkOutlined,  PlusOutlined, ReloadOutlined
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from 'axios';
import {url , GetUserdetails} from '../API/index';
import Modal from "antd/lib/modal/Modal";

const ManageUsers = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);
  const [listUsers , setListUsers] = useState([]);
  const [editUser , setEditUser] = useState(null);
  const [createUser,setCreateUser] = useState(null);
  const [childRoles,setChildRoles] = useState([]);

  const {Option} = Select;
  const {form} = Form.useForm();

  
 const GetChildRoles =  async (state,dispatch )=>{
  const tempFolders = await axios.get(url + `/roles/one`, {
     headers: {
        accept: 'application/json', Authorization : "bearer "+state.token,
           }
  }).then(res => {
      if("child_roles" in res.data)
         setChildRoles(res.data.child_roles);
     return res.data;   }).catch(err => {
      message.open("Error in fetching child roles");
      setChildRoles([])}  );
  console.log(" userdata in get ", tempFolders);
  return tempFolders;
}


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

 const updateRecord= async (state,dispatch ,obj , switchValue)=>{
  if (state.userId === undefined || state.userId === null)
     return ;
     if(switchValue === "toggle")    obj.is_active = !obj.is_active;
  const tempFolders = await axios.post(url + `/users/${state.userId}/updateuser`, obj ,{
     headers: {
        accept: 'application/json', Authorization : "bearer "+state.token,
           }
  }).then(res => {
    message.success(`No of rows updated ${res.data}`);
    setEditUser(null);     return res.data;   })
  console.log(" userdata in get manageuser ", tempFolders);
  return tempFolders;
}

const setUpdateRecord=(values)=>{
  let objinit = editUser;objinit.username=values.username;
  objinit.phone=values.phone;  objinit.email =values.email;
  updateRecord(state,dispatch,objinit,"notoggle");
}

const writeRecord= async (state,dispatch ,obj )=>{
  if (state.userId === undefined || state.userId === null)
     return ;
  const tempFolders = await axios.post(url + `/users/${state.userId}/createuser`, obj ,{
     headers: {
        accept: 'application/json', Authorization : "bearer "+state.token,
           }
  }).then(res => {
    setEditUser(null);
    message.success(`User with email ${res.data.email} created`);
     return res.data;   })
  console.log(" userdata in get manageuser ", tempFolders);
  return tempFolders;
}

const initWriteRecord = ()=>{
  let dummy = {'username' : '','email':'','password':'','domain_name':window.location.hostname,'roles':"viewer" };
  setCreateUser(true);  setEditUser(dummy);
}


const setwriteRecord=(values)=>{
  let writeobj = editUser;  writeobj.username = values.username;
  writeobj.email = values.email;  writeobj.password = values.password;
  console.log( values , writeobj);
  writeRecord(state,dispatch,writeobj);
}

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



 useEffect(()=>{
   GetChildRoles(state,dispatch);
  GetAllUserdetails(state,dispatch,state.userId);
 },[]);

  // Table Columns
  let tableColmnsTitle = [
    {
      title: "#",
      dataIndex: "pos",
      key: "pos",
      responsive : ["md","lg"]
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
      responsive : ["lg"]
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render:(e,record)=>( e   )
      // /<Col xl={3} xxl={3} lg={3}  md={2} sm={2} xs={1} >
    },
    {
      title: "Mobile",
      dataIndex: "phone",
      key: "phone",
      responsive : ["md","lg"]
    },
    {
      title: state.userObj.roles === "super_admin"?"domain" : "",
      dataIndex: "domain_name",
      key: "domain_name",
      render:(e,record)=>(state.userObj.roles === "super_admin"? e : ""),
      responsive : ["md","lg"]
    },
    {
      title: "roles",
      dataIndex: "roles",
      key: "roles",
      responsive : ["md","lg"]
    },
    {
      title: <Tooltip title="Make user Inactive, Edit user, Browse as User">
        <InfoCircleOutlined/>Actions</Tooltip>,
      dataIndex : "is_active",
      key: "is_active",
      render:(e,record)=>(<>
      { state.archiveAccount === null && state.userObj.id !== record.id?
      <><Switch size={"small"}
      defaultChecked={e} onChange={()=>updateRecord(state,dispatch,record ,"toggle") }></Switch>
      &nbsp;
        <Button size={"small"} icon={<EditOutlined />} onClick={(value)=>{ setEditUser({...record})}} />
        &nbsp;<Tooltip title={`Browse as user ${record.email}`}>
       <Button size={"small"} onClick={e => toggleToUser(state,dispatch,record)}>Switch</Button></Tooltip> 
      </> : null }</>),
    },
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
        items : itm.items,
        originsize: itm.originsize,
        originserved: itm.originserved,
        bridgeserved: itm.bridgeserved,
        access : itm.access
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
        <Col span={4}>
          <Button onClick={()=>{GetAllUserdetails(state,dispatch,state.userId);}}
          icon={<ReloadOutlined  title={"refresh data"} >   </ReloadOutlined>}>Refresh </Button>
        </Col>
        <Col span={16}><h2 className="page-title">
            {"  Users -  "}
              { listUsers.length}
            </h2></Col>
          <Col span={4}>
      <Button onClick={()=>{ initWriteRecord()}} icon={<PlusOutlined title={"Create User"}  />}>
        Create User</Button></Col>
        </Row>
        <Row align="middle" >
          <Col span={24}>
            <Table
            dataSource={tableData} columns={tableColmnsTitle}
            pagination={{ defaultPageSize: 50  }}
            expandable={{
              expandedRowRender: record => <>
                   <Tag>{"Videos : "+record.items.length}  </Tag>
                   <Tag>{"Storage : "+ Number(record.originsize/(1024*1024)).toFixed(2) } </Tag>
                   <Tag>{"Bandwidth : "+ Number((Number(record.originserved) +Number(record.bridgeserved))/(1024*1024)).toFixed(2) }</Tag>
                </>
              ,
              rowExpandable : record => true
            }}
            ></Table>
          </Col>
        </Row>
        <Row align="middle" >
          { editUser !== null ?
          <Modal title={createUser ?"Create User":"Edit User "}  visible={ editUser !== null }  centered={true}
          onCancel={()=>{ setEditUser(null);setCreateUser(null); }} closable={true} footer={null}>
          <Form      name="basic"
              initialValues={{ username: editUser.username, email: editUser.email,
                phone : editUser.phone, password : editUser.password }}
              onFinish={ createUser == true ? setwriteRecord : setUpdateRecord}
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
              { createUser ? 
                <Form.Item    label="Password"       name="password" hidden="true"
                rules={[  { required: false,    message: 'password is required',    }, {
                    pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message: 'Please enter minimum 8 letter password, with at least a symbol, upper and lower case letters and a number ',
                  }    ]}
              > <Input.Password name="password" id="password" />
                </Form.Item>  :
              <><Form.Item
                label="Mobile"
                name="phone"
                rules={[
                  {
                    message: "Please enter a mobile",
                  },
                ]}
              >
            <Input  type={"text"} key={editUser.id+"ph"}  ></Input>
              </Form.Item> </> }
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
              { childRoles.map((ob,index) =>
                  (<Option key={ob} value={ob}>{ob}</Option>)
              ) }
              
              </Select>   </Form.Item> 
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  {createUser ?"Create" : "Update"}
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
