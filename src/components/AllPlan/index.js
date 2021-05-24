import React, { useContext, useState , useEffect , ReactDOM } from "react";
import { Layout, Row, Divider, Table, Switch, Button,
  Form,Col,message, Input,Select,Alert,Space, Checkbox } from "antd";
import {  EditOutlined, EyeOutlined} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from 'axios';
import {GetUserdetails, url} from '../API/index';
import Modal from "antd/lib/modal/Modal";


let planobject = {
    'planname':"basic",
    'priceinrs':0.0,
    'storesize': 1024*1024*1024 ,
    'bandwidth':10*1024*1024*1024,
    'comment' : 'Default comment ' ,
    'planduration':   86400  ,
    'updatetime': new Date().getTime()/1000,
    'published':false,
    'privacy':false,
    'player':false,
    'collaboration':false,
    'analytics':false,
    'support':false,
    'streaming':false,
}

const Plans = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);
  const {Option} = Select;
  const {form} = Form.useForm();
  const [planlist,setPlanlist] = useState([]);
  const [showModal,setShowModal] = useState(false);
  const [editObj , setEditObj] = useState(null);
  

useEffect(()=>{
    getPlans(state,dispatch);
},[])

const getPlans = async( state , dispatch)=>{
    const tempFolders = await axios.get(url + `/plans?published=${false}`, {
        headers: {
           accept: 'application/json', Authorization : "bearer "+state.token,
              }
     }).then(res => {
       dispatch({type:'APP_PLANS', payload:{ appPlans : res.data  }});
       return res.data;   }).catch(err=> message.info(`Error fetching plans`));
}

const postPlans = async ( state,dispatch, obj , plan_id)=>{
    let append = `/plans?user_id=${state.userId}`
    if (plan_id !== undefined && plan_id !== null)
        append = `/plans/${plan_id}?user_id=${state.userId}`
    const tempFolders = await axios.post(url + append , obj , {
        headers: {
           accept: 'application/json', Authorization : "bearer "+state.token,
              }
     }).then(res => {
         setEditObj(null);
       message.success(`No of rows updated ${res.data}`);
        getPlans(state,dispatch);
       return res.data;   }).catch(err=> message.info(`Error Creating or updating plans`));
}

const setWriteRecord = (values)=>{
    console.log(values , editObj);
    values.updatetime = new Date().getTime()/1000;
    values.storesize = editObj.storesize;    
    if( "id" in editObj){
        postPlans(state,dispatch,values , editObj.id);}
    else{postPlans(state,dispatch,values , null);
    }
}

 let tableData = [];

  if ( state.appPlans !== null && state.appPlans !== undefined &&  
    state.appPlans.length > 0) {
    state.appPlans.map((itm, ind) => {
      tableData.push({
        key: ind,    pos : ind+1,    id: itm.id,
        planname: itm.planname,  priceinrs : itm.priceinrs,   
        published : itm.published,collaboration : itm.collaboration ,
        privacy : itm.privacy , player : itm.player ,
        support : itm.support , streaming : itm.streaming ,
        analytics : itm.analytics ,  planduration : itm.planduration ,
        updatetime : itm.updatetime, storesize : itm.storesize , bandwidth:itm.bandwidth

      });
    });
  }

   // Table Columns
  let tableColmnsTitle = [
     {
      title: "PlanName",
      dataIndex: "planname",
      key: "planname",
      render:(e,record)=>( record.planname    )
    },   
    {  title: "Price",
      dataIndex: "priceinrs",
      key: "priceinrs",
    },
    {  title: "Duration",
      dataIndex: "planduration",
      key: "planduration",
    },
    {   title: "storesize",
        dataIndex: "storesize",
        key: "storesize",
      }, 
    {    title: "Bandwidth",
        dataIndex: "bandwidth",
        key: "bandwidth",
      },
    {
      title: "Published",
      dataIndex: "published",
      key: "published",
     },
     {
         title: "View/Edit" ,
        dataIndex: "actions" ,
        render: (e,record) => (
            <Button icon={state.userObj !== null && state.userObj !== undefined  && 
                state.userObj.roles === "super_admin"?
            <EditOutlined /> : <EyeOutlined/>} 
            onClick={e=> {setEditObj(record); console.log(record) }} /> )
     }
  ];

  return (    
      <>
      <Layout>
        <Row >
        <Col span={16}><h4 className="">
            {" No of Plans -  "}
              { state.appPlans===undefined || state.appPlans === null  ? 0 :state.appPlans.length}
            </h4></Col>          
        <Col span={8}>
            { state.userObj !== null && state.userObj !== undefined  && 
            state.userObj.roles === "super_admin"?
            <Button onClick={(e)=>setEditObj(planobject)}>Create Plan</Button> : null}
        </Col>
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
        </Layout>
        <Modal title={"Plan Modal"}  visible={ editObj !== null }  centered={true}
          onCancel={()=>setEditObj(null)} closable={true} footer={null}>
          <Form      name="basic"
              initialValues= { {...editObj }}
              onFinish={  setWriteRecord }
              layout="vertical" form={form}
            >
                <Row>
                <Col span={12}>
              <Form.Item
                label=""
                name="planname"
                rules={[
                  { required: true, message: "Please enter plan name" },
                ]}
              >
              <Input addonBefore={"Name"} type={"text"} key={"planname"}  ></Input>
              </Form.Item></Col>
              <Col span={2}></Col>
              <Col span={10}>
              <Form.Item     label=""   name="published" valuePropName="checked">
                <Checkbox>Published</Checkbox>
               </Form.Item> </Col>
              </Row>
              <Row><Col span={12}>
                {/*<Form.Item    label=""   name= { "storesize" }
                rules={[ { required: true, message: "Please set storesize in bytes" }, ]}>*/}
               <Input addonBefore={" storesize "} type={"number"} key={"storesize"}  addonAfter={"GB"}
              value={editObj ? editObj.storesize : 0}
              onChange={e => {setEditObj({ ...editObj , storesize : e.target.value}); }  }></Input>
              {/*</Form.Item>*/}
              </Col>
              <Col span={12}>
              <Form.Item    
              label=""  
               name={"bandwidth"}
                rules={[  { required: true, message: "Please set bandwidth in bytes" },  ]}    > 
              <Input addonBefore={"bandwidth"} addonAfter={"GB"} type={"number"} key={"bandwidth"}  
              value={editObj ? editObj.bandwidth : 0}
              onChange={value=> setEditObj({ ...editObj , bandwidth : value})    }></Input>   
              </Form.Item> </Col>              
              </Row>
              <Row><Col span={12}>
              <Form.Item   label=""    name="priceinrs"
                rules={[{ required: true, message: "Please enter plan name" }, ]}
              >
              <Input addonBefore={"Price "} type={"number"} key={"priceinrs"} addonAfter={"Rs"} ></Input>
              </Form.Item></Col>
              <Col span={12}>
              <Form.Item    label=""    name="planduration"
                rules={[ { required: true, message: "Please duration in secs" },]}
              >
              <Input addonBefore={"Duration"} type={"number"} key={"planduration"}  addonAfter={"Days"}
               ></Input>
              </Form.Item></Col>
              </Row>
              <Row>   <Col span={8}>
              <Form.Item     label=""   name="privacy" valuePropName="checked">
                <Checkbox>Privacy</Checkbox>
               </Form.Item> </Col>
               <Col span={8}>
               <Form.Item     label=""   name="player" valuePropName="checked">
                <Checkbox>Player</Checkbox>
               </Form.Item></Col>
               <Col span={8}>
               <Form.Item     label=""   name="streaming" valuePropName="checked">
                <Checkbox>Streaming</Checkbox>
               </Form.Item>               </Col>               </Row>
               <Row>        <Col span={8}>
               <Form.Item     label=""   name="analytics" valuePropName="checked">
                <Checkbox>Analytics</Checkbox>
               </Form.Item>            </Col>
               <Col span={8}>
               <Form.Item     label=""   name="collaboration" valuePropName="checked">
                <Checkbox>Collaboration</Checkbox>
               </Form.Item>            </Col>
               <Col span={8}>
               <Form.Item     label=""   name="support" valuePropName="checked">
                <Checkbox>Support</Checkbox>
               </Form.Item>       </Col>
               </Row>
                <Row>   
                <Form.Item>   
                {state.userObj !== null && state.userObj !== undefined  && 
            state.userObj.roles === "super_admin"?   
                <Button type="primary" htmlType="submit" size="large">
                  Create
                </Button> : "View Only"} </Form.Item>   </Row>
        </Form>
          </Modal>

      </>
    
  );
};

export default Plans;
