import React, { useContext, useState , useEffect } from "react";
import { Layout, Row, Divider, Table, Switch, Button,
  Form,Col,message, Input,Select, Tooltip, Tag } from "antd";
import { InfoCircleOutlined, EditOutlined,  DeleteOutlined,
  LinkOutlined,  PlusOutlined, ReloadOutlined
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from 'axios';
import {url , Getroledetails} from '../API/index';
import Modal from "antd/lib/modal/Modal";

const ManageRoles = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);
  const [listRoles , setListRoles] = useState([]);
  const [valueScope , setValueScope] = useState([]);
  const [valueCR , setValueCR] = useState([]);
  const [editRole , setEditRole] = useState(null);
  const [createrole,setCreaterole] = useState(null);

  const scopes = ['Createrole', 'Editrole', 'Deleterole', 'Readrole', 'Listrole', 'CreateAccount', 'EditAccount', 'DeleteAccount',
   'ReadAccount', 'ListAccount', 'ReadItem', 'EditItem', 'UploadItem', 'DeleteItem', 'ShareItem', 'EmbedItem', 'DownloadItem', 
   'ListItem', 'ReadChannel', 'EditChannel', 'CreateChannel', 'DeleteChannel', 'ListChannel', 'ReadFolder', 'EditFolder', 'CreateFolder', 
   'DeleteFolder', 'ListFolder', 'ReadPlaylist', 'EditPlaylist', 'CreatePlaylist', 'DeletePlaylist', 'ListPlaylist', 'ReadSeries', 
   'EditSeries', 'CreateSeries', 'DeleteSeries', 'ListSeries']

  const {Option} = Select;
  const {form} = Form.useForm();

 const GetAllRoledetails= async (state,dispatch ,roleId)=>{
    if (roleId === undefined )
       return [];
    const tempFolders = await axios.get(url + `/roles`, {
       headers: {
          accept: 'application/json', Authorization : "bearer "+state.token,
             }
    }).then(res => {
        setListRoles(res.data);
       return res.data;   }).catch(err=> {});
    console.log(" roledata in get ", tempFolders);
    return tempFolders;
 }

 const updateRecord= async (state,dispatch ,obj , switchValue)=>{
  if (state.userId === undefined || state.userId === null)
     return ;
     if(switchValue === "toggle")    obj.is_active = !obj.is_active;
  const tempFolders = await axios.put(url + `/roles/${obj.id}`, obj ,{
     headers: {
        accept: 'application/json', Authorization : "bearer "+state.token,
           }
  }).then(res => {
    message.success(`No of rows updated ${res.data}`);
    setEditRole(null);     return res.data;   })
  console.log(" roledata in get managerole ", tempFolders);
  return tempFolders;
}

const setUpdateRecord=(values)=>{
  let writeobj = editRole;  
  writeobj.title = values.title;  writeobj.scope = values.scope;writeobj.description = values.description;
  writeobj.rolename = values.rolename; writeobj.status = true; writeobj.child_roles = values.child_roles;
  writeobj.created_by = state.userId; writeobj.updated_by = state.userId;
  updateRecord(state,dispatch,writeobj,"notoggle");
}

const writeRecord= async (state,dispatch ,obj )=>{
  if (state.userId === undefined || state.userId === null)
     return ;
  const tempFolders = await axios.post(url + `/roles`, obj ,{
     headers: {
        accept: 'application/json', Authorization : "bearer "+state.token,
           }
  }).then(res => {
    setEditRole(null);
    message.success(`role with email ${res.data.rolename} created`);
     return res.data;   })
  console.log(" roledata in get managerole ", tempFolders);
  return tempFolders;
}

const initWriteRecord = ()=>{
  let dummy = {'rolename' : '','title':'','crearted_by':'','updated_by':'','scope':[],'description':'','status':'','child_roles':[]};
  setCreaterole(true);  setEditRole(dummy);
}


const setwriteRecord=(values)=>{
  let writeobj = editRole;  
  writeobj.title = values.title;  writeobj.scope = values.scope;writeobj.description = values.description;
  writeobj.rolename = values.rolename; writeobj.status = true; writeobj.child_roles = values.child_roles;
  writeobj.created_by = state.userId; writeobj.updated_by = state.userId;
  console.log( values , writeobj);
  writeRecord(state,dispatch,writeobj);
  setCreaterole(null);
}


 useEffect(()=>{
  GetAllRoledetails(state,dispatch,state.userId);
 },[]);



 const scopeProps = {
  mode: 'multiple' ,
  style: { width: '100%' },
  valueScope,
  onChange: (newValue) => {
    setValueScope(newValue);
  },
  placeholder: 'Select Item...',
  maxTagCount: 'responsive' ,
};

const roleProps = {
  mode: 'multiple' ,
  style: { width: '100%' },
  valueCR,
  onChange: (newValue) => {
    setValueCR(newValue);
  },
  placeholder: 'Select Item...',
  maxTagCount: 'responsive' ,
};
  // Table Columns
  let tableColmnsTitle = [
    {
      title: "#",
      dataIndex: "pos",
      key: "pos",
      responsive : ["md","lg"]
    },
    {
      title: "Role",
      dataIndex: "rolename",
      key: "rolename",
      responsive : ["lg"]
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
      render:(e,record)=>( e   )
      // /<Col xl={3} xxl={3} lg={3}  md={2} sm={2} xs={1} >
    },
    {
      title: "child_roles",
      dataIndex: "child_roles",
      key: "child_roles",
      render:(e,record)=>( record.child_roles.length   ),
    },
    {
      title: "scope",
      dataIndex: "scope",
      key: "scope",
      render:(e,record)=>( record.scope.length   ),
      responsive : ["md","lg"]
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: <Tooltip title="Make role Inactive, Edit role, Browse as role">
        <InfoCircleOutlined/>Actions</Tooltip>,
      dataIndex : "status",
      key: "status",
      render:(e,record)=>(<><Switch size={"small"}
      defaultChecked={e} onChange={()=>updateRecord(state,dispatch,record ,"toggle") }></Switch> &nbsp;&nbsp;
      <Button size={"small"} icon={<EditOutlined />} onClick={(value)=>{ setEditRole({...record})}} />
      </>),
    },
  ];

  let tableData = [];

  if (listRoles.length > 0) {
    listRoles.map((itm, ind) => {
      tableData.push({
        key: ind,
        pos : ind+1,
        id: itm.id,
        title: itm.title,
        rolename: itm.rolename,
        description: itm.description,
        scope : itm.scope,
        created_by : itm.created_by,
        status : itm.status,
        child_roles : itm.child_roles,
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
          <Button onClick={()=>{GetAllRoledetails(state,dispatch,state.userId);}}
          icon={<ReloadOutlined  title={"refresh data"} >   </ReloadOutlined>}>Refresh </Button>
        </Col>
        <Col span={16}><h2 className="page-title">
            {"  Roles -  "}
              { listRoles.length}
            </h2></Col>
          <Col span={4}>
      <Button onClick={()=>{ initWriteRecord()}} icon={<PlusOutlined title={"Create role"}  />}>
        Create role</Button></Col>
        </Row>
        <Row align="middle" >
          <Col span={24}>
            <Table style={{width: "100vw"}}
            dataSource={tableData} columns={tableColmnsTitle}
            pagination={{ defaultPageSize: 50  }}
            expandable={{
              expandedRowRender: record => <>
                   {"split" in record.child_roles ?"CHILD ROLES : " + record.child_roles.split(",").map(ob => (<Tag>{ob}</Tag>) ) : null } 
                   { "split" in record.scope ? "SCOPES : " + record.scope.split(",").map(ob => (<Tag>{ob}</Tag>) )  : null }
                </>
              ,
              rowExpandable : record => true
            }}
            ></Table>
          </Col>
        </Row>
        <Row align="middle" >
          { editRole !== null ?
          <Modal title={createrole ?"Create role":"Edit role "}  visible={ editRole !== null }  centered={true}
          onCancel={()=>{ setEditRole(null);setCreaterole(null); }} closable={true} footer={null}>
          <Form      name="basic"
              initialValues={{ rolename: editRole.rolename, title: editRole.title,
                child_roles : editRole.child_roles, scope : editRole.scope,
              description : editRole.description }}
              onFinish={ createrole == true ? setwriteRecord : setUpdateRecord}
              layout="vertical" form={form}
            >
              <Form.Item
                label="RoleName"
                name="rolename"
                rules={[
                  { required: true, message: "Please enter a unique RoleName!" },
                ]}
              >
              <Input type={"text"} key={editRole.id+"un"}  ></Input>
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please enter a unique title",
                  },
                ]}
              >
            <Input  type={"text"} key={editRole.id+"em"}  ></Input>
              </Form.Item>
                <Form.Item
                label="Child Roles"
                name="child_roles"
              >
                <Select {...roleProps} >
                { listRoles.map(ob=>  <Option label={ob.rolename}  value={ob.rolename}>{ob.rolename}</Option> ) }
                  </Select>   
              </Form.Item>     
              <><Form.Item
                label="scope"
                name="scope"
              >
              <Select {...scopeProps} >
              {scopes.map(ob =>  <Option label={ob}  value={ob}>{ob}</Option> ) }
            </Select>
                
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
              >
                <Input.TextArea   key={editRole.id+"desc"}  />
               </Form.Item> </> 
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  {createrole ?"Create" : "Update"}
                </Button>
              </Form.Item>
        </Form>
          </Modal>  : null }
        </Row>
      </Content>
    </Layout>
  );
};

export default ManageRoles;
