import React, { useContext, useState , useEffect } from "react";
import { Layout, Row, Divider, Table, Switch, Button,
 Content, Form,Col,message, Input,Select, Tooltip, Tag,Modal , Card } from "antd";
import { InfoCircleOutlined, EditOutlined,  DeleteOutlined,
  LinkOutlined,  PlusOutlined, ReloadOutlined
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import axios from 'axios';
import {url , Getroledetails} from '../API/index';
import { Recording} from '../MsrRecording';
import UppyUpload from '../UppyUpload';

export const MyAudiosUpload = () => {
    const { Header, Footer, Content } = Layout;
    const [screenRec,setScreenRec] = useState(false);

return (
    /*<Card    title={null}   mask={null} maskTransitionName={null}
    destroyOnClose={true} 
    visible={true}  style={{  top : 64 , bottom: 0 , right : 0 , left : 0 , overflow : "hidden",
    width:"100vw", display:"flex" , flexFlow : "column" ,height:"100%"}} 
    onOk=""                onCancel={(e)=> { setScreenRec(false);} }
    footer={null}        width={"100vw"}       
>*/
    <Layout style={{ minHeight: "100vh",backgroundColor:"white" }}>
        <Row className="py-1 bg-white">
            <Col span="12" className="uploadVideoTitle" style={{textAlign:"right"}} onClick={e=>{ setScreenRec(false);   }}>
            Upload Video  
            </Col>
            <Col span="10" className="uploadVideoTitle" style={{textAlign:"left"}} onClick={e=>{setScreenRec(true) }}>
                |  Screen Recording
            </Col>
        </Row>
        { screenRec ? <Recording />  :  
        <Row>
            <Col span={4}></Col>
        <Col span={16} > <UppyUpload  mimeType="audio"  /> </Col>
            <Col span={4}></Col>
        </Row> } 
    </Layout>     )

}