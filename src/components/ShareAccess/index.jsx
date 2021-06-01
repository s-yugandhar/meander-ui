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
  const tempFolders = await axios.get(url + `/listfriends/${userId}`, {
     headers: {
        accept: 'application/json', Authorization : "bearer "+state.token,
           }
  }).then(res => {
     if ( res.status === 200)    
      dispatch({ type:"ACCESS_OUT",  payload : {  accessOut : [ ...res.data ] } });
     console.log(res.data);
      return res.data;   })
  return tempFolders;
}


const ShareAccess = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);
  const [listUsers , setListUsers] = useState([]);
  const [allUsers , setAllUsers] = useState([]);
  const [editUser , setEditUser] = useState(null);
  const [createUser,setCreateUser] = useState(null);
  const [srch,setSrch] = useState(null);

  const {Option} = Select;
  const {form} = Form.useForm();
 
useEffect(()=>{
    GetSharedUsersdetails(state,dispatch,state.userId);
},[state.userObj])

const searchEmail=async (state,dispatch ,key)=>{
    if( key.includes('@') && key.includes('.')){
      const tempFolders = await axios.get(url + `/searchuser/${state.userId}?email=${key}`,{
  headers: {
     accept: 'application/json', Authorization : "bearer "+state.token,
        }
}).then(res => {
  //message.success(`Update succesful , refresh to see changes`);
  console.log(res);
  return res;   })

  if(tempFolders.status === 200)
    setAllUsers(tempFolders.data);
return tempFolders;
}


};

 let tableData = [];

  if ( state.accessOut.length > 0) {
    state.accessOut.map((itm, ind) => {
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



const changePermission= async (value, record ,remove )=>{
let rem = false;
  if (remove === true) rem = true;
const tempFolders = await axios.get(url + `/setfriend/${state.userId}?
role=${value}&friend_id=${record.id}&remove=${rem}`,{
  headers: {
     accept: 'application/json', Authorization : "bearer "+state.token,
        }
}).then(res => {
  if(res.status === 200)
  message.success(`Update succesful `);
  GetSharedUsersdetails(state,dispatch,state.userId); setAllUsers([]);
  console.log(res);
  return res.data;   })
return tempFolders;
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
    setSrch(res.data.email);searchEmail(state,dispatch,res.data.email)
    message.success(`User with email ${res.data.email} created`);
     return res.data;   }).catch(err => message.success(`Error while creating User`))
  console.log(" userdata in get manageuser ", tempFolders);
  return tempFolders;
}

const initWriteRecord = ()=>{
  let dummy = {'username' : '','email':'','password':'','domain_name':window.location.hostname};
  setCreateUser(true);  setEditUser(dummy);
}


const setwriteRecord=(values)=>{
  let writeobj = editUser;  writeobj.username = values.username;
  writeobj.email = values.email;  writeobj.password = values.password;
  console.log( values , writeobj);
  writeRecord(state,dispatch,writeobj);
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
      title: "ShareARole",
      dataIndex: "access",
      key: "access",
      render:(e,record)=>(  
        record.access !== undefined || record.access !== null?
         <Select  value={ record.access.viewer.includes(state.userObj.id)? "viewer": 
      record.access.user.includes( state.userObj.id)? "user" :
      record.access.admin.includes( state.userObj.id)? "admin" : ""}
      onChange={(value)=> changePermission(value , record,false) }
      >
        <Option key="admin" value="admin" >Admin</Option>
        <Option key="" value=""></Option>
        <Option key="user" value="user">Editor</Option>
        <Option key="viewer" value="viewer">Viewer</Option>
    </Select>  : null    )
    },
    {
      title: "RemoveRole",  key: "actions",
      render: (e,record) => (
        <Button icon={<DeleteOutlined />} 
        onClick={e=> changePermission("admin",record,true)   } /> )
      },
  ];

  return (
      <>
        <Row align="middle">
        <Col span={12}><h4 >
            {" Following people can see your videos -  "}
              { state.accessOut.length}
            </h4></Col>

            <Col span={6}>
            <Input type="search"  value={srch} 
            closable={true}
             onChange={e  => { setSrch(e.target.value);searchEmail(state,dispatch,e.target.value)}}
            placeholder={"search email...."}
            onBlur={e=> setSrch("")}
            ></Input>
            </Col>
          <Col span={4}>
        <Button onClick={()=>{ initWriteRecord()}} icon={<PlusOutlined title={"Create User"}  />}>
        Create User</Button></Col>
        <Col span={2}>
          <Button onClick={()=>{GetSharedUsersdetails(state,dispatch,state.userId); setAllUsers([]); }}
          icon={<ReloadOutlined  title={"refresh data"} >   </ReloadOutlined>}></Button>
        </Col>
        </Row>
        <Row>
        { allUsers.length > 0 ?
        "   Use make buttons to update roles and click reload in top right":null}
        { allUsers.length > 0 ?
            allUsers.map((ob)=>{
              return  <Row >
                <Col span={12}>{ob.email}</Col>
                <Col span={6}><button key={ob.id+"dfsdf"} size="small"
                onClick={(e)=> changePermission("user",ob,false) }
                >Make Editor</button></Col>
                <Col span={6}><button key={ob.id+"vifsf"} size="small"
                onClick={(e)=> changePermission("viewer",ob,false) }
                >Make Viewer</button></Col>
              </Row>
            })
            :null}
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
          onCancel={()=>setEditUser(null)} closable={true} footer={null}>
            <Row>
        { allUsers.length > 0 ?
        "   Use make buttons to update roles and click reload in top right":null}
        { allUsers.length > 0 ?
            allUsers.map((ob)=>{
              return  <Row >
                <Col span={12}>{ob.email}</Col>
                <Col span={6}><button key={ob.id+"dfsdf"} size="small"
                onClick={(e)=> changePermission("user",ob,false) }
                >Make Editor</button></Col>
                <Col span={6}><button key={ob.id+"vifsf"} size="small"
                onClick={(e)=> changePermission("viewer",ob,false) }
                >Make Viewer</button></Col>
              </Row>
            })
            :null}
        </Row>
          <Form      name="basic"
              initialValues={{ username: editUser.username, email: editUser.email,
                phone : editUser.phone, password : editUser.password }}
              onFinish={  setwriteRecord }
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
            <Input  type={"email"} key={editUser.id+"em"}  
            onChange={e  => { setSrch(e.target.value);searchEmail(state,dispatch,e.target.value)}}
            onBlur={e=> setSrch("")}
            ></Input>
              </Form.Item>
              { createUser ?
                <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'password is required',
                  }, {
                    pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message: 'Please enter minimum 8 letter password, with at least a symbol, upper and lower case letters and a number ',
                  }    ]}
              >
                <Input.Password name="password" id="password" />
              </Form.Item>      :
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
              {/*<Option key="admin" value="admin">admin</Option>*/}
              <Option key="user" value="user">editor</Option>
              <Option key="viewer" value="viewer">viewer</Option>
              </Select>   </Form.Item> </> }
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Create
                </Button>
              </Form.Item>
        </Form>
          </Modal>  : null }
        </Row>
      </>
  );
};

export default ShareAccess;
